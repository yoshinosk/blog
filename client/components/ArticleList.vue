<template>
  <ul class="articleList" >
    <li v-for="(item, index) in articleList" :key="index">
      <article-item :article="item" :index="index"></article-item>
    </li>
    <li class="loadStatus shadow-sm">
      <img class="loading" v-show="showLoading" src="~/assets/img/loading.gif"/>
      {{ loadStatus[articleMore] }}
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data(){
    return{
      loadStatus:{
        loadmore: '下拉加载更多',
        loading: '加载中',
        nomore: '没有更多了',
        empty: '暂无数据'
      }
    }
  },
  methods: {
    // handleScroll(e) {
    //   if (
    //     e.currentTarget.scrollTop + e.currentTarget.clientHeight >=
    //     e.currentTarget.scrollHeight
    //     && this.articleMore == 'loadmore'
    //   ) this.$store.dispatch('getArticleList')
    // }
  },
  computed:{
    ...mapState(['articleList','articlePage','articleTotal','articleMore']),
    showLoading(){
      return this.articleMore == 'loading';
    }
  }
};
</script>

<style lang="scss" scoped>


.loadStatus{
  padding: 20px;
  position: relative;
  color: white;
  text-align: center;
  text-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.5);
  // background: rgba(0, 0, 0, 0.2);
  &>.loading{
    height: 20px;
    width: 20px;
  }
}
</style>
