<template>
  <div class="empty d-flex flex-column align-items-center justify-content-center ">
    <i class="iconfont icon-empty" :style="{'font-size': `${size}px`,color}"></i>
    <span class="text" :style="{'font-size': `${size * 0.3}px`,color}">
      {{ text }}
    </span>
  </div>
</template>

<script>
  export default {
    props:{
      text:{
        type:String,
        default: '暂无数据'
      },
      size:{
        type:Number,
        default: 40
      },
      color:{
        type:String,
        default: '#fff'
      }
    }
  }
</script>

<style lang="scss" scoped>
.empty{
  padding:20px 0 40px 0;
}
.text{
  text-shadow: 0 1px 1px rgba($color: #000000, $alpha: 0.5);
  display: inline-block;
  margin-top: -5px;
}
.icon-empty{
  text-shadow: 0 1px 1px rgba($color: #000000, $alpha: 0.1);
}
</style>
