<template>
  <div class="backTop rounde" @click="handleClick" :class="{ show }">
    <b-icon icon="chevron-up" font-scale="3"></b-icon>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  mounted() {
    document
      .getElementById("app")
      .addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    document
      .getElementById("app")
      .removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleClick() {
      document
        .getElementById("app")
        .scrollTo({ left: 0, top: 0, behavior: "smooth" });
    },
    handleScroll(e) {
      if(e.target.scrollTop > (window.screen.height * 0.5)) this.show = true;
      else this.show = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.show {
  display: block!important;
}
.backTop {
  display: none;
  z-index: 2;
  position: fixed;
  right: 10%;
  bottom: 10%;
  background-color: rgba($color: #fff, $alpha: 0.2);
  color: white;
  font-weight: bold;
  border-radius: 50%;
  opacity: 0.5;
  transition: 0.3s;
  padding: 5px;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
}
</style>
