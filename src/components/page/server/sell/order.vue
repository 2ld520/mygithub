<template>
  <div>
    <div class="navbar">
      <van-row>
        <van-col span="5"
          ><van-icon name="arrow-left" size="30" @click="back"
        /></van-col>
        <van-col span="10" offset="4">确认订单</van-col>
      </van-row>
    </div>
    <van-card
      num="1"
      :desc="goodsdesc(this.goods.goodstext)"
      :title="goodsname(this.goods.goodsname)"
      :thumb="getimg(this.goods.goodsimg)"
    />

    <van-field
      v-model="address"
      placeholder="请输入收货地址"
      label="收货地址"
    />

    <van-submit-bar
      :price="goodsprice(this.goods.goodsprice)"
      button-text="提交订单"
      @submit="crorder"
    />
    <van-dialog
      v-model="show"
      title="支付"
      show-cancel-button
      :beforeClose="beforeClose"
      bind:stopLoading="do"
    >
      <van-field
        v-model="paypassword"
        type="password"
        label="支付密码"
        placeholder="默认为身份证后六位"
      />
    </van-dialog>
  </div>
</template>

<script>
import qs from 'qs'
import { Toast } from 'vant'
export default {
  data () {
    return {
      show: false,
      goods: {},
      address: '',
      paypassword: ''
    }
  },
  methods: {
    async getid () {
      let id = this.$route.params.id
      let res = await this.axios.get('/api/goodsid', { params: { 'id': id } })
      this.goods = res.data
      console.log(this.goods)
    },
    back () {
      this.$router.back(-1)
    },
    getimg (url) {
      return '/api/imgage/' + url
    },
    goodsname (val) {
      return '商品名称:' + val
    },
    goodsdesc (val) {
      return '商品描述:' + val
    },
    goodsprice (val) {
      return val * 100
    },
    crorder () {
      if (this.address !== '') { this.show = true } else {
        Toast('收货地址不能为空')
      }
    },
    async beforeClose (action, done) {
      if (action === 'confirm') {
        let stunum = sessionStorage.getItem('usernum')
        let payword = this.paypassword
        // @res  确认支付密码是否正确
        let res = await this.axios.post('/api/checkaccount', qs.stringify({ 'stunum': stunum, 'payword': payword }))
        console.log(res)
        if (res.data.state === 1) {
          // @res2 创建订单信息
          // console.log(this.address, stunum, this.goods.goodsid, this.goods.sellerstunum, this.goods.goodsname)

          if (res.data.data < this.goods.goodsprice) {
            Toast.fail('余额不足')
            done(false)
          } else {
            let res2 = await this.axios.post('/api/ordercreat', qs.stringify({
              'address': this.address,
              'buyerstunum': stunum,
              'goodsid': this.goods.goodsid,
              'sellerstunum': this.goods.stunum,
              'orderstate': 1,
              'goodsname': this.goods.goodsname,
              'goodsprice': this.goods.goodsprice,
              'sellername': this.goods.sellername,
              'goodsimg': this.goods.goodsimg
            }))
            let res3 = await this.axios.post('/api/jiesuan', qs.stringify({
              'stunum': stunum,
              'price': this.goods.goodsprice
            }))
            Toast.success('购买成功,可在我的订单中查看')
            setTimeout(this.$router.back(-1), 1000)
            done()
          }
        } else {
          Toast('支付密码错误')
          done(false)
        }
      } else if (action === 'cancel') {
        done() // 关闭
      }
    }
  },
  created () {
    this.getid()
  }
}
</script>

<style>
.navbar {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid silver;
}
</style>
