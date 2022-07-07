<template>
  <div class="indexWrapper row">
    <div class="col-md-3 indexLeft">
      <my-info></my-info>
      <article-box class="mb-3" title="热门文章" :list="hotArt"></article-box>
    </div>
    <div class="col-md-6 indexMiddle">
      <article-list></article-list>
    </div>
    <div class="col-md-3 indexRight">
      <home-block
        v-for="item in infoBlock"
        :key="item._id"
        :title="item.title"
        :list="item.list"
      ></home-block>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  scrollToTop: true,
  async fetch({ store }) {
    await store.dispatch("getArticleList");
  },
  async asyncData({ app }) {
    let [{ data: infoBlock }, { data: hotArt }] = await Promise.all([
      app.$api.site.getInfoBlockList(),
      app.$api.article.getArticleViewsRank(),
    ]);
    return {
      hotArt,
      infoBlock: infoBlock.filter((item) => item.status),
    };
  },
  mounted() {
    document
      .getElementById("app")
      .addEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll(e) {
      if (
        e.target.scrollTop + e.target.clientHeight >=
          e.target.scrollHeight &&
        this.articleMore == "loadmore"
      )
        this.$store.dispatch("getArticleList");
    },
  },
  beforeDestroy() {
    document
      .getElementById("app")
      .removeEventListener("scroll", this.handleScroll);
  },
  computed: {
    ...mapState(["articleList", "articlePage", "articleTotal", "articleMore"]),
  },
};
</script>

<style lang="scss" scoped>
@media all and (max-width: 768px) {
  .indexRight {
    order: 2;
  }
  .indexMiddle {
    order: 3;
  }
}
</style>
