<template>
  <div class="sign_contain">
    <div class="logo">
      <div class="back" @click="back">
        <img src="../../../../assets/img/back.png" class="iconimg" />
      </div>
      <span class="title">考试报名</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    back () {
      this.$router.back(-1)
    }
  }
}
</script>

<style>
.sign_contain {
  height: 100%;
  background-color: #b2dfee;
}
.back {
  width: 50px;
  height: 100%;
}
.title {
  position: relative;
  top: -45px;
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
</style>
