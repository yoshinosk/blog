<template>
  <b-breadcrumb class="rounde">
    <b-breadcrumb-item v-for="item in list" :key="item.name" :active="item.active" @click="handleClick(item)">{{ item.name }}</b-breadcrumb-item>
  </b-breadcrumb>
</template>

<script>
  export default {
    props:{
      list:{
        type: Array,
        default: []
      }
    },
    methods:{
      handleClick(item){
        this.$router.replace(item.href)
      }
    }
  }
</script>

<style lang="scss" scoped>
.breadcrumb {
  position: relative;
  z-index: 1;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  background: none!important;
  &::before {
    position: absolute;
    left: 0;
    top: 0;
    height: 150%;
    width: 150%;
    content: "";
    margin: -10px;
    background: url(~assets/img/bg.jpg) center center / cover no-repeat fixed;
    filter: blur(5px);
    z-index: -1;
  }
  a{
    color: white;
  }
  .breadcrumb-item + .breadcrumb-item::before,.active{
    color: rgba($color: #fff, $alpha: 0.5);
  }
}
</style>
