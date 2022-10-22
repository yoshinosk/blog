<template>
  <div class="links rounde" v-if="list.length">
    <div class="title">友情链接</div>
    <ul class="list">
      <li class="item rounde" v-for="(item, index) in list" :key="index">
        <img class="icon" :src="item.icon" alt="" />
        <a class="line-1" target="_blank" :href="item.url" :title="item.name">{{ item.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props:{
    list:{
      type: Array,
      default: []
    }
  }
};
</script>

<style lang="scss" scoped>
.links {
  background-color: rgba(255, 255, 255, 0.5);
  overflow: hidden;
  .list{
    .item{
      display: flex;
      align-items: center;
      margin: 10px;
      padding: 5px;
      box-shadow: 1px 2px 5px rgba($color: #000000, $alpha: 0.3);
      background-color: rgba($color: #fff, $alpha: 0.3);
      transition: .3s;
      &:hover{
        background-color: rgba($color: #fff, $alpha: 0.5);
        transform: scale(0.9);
        a{
          white-space: inherit;
        }
      }
      .icon{
        width: 35px;
        height: 35px;
        border-radius: 50%;
        margin-right: 7px;
      }
      a{
        text-decoration: none;
        color: rgb(52, 96, 217);
        font-size: 14px;
        font-weight: bold;
        white-space: nowrap;
      }
    }
  }
}
.title {
  font-size: 15px;
  font-weight: bold;
  color: white;
  background-color: rgb(61, 113, 233);
  text-align: center;
  padding: 10px;
}

@media all and (max-width: 768px) {
  .links{
    display: none;
  }
}
</style>
