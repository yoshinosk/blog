<template>
  <div class="glassMask errorWrapper">
    <div class="error">
      <div class="top d-flex align-items-center pb-1">
        <b-img src="~/assets/img/yoshino.png" center height="200" width="200"></b-img>
      </div>
      <div class="bottom d-flex flex-column align-items-center justify-content-center">
        <span class="httpCode">HTTP {{ statusCode }}</span>
        <div class="errMsg ">{{ message | errMsg }}</div>
        <div class="backBtn shadow mt-5" @click="back">
          <span class="iconfont icon-fanhui"></span>返回
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NuxtError",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  methods:{
    back(){
      this.$router.back()
    }
  },
  mounted() {
    console.log(this.error);
  },
  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500;
    },
    message() {
      return this.error && this.error.response && this.error.response.data
        ? this.error.response.data.msg
        : this.error.message;
    },
  },
  filters:{
    errMsg(val){
      switch(val){
        case 'This page could not be found': return `该页面暂时没有找到，但也许未来会有~`;
        case 'Network Error': return '服务器开小差了，请重试~';
        default: return val;
      }
    }
  },
  head() {
    return {
      title: this.message,
      meta: [
        {
          name: "viewport",
          content: "width=device-width,initial-scale=1.0,minimum-scale=1.0",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.errorWrapper {
  height: 90vh;
  display: flex;
  align-items: center;
  .error {
    height: 70%;
    width: 100%;
    color: white;
    text-align: center;
    transform: translateY(-10%);
    .top {
      height: 50%;
      flex-direction: column;
      justify-content: end;
    }
    .bottom {
      height: 50%;
      background-color: rgba($color: #fff, $alpha: 0.4);
      .httpCode,.errMsg{
        text-shadow: 0 0 5px rgb(112, 112, 112);
      }
      .errMsg{
        font-size: 2rem;
      }
    }
  }
  .backBtn {
    background-color: rgba($color: rgb(27, 171, 233), $alpha: 0.5);
    padding: 5px 15px;
    font-size: 15px;
    display: inline-flex;
    align-items: center;
    transition: 0.5s;
    border-radius: 30px;
    cursor: pointer;
    .iconfont {
      font-size: 30px;
      margin-right: 5px;
    }
    &:hover {
      background-color: rgba($color: rgb(27, 171, 233), $alpha: 0.7);
    }
  }
}
</style>
