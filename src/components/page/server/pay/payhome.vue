<template>
  <van-pull-refresh
    v-model="isLoading"
    @refresh="onRefresh"
    style="height:100%"
  >
    <div class="pay_contain">
      <div class="pay_logo">
        <van-icon
          name="arrow-left"
          size="40"
          color="white"
          class="icon_back"
          @click="back"
        />
        <span class="title_text">在线缴费</span>
      </div>

      <div class="pay_window">
        <div class="pay_account">
          <van-icon name="card" />
          e通卡余额:&nbsp;<span>{{ account }}</span
          >&nbsp;元
          <br />
          <br />
          学号:{{ stunum }}
          <br />
          账户名:{{ accountname }}
        </div>
      </div>

      <van-cell title="费用清单" />

      <!-- ----------------------电费窗口---------------------- -->
      <van-collapse v-model="activeNames">
        <van-collapse-item name="1">
          <div slot="title">
            电费&nbsp;<img
              src="../../../../assets/img/light.png"
              class="pay_iconimg"
            />
          </div>
          <span :class="{ ok_money: light > 0, no_money: light < 0 }"
            >剩余余额:{{ light }}元</span
          >
          <van-button
            type="primary"
            size="mini"
            class="pay_btn"
            @click="chongzhi(1)"
            >缴费</van-button
          >
        </van-collapse-item>

        <!-- ------水费窗口------- -->
        <van-collapse-item name="2">
          <div slot="title">
            水费&nbsp;<img
              src="../../../../assets/img/water.png"
              class="pay_iconimg"
            />
          </div>
          <span :class="{ ok_money: water > 0, no_money: water < 0 }"
            >剩余余额:{{ water }}元</span
          >
          <van-button
            type="primary"
            size="mini"
            class="pay_btn"
            @click="chongzhi(2)"
            >缴费</van-button
          >
        </van-collapse-item>
      </van-collapse>

      <!-- ------------电费------------ -->
      <van-dialog
        v-model="show1"
        title="电费缴交"
        show-cancel-button
        :beforeClose="beforeClose"
      >
        <van-field
          v-model="money"
          label="充值金额"
          placeholder="请输入金额"
          type="digit"
        />
        <van-field
          v-model="paypassword"
          type="password"
          label="支付密码"
          placeholder="默认为身份证后六位"
        />
      </van-dialog>
      <!-- -----------水费------------ -->
      <van-dialog
        v-model="show2"
        title="水费缴交"
        show-cancel-button
        :beforeClose="beforeClose2"
        bind:stopLoading="do"
      >
        <van-field
          v-model="money"
          label="充值金额"
          placeholder="请输入金额"
          type="digit"
        />
        <van-field
          v-model="paypassword"
          type="password"
          label="支付密码"
          placeholder="默认为身份证后六位"
        />
      </van-dialog>
    </div>
  </van-pull-refresh>
</template>

<script>
import qs from 'qs'
import { Toast } from 'vant'

export default {

  data () {
    return {
      show1: false,
      show2: false,
      account: '',
      activeNames: ['0'],
      light: '',
      water: '',
      money: '',
      paypassword: '',
      accountname: '',
      stunum: '',
      tomoney: '',
      isLoading: false

    }
  },
  methods: {
    do (bool) {
      return bool
    },
    back () {
      this.$router.back(-1)
    },
    chongzhi (value) {
      if (value === 1) {
        this.show1 = true
      } else {
        this.show2 = true
      }
    },
    // 调用电费结算api
    async beforeClose (action, done) {
      if (action === 'confirm') {
        if (this.paypassword !== '') {
          let payword = parseInt(this.paypassword)
          // @res1 为判断支付密码是否正确
          let res1 = await this.axios.post('/api/checkaccount', qs.stringify({
            'stunum': this.stunum,
            'payword': payword
          }))
          // console.log(res1, res1.state == 1)
          if (res1.data.state === 1) {
            let res2 = await this.axios.post('/api/tolight', qs.stringify({
              'stunum': this.stunum,
              'lightmoney': this.money
            }))
            if (res2.data.state === 1) {
              Toast.success('缴费成功')
              this.money = ''
              this.paypassword = ''
              this.getaccount()
              done()
            } else if (res2.data.state === 5) {
              Toast.fail('余额不足')
              done(false)
            }
          } else {
            Toast('支付密码有误')
            done(false)
          }
        } else {
          Toast('支付密码不能为空')
          done(false)
        }
      } else if (action === 'cancel') {
        this.money = ''
        this.paypassword = ''
        done() // 关闭
      }
    },

    // 调用水费结算api
    async beforeClose2 (action, done) {
      if (action === 'confirm') {
        if (this.paypassword !== '') {
          let payword = parseInt(this.paypassword)
          // @res1 为判断支付密码是否正确
          let res1 = await this.axios.post('/api/checkaccount', qs.stringify({
            'stunum': this.stunum,
            'payword': payword
          }))
          if (res1.data.state === 1) {
            let res2 = await this.axios.post('/api/towater', qs.stringify({
              'stunum': this.stunum,
              'watermoney': this.money
            }))
            if (res2.data.state === 1) {
              Toast.success('缴费成功')
              this.money = ''
              this.paypassword = ''
              this.getaccount()
              done()
            } else if (res2.data.state === 5) {
              Toast.fail('e通卡余额不足')
              done(false)
            }
          } else {
            Toast('支付密码有误')
            done(false)
          }
        } else {
          Toast('支付密码不能为空')
          done(false)
        }
      } else if (action === 'cancel') {
        this.money = ''
        this.paypassword = ''
        done() // 关闭
      }
    },
    async getaccount () {
      let stunum = sessionStorage.getItem('usernum')
      let res = await this.axios.get('/api/findaccount', {
        params: {
          stunum: stunum
        }
      })
      this.account = res.data.allmoney
      this.light = res.data.lightmoney
      this.water = res.data.watermoney
      this.accountname = res.data.accountname
      this.stunum = res.data.stunum
    },
    onRefresh () {
      setTimeout(() => {
        Toast('刷新成功')
        this.isLoading = false
        this.getaccount()
      }, 1000)
    }

  },
  created () {
    this.getaccount()
  }
}
</script>

<style>
.ok_money {
  color: #00cdcd;
}
.no_money {
  color: red;
}
.pay_btn {
  float: right;
}
.pay_iconimg {
  width: 25px;
  position: relative;
  top: 7px;
}
.pay_account {
  width: 60%;
  position: relative;
  top: 30%;
  left: 20%;
  color: white;
  font-size: 1.2rem;
}
.pay_account span {
  font-size: 2rem;
}
.pay_contain {
  height: 700px;
}
.pay_window {
  height: 30%;
  background-color: #4876ff;
}
.icon_back {
  position: relative;
  top: 6px;
}
.pay_logo {
  height: 6%;
  line-height: 40px;
  font-size: 20px;
  font-weight: 500;

  position: relative;
  background-color: #4876ff;
  color: white;
}
.title_text {
  position: absolute;
  left: 40%;
  top: 10%;
}
</style>
