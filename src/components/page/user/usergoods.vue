<template>
  <div>
    <van-row>
      <van-col span="4"
        ><van-cell is-link to="user" arrow-direction="left"
      /></van-col>
      <van-col span="10" offset="5"><span class="sp">我的发布</span></van-col>
    </van-row>
    <van-card
      v-for="(item, index) in list"
      :key="index"
      num="1"
      :price="getpirce(item.goodsprice)"
      :desc="item.goodstext"
      :title="item.goodsname"
      :thumb="getimg(item.goodsimg)"
    >
      <div slot="footer">
        状态:
        <span v-if="item.goodsstate === 0" style="color:red">待审核</span>
        <span v-if="item.goodsstate === 1" style="color:green">正在出售</span>
        <van-button size="mini" @click="cancelgoods(item)">取消</van-button>
      </div>
    </van-card>
  </div>
</template>

<script>
import qs from 'qs'
import { Dialog, Toast } from 'vant'
export default {
  data () {
    return {
      list: []
    }
  },
  methods: {
    getgoods () {
      let stunum = sessionStorage.getItem('usernum')
      console.log(stunum)
      this.axios.get('/api/usergoods', { params: { 'stunum': stunum } }).then(res => {
        this.list = res.data
      })
    },
    getimg (url) {
      return '/api/imgage/' + url
    },
    getpirce (val) {
      return val.toFixed(2)
    },
    cancelgoods (obj) {
      Dialog.confirm({
        message: '是否取消该商品？'
      })
        .then(() => {
          // on confirm

          this.axios.delete('/api/deletegoods', { params: { 'id': obj.goodsid } }).then(() => {
            Toast.success('成功取消')
            this.getgoods()
          })
        })
        .catch(() => {
          // on cancel
        })
    }
  },
  created () {
    this.getgoods()
  }
}
</script>

<style>
.sp {
  line-height: 40px;
}
</style>
