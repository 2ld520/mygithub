<template>
  <div class="contain">
    <div :class="{ Long: !show, login_box: show }">
      <div class="login_select">
        <div class="select_box" @click="show = true" :class="{ red: show }">
          登录
        </div>
        <div class="select_box" @click="show = false" :class="{ red: !show }">
          注册
        </div>
      </div>
      <div class="select_login" v-show="show">
        <van-form>
          <van-field
            v-model="username"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <div style="margin: 16px;">
            <van-button
              round
              block
              type="info"
              native-type="submit"
              @click="login"
            >
              登录
            </van-button>
          </div>
        </van-form>
      </div>

      <!-- --------------------------注册------------------------------ -->
      <div class="select_zhuce" v-show="!show">
        <van-form @submit="next" scroll-to-error>
          <van-cell-group>
            <van-field
              v-model="loginusername"
              placeholder="请输入用户名"
              label="用户名"
              required
            />
            <van-field
              v-model="loginpassword"
              type="password"
              placeholder="请输入密码"
              label="密码"
              required
            />
            <van-field
              v-model="tel"
              placeholder="请输入手机号"
              label="手机号"
              required
            />
            <!-- <van-field
              readonly
              clickable
              label="学校"
              :value="school"
              placeholder="选择学校"
              @click="schoolshow = true"
              required
            /> -->
            <van-popup v-model="schoolshow" position="bottom">
              <van-picker
                show-toolbar
                :columns="columns"
                @cancel="schoolshow = false"
                @confirm="onConfirm"
              />
            </van-popup>
          </van-cell-group>

          <div style="margin: 16px;">
            <van-button
              round
              block
              type="info"
              native-type="submit"
              :loading="this.loading"
            >
              下一步
            </van-button>
          </div>
        </van-form>
        <van-dialog
          v-model="regshow"
          title="身份认证"
          show-cancel-button
          :beforeClose="beforeClose"
        >
          <van-form @submit="zhuce()">
            <van-field
              required
              v-model="username"
              name="姓名"
              label="姓名"
              placeholder="输入姓名"
              :rules="[{ required: true, message: '请填写姓名' }]"
            />
            <van-field
              required
              v-model="checknum"
              name="学号"
              label="学号"
              placeholder="输入学号"
              :rules="[{ required: true, message: '请填写学号' }]"
            />
            <van-field
              required
              v-model="password"
              type="password"
              name="密码"
              label="身份密码"
              placeholder="默认为身份证后六位"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
            <van-field
              readonly
              clickable
              label="学校"
              :value="school"
              placeholder="选择学校"
              @click="schoolshow = true"
              required
            />
          </van-form>
        </van-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import qs from 'qs'
export default {
  data () {
    return {
      loading: false,
      checkname: '',
      checknum: '',
      regshow: false,
      username: '',
      password: '',
      loginusername: '',
      loginpassword: '',
      tel: '',
      school: '',
      show: true,
      schoolshow: false,
      columns: [{
        text: '福州',
        children: [{ text: '福州大学', disabled: true }, { text: '福建工程学院', disabled: true }]
      }, {
        text: '厦门',
        children: [{ text: '厦门大学', disabled: true }, { text: '厦门集美大学', disabled: true }, { text: '厦门理工学院' }]
      }],
      imgurl: 'userimg.png'

    }
  },
  methods: {
    showPopup () {
      this.schoolshow = true
      // 登录
    },
    onConfirm (value) {
      this.school = value[1]
      this.schoolshow = false
    },

    onCancel () {
      this.schoolshow = false
    },
    login () {
      if (this.username === '' || this.password === '') {
        Toast('用户名或密码不能为空')
      } else {
        this.axios.post('/api/login', qs.stringify({
          'username': this.username,
          'password': this.password
        })).then(res => {
          if (res.data.state === 1) {
            console.log('登录成功', res.data.data)
            sessionStorage.setItem('usernum', res.data.data.usernum)
            this.$router.push({ path: '/home' })
          } else {
            console.log(res)
            Toast('用户名或密码错误')
          }
        })
      }
    },
    async next () {
      if (this.loginusername === '' || this.loginpassword === '' || this.tel === '') {
        Toast.fail('请正确填写信息')
      } else {
        this.loading = true
        let res = await this.axios.post('/api/check', qs.stringify({          'username': this.loginusername,
          'tel': this.tel        }))
        // console.log(res)
        if (res.data.state === 0) {
          Toast.fail('用户名已存在')
          this.loading = false
        } else if (res.data.state === 2) {
          Toast.fail('该手机号已被注册')
          this.loading = false
        } else {
          this.loading = false
          this.regshow = true
        }
      }
    },
    async beforeClose (action, done) {
      if (action === 'confirm') {
        console.log(this.username)
        let res = await this.axios.post('/api/IDcheck', qs.stringify({
          'stunum': this.checknum,
          'accountname': this.username,
          'school': this.school,
          'payword': this.password
        }))
        console.log(res)
        if (res.data.state === 1) {
          // console.log(this.loginusername, this.loginpassword, this.tel)
          let username = this.loginusername
          let password = this.loginpassword
          let tel = this.tel
          let school = this.school
          let imgurl = this.imgurl
          let usernum = this.checknum
          let res = await this.axios.post('/api/register', qs.stringify({ username, password, usernum, tel, school, imgurl }))
          let res2 = await this.axios.post('/api/acstate', qs.stringify({ 'stunum': usernum, 'state': 1 }))
          sessionStorage.setItem('usernum', this.checknum)
          this.$router.push({ path: '/home' })
        } else {
          Toast.fail(res.data.message)
          done(false)
        }
      } else if (action === 'cancel') {
        done() // 关闭
      }
    }

  }
}
</script>

<style scoped>
.contain {
  height: 100%;
  background-color: skyblue;
}
.login_box {
  width: 80%;
  height: 40%;
  background-color: white;
  position: relative;
  left: 36px;
  top: 244px;
}
.login_select {
  height: 45px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 40px;
}
.select_box {
  width: 40%;
  text-align: center;
  line-height: 40px;
  font-size: 20px;
}
.red {
  border-bottom: 1px red solid;
}
.Long {
  width: 80%;
  height: 60%;
  background-color: white;
  position: relative;
  left: 36px;
  top: 244px;
}
</style>
