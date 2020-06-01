<template>
  <div class="check_contain">
    <div class="check_logo">
      <van-icon name="arrow-left" size="40" class="icon_back" @click="back" />
      <span class="title_text">成绩查询</span>
    </div>
    <van-cell value="填写信息" class="default_cell" />
    <van-field v-model="stuname" label="姓名" placeholder="输入姓名" />
    <van-field v-model="stunum" label="学号" placeholder="输入学号" />
    <van-button type="info" size="large" class="check_btn" @click="search"
      >查询</van-button
    >

    <div class="check_list">
      <van-cell value="成绩单" class="other_cell" border />
      <van-cell
        v-for="(item, index) in gradelist"
        :key="index"
        :title="item.subject"
        :value="item.grade"
        icon="records"
      />
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import { Toast } from 'vant'
export default {
  data () {
    return {
      stuname: '',
      stunum: '',
      gradelist: []
    }
  },
  methods: {
    back () {
      this.$router.back(-1)
    },
    async search () {
      let stunum = parseInt(this.stunum)
      if (this.stunum === '' || this.stunum === '') {
        Toast('请正确填写信息')
      } else if (typeof (stunum) !== 'number' || typeof (this.stuname) !== 'string') {
        Toast('请正确填写信息')
      } else {
        let res = await this.axios.post('/api/searchgrade', qs.stringify({ 'stuname': this.stuname, 'stunum': stunum }))
        console.log(res)
        if (res.data.state === 0) {
          Toast('当前暂无成绩或者输入信息有误')
          this.gradelist = res.data.data
        } else {
          this.gradelist = res.data.data
          Toast.success('查询成功')
          console.log(this.gradelist)
        }
      }
    }

  }
}
</script>

<style>
.other_cell {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  border-bottom: 1px solid #ededed;
}
.check_list {
  background-color: white;
  width: 98%;
  height: 70%;
  margin: 0 auto;
  border-radius: 15px;
}
.check_btn {
  margin: 2px 0 2px 0;
}
.default_cell {
  background-color: #ededed;
}
.check_contain {
  height: 100%;
  background-color: #b2dfee;
}
.check_logo {
  height: 6%;
  line-height: 40px;
  font-size: 20px;
  font-weight: 500;
  position: relative;
  background-color: white;
}
</style>
