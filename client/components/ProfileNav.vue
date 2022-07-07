<template>
  <div class="profileNav d-flex flex-column rounded glassMask">
    <div class="item rounded mb-1"
      v-for="(item) in navList"
      :key="item.name"
      @click="$router.push(item.to)"
      :class="{active: activePath == item.to}"
      >
      <i :class="`iconfont ${item.icon}`"></i>
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navList: [
        { name: "个人中心", to: "/user/profile" , icon: 'icon-shouyefill'},
        { name: "我的文章", to: "/user/profile/article" , icon: 'icon-liebiao'},
        { name: "发布文章", to: "/user/profile/publish" , icon: 'icon-wenbenshuru'},
        { name: "硬币记录", to: "/user/profile/log" , icon: 'icon-rizhi'},
        { name: "返回首页", to: "/" , icon: 'icon-fanhui'},
      ],
    };
  },
  computed:{
    activePath(){
      return this.$route.path;
    }
  }
};
</script>

<style lang="scss" scoped>
$navColor: rgb(18, 120, 210);
.profileNav {
  .item {
    transition: 0.5s;
    text-align: center;
    text-shadow: 0 0 3px rgba($color: #fff, $alpha: 0.5);
    color: rgb(67, 67, 67);
    cursor: pointer;
    font-size: 15px;
    line-height: 40px;
    &:hover {
      background-color: rgba(51, 121, 183, 0.502);
      color: white;
      line-height: 45px;
      font-size: 15px;
    }
    &:hover {
      text-decoration: none !important;
    }
  }
  .active {
    background-color: $navColor !important;
    color: white;
    line-height: 45px;
    font-size: 15px;
    box-shadow: inset 0 0px 5px rgba(255, 255, 255, 0.175) !important;
  }
}

@media all and (max-width: 768px) {
  .profileNav{
    flex-direction: row!important;
    flex-wrap: wrap;
    margin-bottom: 15px;
    padding: 10px;
    .item{
      width: 33%;
    }
  }
}
</style>
