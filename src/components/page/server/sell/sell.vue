<template>
  <div class="sell_contain">
    <div class="sell_logo">
      <div class="icon">
        <van-icon name="arrow-left" size="30" @click="back" />
      </div>
      <div class="boxcenter">闲置交易</div>
      <div class="icon">
        <van-icon name="add-o" size="30" @click="addshow" />
      </div>
    </div>
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      style="height:100%"
    >
      <van-divider contentPosition="left"
        ><van-icon name="goods-collect-o" />商品列表</van-divider
      >
      <van-card
        v-for="(item, index) in list"
        :key="index"
        num="1"
        :price="getpirce(item.goodsprice)"
        :desc="goodsdesc(item.goodstext)"
        :title="strgoodstitle(item.goodsname)"
        :thumb="getimg(item.goodsimg)"
      >
        <div slot="footer">
          卖家名称:
          <van-tag type="primary">{{ item.sellername }}</van-tag>
          <van-button size="mini" @click="creatorder(item)">购买</van-button>
        </div>
      </van-card>
    </van-pull-refresh>
    <!-- 用户发布商品 -->
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '90%' }"
      round
      closeable
      close-icon-position="top-left"
      ><div class="goodsimg">
        <van-cell value="添加图片" /><van-uploader
          v-model="addlist"
          multiple
          preview-size="120px"
          :max-count="1"
        /><span style="color:rgb(160, 158, 154)">点击左侧,添加商品图片</span>
      </div>
      <van-form @submit="addgoods">
        <van-field
          v-model="goodsname"
          label="商品名称"
          placeholder="请填写商品名称"
          :rules="[{ required: true, message: '请填写商品名称' }]"
        />
        <van-field
          v-model="goodstext"
          label="商品描述"
          placeholder="商品描述"
          :rules="[{ required: true, message: '商品描述' }]"
        />
        <van-field
          v-model="goodsprice"
          label="商品价格"
          placeholder="商品价格"
          :rules="[{ required: true, message: '商品价格' }]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
import qs from 'qs'
import { Toast } from 'vant'
export default {
  data () {
    return {
      list: [],
      show: false,
      goodsname: '',
      goodsprice: '',
      goodstext: '',
      addlist: [],
      isLoading: false
    }
  },
  methods: {
    back () {
      this.$router.back(-1)
    },
    getgoods () {
      this.axios.get('/api/goodslist').then(res => {
        this.list = res.data
        console.log(this.list)
      })
    },
    getimg (url) {
      return '/api/imgage/' + url
    },
    getpirce (val) {
      return val.toFixed(2)
    },
    addshow () {
      this.show = true
    },
    async addgoods () {
      let usernum = Number(sessionStorage.getItem('usernum'))
      let res = await this.axios.post('/api/finduser', qs.stringify({ 'usernum': usernum }))
      let form = new FormData()
      form.append('goodsname', this.goodsname)
      form.append('goodsprice', this.goodsprice)
      form.append('goodstext', this.goodsprice)
      form.append('file', this.addlist[0].file)
      form.append('stunum', usernum)
      form.append('sellername', res.data.nickname)
      form.append('goodsstate', 0)
      let addres = await this.axios.post('/api/addgoods', form)
      if (addres.data.state === 1) {
        this.successToast()
        this.show = false
      }
    },
    successToast () {
      this.$toast.loading({
        type: 'success',
        duration: 2000,
        message: '商品提交成功,等待审核'

      })
    },
    strgoodstitle (val) {
      return '商品名称:' + val
    },
    goodsdesc (val) {
      return '商品描述:' + val
    },
    creatorder (item) {
      if (item.stunum == sessionStorage.getItem('usernum')) {
        Toast.fail('你不能购买自己发布的商品')
      } else {
        this.$router.push({
          path: `/order/${item.goodsid}`
        })
      }
    },
    onRefresh () {
      setTimeout(() => {
        Toast('刷新成功')
        this.isLoading = false
        this.getgoods()
      }, 1000)
    }
  },
  created () {
    this.getgoods()
  }
}
</script>

<style>
.goodsimg {
  border-top: 1px solid rgb(160, 158, 154);
  margin-top: 50px;
  padding: 0 0 0 6px;
  width: 100%;
}
.icon {
  height: 30px;
  width: 30px;
}
.sell_contain {
  height: 100%;
  padding: 48px 0 0 0;
}
.sell_logo {
  width: 100%;
  height: 6%;
  line-height: 40px;
  font-size: 20px;
  font-weight: 500;
  position: fixed;
  z-index: 20;
  top: 0;
  display: flex;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
  justify-content: space-between;
  align-items: center;
}
/* .title_text {
  position: absolute;
  left: 40%;
  top: 10%;
} */
</style>
