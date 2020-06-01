<template>
  <div>
    <van-row>
      <van-col span="4"
        ><van-cell is-link to="user" arrow-direction="left"
      /></van-col>
      <van-col span="10" offset="5"><span class="sp">我的订单</span></van-col>
    </van-row>
    <div v-for="(item, index) in list" :key="index">
      <div class="order_title">
        <div>
          <span class="order_span">订单编号:</span>
          <span class="order_font">{{ item.orderid }}</span>
        </div>
        <div>
          <span class="order_span">卖家名称:</span>
          <span class="order_font">{{ item.sellername }}</span>
        </div>
      </div>
      <van-card
        :price="getpirce(item.goodsprice)"
        :desc="gettime(item.time)"
        :title="getgoodsname(item.goodsname)"
        :thumb="getimg(item.goodsimg)"
        ><div slot="footer">
          <span>订单状态:</span>
          <span v-if="item.orderstate === 1" style="color:green">已付款</span>
          <span v-if="item.orderstate === 0" style="color:red">订单被关闭</span>
        </div>
      </van-card>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data () {
    return {
      list: []
    }
  },
  methods: {
    async getorder () {
      let stunum = sessionStorage.getItem('usernum')
      let res = await this.axios.get('/api/orderown', { params: { 'num': stunum } })
      this.list = res.data
      console.log(this.list)
    },
    getimg (url) {
      return '/api/imgage/' + url
    },
    getpirce (val) {
      return val.toFixed(2)
    },
    gettime (val) {
      return '订单创建时间:' + val
    },
    getgoodsname (val) {
      return '商品名称:' + val
    }
  },
  created () {
    this.getorder()
  }
}
</script>

<style>
.order_span {
  font-size: 10px;
}
.order_title {
  margin-top: 2px;
  padding: 0 5px;
  display: flex;
  justify-content: space-between;
}
.sp {
  line-height: 40px;
}
</style>
