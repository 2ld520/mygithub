<template>
  <div class="user_contain">
    <div class="usercard">
      <!-- 基本信息 -->
      <div class="userinfo">
        <div class="username">名称:{{ name }}</div>
        <div class="userschool">学校:{{ school }}</div>
        <div class="usernum">学号:{{ num }}</div>
      </div>
      <!-- 头像 -->
      <div class="userimg" @click="changeimg">
        <img :src="imgurl" />
      </div>
      <van-popup
        v-model="headimg"
        position="bottom"
        :style="{ height: '60%' }"
        closeable
        round
        close-icon="close"
        close-icon-position="top-left"
        ><van-icon
          name="success"
          size="40"
          class="succ_icon"
          @click="updateuserimg"
        />
        <div class="uploda">
          <van-uploader
            v-model="fileList"
            multiple
            preview-size="120px"
            :max-count="1"
          />
        </div>
      </van-popup>
    </div>
    <!-- 列表 -->
    <van-cell is-link @click="showPopup" class="cell">修改名称</van-cell>
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '100%', width: '100%' }"
      class="popup"
      ><van-cell-group>
        <div class="updatebox">
          <van-button type="default" size="small" @click="closepopup"
            >取消</van-button
          >
          <div>修改资料</div>
          <van-button type="primary" size="small" @click="changeusername"
            >确定</van-button
          >
        </div>

        <van-field
          v-model="changename"
          type="text"
          label="名称"
          class="cell"
        /> </van-cell-group
    ></van-popup>
    <van-cell title="E通卡" is-link to="../payhome" class="cell" />
    <van-cell title="我的发布" is-link to="usergoods" class="cell" />
    <van-cell title="我的订单" is-link to="userorder" class="cell" />
    <van-button type="primary" block class="exitbtn" @click="end()"
      >退出</van-button
    >
    <van-tabbar v-model="active" route class="nav_bottom">
      <van-tabbar-item icon="home-o" replace to="/home">主页</van-tabbar-item>
      <van-tabbar-item icon="friends-o" replace to="/user"
        >用户</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
import qs from 'qs'
import { ContactList, Toast } from 'vant'
export default {

  data () {
    return {
      headimg: false,
      value: '',
      show: false,
      name: '',
      school: '',
      num: '',
      changename: '',
      active: 0,
      imgurl: '',
      fileList: []
    }
  },
  methods: {
    async changeusername () {
      // console.log(this.changename)
      // console.log(this.changename.length)
      if (this.changename.length > 9) {
        Toast('名称长度不能大于9')
      } else {
        let res = await this.axios.post('/api/updatenickname', qs.stringify({ 'usernum': this.num, 'nickname': this.changename }))
        this.show = false
        this.getsession()
      }
    },
    showPopup () {
      this.show = true
      this.changename = this.name
    },
    closepopup () {
      this.show = false
    },
    getimg (url) {
      this.imgurl = '/api/imgage/' + url
    },
    getsession () {
      let usernum = Number(sessionStorage.getItem('usernum'))
      this.axios.post('/api/finduser', qs.stringify({ 'usernum': usernum })).then(res => {
        this.school = res.data.school
        this.num = res.data.usernum
        this.getimg(res.data.imgurl)
        if (res.data.nickname === null) {
          this.name = res.data.username
        } else {
          this.name = res.data.nickname
        }
      })
    },
    changeimg () {
      this.headimg = true
    },
    getclose () {
      console.log('上传成功')
    },
    async updateuserimg () {
      let form = new FormData()
      form.append('file', this.fileList[0].file)
      form.append('stunum', this.num)
      console.log(this.fileList[0])
      console.log(this.num)
      console.log(form)
      let res = await this.axios.post('/api/userimg', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      console.log(res)
      Toast.success('修改成功')
      this.headimg = false
      this.getsession()

      // let params = new URLSearchParams()
      // params.append('key', form)
      // const obj = {
      //   'file': this.fileList, 'stunum': this.num
      // }
    },
    // 退出
    end () {
      sessionStorage.removeItem('usernum')
      this.$router.push({ path: '/login' })
    }
  },
  created () {
    this.getsession()
  }

}
</script>

<style>
.exitbtn {
  position: relative;
  top: 10%;
}
.uploda {
  position: absolute;
  width: 100%;
  height: 30%;
  top: 0;
  left: 35%;
  right: 0;
  bottom: 0%;
  margin: auto;
}
.succ_icon {
  position: relative;
  float: right;
  top: 1%;
}
.nav_bottom {
  height: 8%;
}
.user_contain {
  height: 93%;
  background-color: #ededed;
  overflow: hidden;
}
.usercard {
  height: 20%;
  width: 100%;
  position: relative;
  background-color: white;
  margin-bottom: 10px;
}
.userinfo {
  width: 50%;
  height: 80%;
  position: relative;
  top: 10%;
  left: 5px;
}
.userimg {
  position: absolute;

  max-width: 25%;
  height: auto;
  top: 10%;
  right: 10%;
}
.userimg img {
  max-width: 100%;
}
.infobtn {
  position: relative;
  bottom: 20px;
  left: 10px;
}
.username {
  font-size: 20px;
  font-weight: 600;
  margin: 10px 0 5px 10px;
}
.userschool {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 5px 10px;
}
.usernum {
  font-size: 16px;
  font-weight: 400;
  margin: 0 0 0 10px;
}
.cell {
  margin-top: 5px;
  margin-bottom: 5px;
}
.updatebox {
  padding-top: 5px;
  height: 38px;
  display: flex;
  justify-content: space-between;
  line-height: 30px;
  border-bottom: 1px solid #b9b6b6;
}
.popup {
  background-color: #ededed;
}
</style>
