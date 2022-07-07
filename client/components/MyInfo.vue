<template>
  <div id="myInfo" class="glassMask rounde">
    <div class="top">
      <img class="headimg" src="~/assets/img/head.jpg" alt="" />
    </div>
    <div class="name">
      <span>四糸乃赛高</span>
    </div>
    <div class="note" v-html="notic">

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
    };
  },
  mounted(){

  },
  computed:{
    ...mapGetters(['notic'])
  }
};
</script>

<style lang="scss" scoped>
#myInfo {
  margin-bottom: 20px;
  // transition: 0.5s;
  & > div {
    padding: 10px;
  }
  .top {
    display: flex;
    justify-content: center;
    padding: 20px 0;
    .headimg {
      border-radius: 50%;
      height: 50px;
      width: 50px;
    }
  }
  .name {
    font-size: 120%;
    font-weight: bold;
    color: white;
    background-color: rgb(92,184,92);
    text-align: center;
  }
  .note {
    line-height: 16px;
    letter-spacing: 1px;
    font-size: 10px;
    color:white;
    white-space: pre-wrap;
  }
}
</style>
