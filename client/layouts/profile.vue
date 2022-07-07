<template>
  <div>
    <loading></loading>
    <navbar title="个人中心" :navList="[]" :profile="true"></navbar>
    <div class="wrapper container">
      <div class="row">
        <div class="col-md-2">
          <profile-nav></profile-nav>
        </div>
        <div class="col-md-10">
          <div class="profileRight rounded shadow">
            <transition name="fade-transform" mode="out-in">
              <nuxt />
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  middleware: "auth",
  head(){
    return {
      script: [
        { src: "https://unpkg.com/@wangeditor/editor@latest/dist/index.js" },
      ],
    }
  },
  methods: {
    showErr(msg) {
      this.$bvToast.toast(msg, {
        title: `错误信息`,
        variant: "danger",
        solid: true,
        toaster: "b-toaster-top-center",
      });
      this.$store.commit("setErrMsg", "");
    },
    showMsg(msg) {
      this.$bvToast.toast(msg, {
        title: `提示`,
        variant: "success",
        solid: true,
        toaster: "b-toaster-top-center",
      });
      this.$store.commit("setResMsg", "");
    },
  },
  mounted() {},
  computed: {
    ...mapState(["errMsg", "resMsg"]),
  },
  watch: {
    errMsg(val) {
      val && this.showErr(val);
    },
    resMsg(val) {
      val && this.showMsg(val);
    },
  },
};
</script>

<style lang="scss">
.profileRight {
  // background-color: rgba($color: #fff, $alpha: 0.8);
  background-color: rgb(255, 255, 255);
  min-height: 500px;
  padding: 10px;
}

.blockTitle {
  // border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
  text-align: center;
  padding: 15px;
  background-color: rgb(29, 133, 245);
  font-size: 15px;
  font-weight: bold;
  color: white;
  border-radius: 5px;
}
</style>
