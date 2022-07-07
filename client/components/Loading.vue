<template>
  <transition
    name="fade"
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut"
  >
    <div
      class="loadingMask d-flex justify-content-center align-items-center"
      v-if="loading"
    >
      <b-spinner
        style="width: 3rem; height: 3rem"
        variant="secondary"
      ></b-spinner>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      complete: true, // 页面已完成
    };
  },
  methods: {
    // 打开页面时延迟加载loading
    start() {
      this.complete = false;
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (!this.complete) this.$store.commit("setLoading", true);
      }, 200);
    },
    finish() {
      this.complete = true;
      clearTimeout(this.timer);
      this.timer = null;
      this.$store.commit("setLoading", false);
    },
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
  },
};
</script>

<style lang="scss" scoped>
.loadingMask {
  z-index: 9999;
  position: fixed;
  background-color: rgba($color: #fff, $alpha: 0.2);
  height: 100vh;
  width: 100vw;
  left: 0;
  top: 0;
}
</style>
