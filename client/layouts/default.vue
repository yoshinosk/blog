<template>
  <div>
    <navbar :title="siteName"></navbar>
    <loading></loading>
    <div class="wrapper container">
      <nuxt />
    </div>
    <back-top></back-top>
    <my-footer></my-footer>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
    scrollToTop: true,
    head() {
        return {
            title: `${this.siteName} - 兴趣使然 一个动漫主题的博客`
        };
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
    mounted() {
      // console.log('process.env.NODE_ENV',process.env.NODE_ENV)
    },
    computed: {
        ...mapState(["errMsg", "resMsg"]),
        ...mapGetters(["siteName"]),
    },
    watch: {
        errMsg(val) {
            val && this.showErr(val);
        },
        resMsg(val) {
            val && this.showMsg(val);
        },
    }
};
</script>

<style lang="scss">

</style>
