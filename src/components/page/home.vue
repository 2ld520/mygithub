<template>
  <div class="contain">

    <van-sticky>
      <div class="logo">
        <span>咚校园</span>
        <img src="../../assets/img/school.png" class="iconimg" />
      </div>
    </van-sticky>
    <div class="main_contain">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="view">
        <van-notice-bar left-icon="volume-o">
          {{ text }}
        </van-notice-bar>

        <!-- 业务窗口 -->
        <van-grid :column-num="2" class="white">
          <van-grid-item
            v-for="(item, index) in serverlist"
            :key="index"
            :to="item.link"
          >
            <img :src="item.imgurl" class="imglist" />
            <div class="span">{{ item.name }}</div>
          </van-grid-item>
        </van-grid>
        <!-- 轮播图 -->
        <van-swipe
          class="my-swipe"
          :autoplay="3000"
          indicator-color="white"
          :height="120"
          stop-propagation =false
        >
          <van-swipe-item v-for="item in imgbox" :key="item" @click="tourl(item)">
              <van-image height="120" :src="getimg(item.imgurl)" fit="contain"
            /></a>
          </van-swipe-item>
        </van-swipe>

        <!-- 资讯 -->
        <van-divider content-position="left">最新资讯</van-divider>
        <div v-for="(item, index) in newslist" :key="index" class="news_box" >
          <img class="news_img" :src="getimg(item.img)" alt="img" />
          <div @click="toshownews(item)" >
            <h3 class="news_title">{{ item.title }}</h3>
            <p class="news_cont van-multi-ellipsis--l3">{{ item.text }}</p>
          </div>
        </div>
      </div>
       </van-pull-refresh>
    </div>

    <!-- 消息遮罩层 -->
    <van-overlay :show="show" @click="show = false">
      <div class="wrapper" >
        <div class="block" >
          <van-divider />
          <h3 style="position: relative;top:5px;left:10px">{{shownews.title}}</h3>
          <van-divider />
          <div style="height:100px"><van-image
            height="100px"
            fit="contain"
            :src="getimg(shownews.img)"
          /></div>
          <van-divider />
          <div style="padding:10px">
            {{shownews.text}}
            </div>

        </div>
      </div>
    </van-overlay>

    <van-tabbar v-model="active" route class="nav_bottom">
      <van-tabbar-item icon="home-o" replace to="/home">主页</van-tabbar-item>
      <van-tabbar-item icon="friends-o" replace to="/user"
        >用户</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  data () {
    return {
      active: 0,
      user: {},
      text: '',
      serverlist: [
        { name: '在线缴费', imgurl: require('../../assets/img/onlinepay.png'), link: '/payhome' },
        { name: '闲置交易', imgurl: require('../../assets/img/ershoujiaoyi.png'), link: '/sell' },
        { name: '成绩查询', imgurl: require('../../assets/img/search.png'), link: '/check' }
        // { name: '考试报名', imgurl: require('../../assets/img/sign.png'), link: '/sign' }
      ],
      loading: true,
      newslist: [],
      imgbox: [],
      show: false,
      shownews: {
        'title': '',
        'img': '',
        'text': ''
      },
      isLoading: false
    }
  },
  methods: {
    async getNews () {
      let res = await this.axios.get('/api/getNews')
      this.newslist = res.data.data
      console.log(this.newslist)
    },
    getimg (url) {
      return '/api/imgage/' + url
    },
    async getimgState () {
      let res = await this.axios.get('/api/getSwipimg/state')
      this.imgbox = res.data
      console.log(res.data)
    },
    tourl (item) {
      console.log(item)
      window.location.href = item.imglink
    },
    toshownews (item) {
      this.shownews.title = item.title
      this.shownews.img = item.img
      this.shownews.text = item.text
      console.log(item)
      this.show = true
    },
    async getNotice () {
      let res = await this.axios.get('/api/getNotice')
      this.text = res.data.text
      console.log(res)
    },
    onRefresh () {
      setTimeout(() => {
        Toast('刷新成功')
        this.isLoading = false
        this.getNews()
        this.getNotice()
        this.getimgState()
      }, 1000)
    }
  },
  created () {
    this.getNews()
    this.getimgState()
    this.getNotice()
  }

}
</script>

<style scoped>
.view {
  height: auto;
  overflow: scroll;
  padding: 0 0 20% 0;
  background-color: rgba(252, 255, 248, 0.911);
}
.logo {
  height: 6%;
  line-height: 40px;
  font-size: 20px;
  font-weight: 600;
  border-bottom: #f0f0f0 1px solid;
  text-align: center;
  background-color: white;
}
.iconimg {
  width: 30px;
  position: relative;
  top: 7px;
}
.main_contain {
  height: 87%;
}
.contain {
  height: 100%;
}
.nav_bottom {
  height: 8%;
  background-color: #fcfcfc;
}
.service_list {
  position: relative;
  width: 90%;
  height: 30%;
  margin: 10px 0 34px 0;
  border: 1px solid #ebebeb;
  left: 5%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border-radius: 10px;
}
.listbox {
  height: 45%;
  width: 23%;
  margin-top: 2%;
  text-align: center;
  line-height: 45%;
  font-size: 10px;
}
.imglist {
  width: 40%;
}
.box {
  height: 100%;
  top: 20%;
  position: relative;
}
.span {
  height: 12px;
  line-height: 12px;
  font-weight: 600;
  position: relative;
  top: 2px;
}
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #f8f8ff;
}
.news_cont {
  margin: 13px 0 0;
  font-size: 14px;
  line-height: 20px;
}
.news_title {
  display: block;
  margin: 0;
  font-size: 18px;
  line-height: 20px;
}
.news_img {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  margin-right: 16px;
}
.news_box {
  height: 110px;
  display: flex;
  padding: 0 16px 4px 16px;
  margin-bottom: 5px;
  border-bottom: 1px solid #ebebeb;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 80%;
  height: 70%;
  background-color: #fff;
}
</style>
