<template>
  <div>
    <breadcrumb
      :list="[
        { name: '首页', href: '/' },
        { name: '文章', href: '/article', active: true },
      ]"
    ></breadcrumb>
    <div class="row">
      <div class="col-md-9">
        <div class="tagsBox-top rounde mb-3 p-3">
          <div
            class="tag"
            :class="{ active: query.tags.includes(item.name) }"
            @click="handleTags(item)"
            v-for="item in tags"
            :key="item._id"
          >
            {{ item.name }}
            <b-badge
              pill
              :variant="query.tags.includes(item.name) ? 'light' : 'dark'"
              >{{ item.total }}</b-badge
            >
          </div>
        </div>
        <div class="content shadow-lg pb-3 mb-3 rounde">
          <ul class="sortNav shadow d-flex">
            <li
              class="item"
              v-for="item in sort"
              :key="item.name"
              :class="{ active: item._id == query.sort }"
              @click="handleSort(item)"
            >
              {{ item.name }}
              <!-- <b-badge v-show="item._id == query.sort" pill variant="light">{{ total }}</b-badge> -->
            </li>
          </ul>
          <div class="query row">
            <div class="col-md-8 mb-2">
              <b-button variant="info" @click="handleOrder" size="sm" squared>
                <!-- <b-icon icon="chevron-up" :flip-v="query.createTime < 0" ></b-icon> -->
                <span class="downIcon" :class="{ reversal: query.order > 0 }">
                  <i class="iconfont icon-xiajiantou"></i>
                </span>
                按发布时间{{ query.order > 0 ? "升序" : "降序" }}
              </b-button>
            </div>
            <div class="col-md-4">
              <b-input-group size="sm">
                <b-form-input
                  type="search"
                  v-model="query.searchKey"
                  trim
                  squared
                  placeholder="搜索文章标题 / 作者"
                  @keydown.enter="handleSearch"
                ></b-form-input>
                <b-input-group-prepend is-text>
                  <b-icon
                    icon="search"
                    @click="handleSearch"
                    style="cursor: pointer"
                  ></b-icon>
                </b-input-group-prepend>
              </b-input-group>
            </div>
          </div>
          <div class="articleList p-3 row">
            <div
              class="col-md-6"
              v-for="(item, index) in articleList"
              :key="item._id"
            >
              <ArticleItemSM :item="item" :index="index"></ArticleItemSM>
            </div>
            <div class="empty" v-if="!articleList.length && !loading">
              <empty color="#fff" :size="50" text="暂无文章"></empty>
            </div>
          </div>
          <b-pagination
            v-show="total > query.pageSize"
            v-model="query.page"
            :total-rows="total"
            :per-page="query.pageSize"
            align="center"
            @change="handlePageChange"
            size="sm"
          ></b-pagination>
        </div>
      </div>
      <div class="col-md-3 articleRight">
        <div class="tagsBox-right mb-3 p-3 rounde">
          <div
            class="tag"
            :class="{ active: query.tags.includes(item.name) }"
            @click="handleTags(item)"
            v-for="item in tags"
            :key="item._id"
          >
            {{ item.name }}
            <b-badge
              pill
              :variant="query.tags.includes(item.name) ? 'light' : 'dark'"
              >{{ item.total }}</b-badge
            >
          </div>
        </div>
        <article-box :list="randomArt" title="随机文章"></article-box>
      </div>
    </div>
  </div>
</template>

<script>
import Empty from "../../components/Empty.vue";
export default {
  scrollToTop: true,
  components: { Empty },
  async asyncData({ route, store, params, query, app }) {
    let [{ data: articles }, { data: tags }, { data: randomArt }] =
      await Promise.all([
        app.$api.article.getArticleList({ page: 1, pageSize: 10 }),
        app.$api.article.getArticleTags(),
        app.$api.article.randomArticle(),
      ]);
    return {
      tags,
      articleList: articles.list,
      total: articles.total,
      randomArt,
    };
  },
  async fetch({ store }) {
    if (!store.state.articleSort.length) await store.dispatch("getArticleSort");
  },
  data() {
    return {
      query: {
        sort: null,
        searchKey: "",
        order: -1,
        page: 1,
        pageSize: 10,
        tags: [],
      },
      total: 0,
      loading: true,
    };
  },
  methods: {
    async getArticleList() {
      this.loading = true;
      try {
        this.articleList.splice(0);
        let { data } = await this.$api.article.getArticleList(this.query);

        this.articleList = data.list;
        this.total = data.total;
      } finally {
        this.loading = false;
      }
    },
    handleSort(item) {
      this.$set(this.query, "sort", item._id);
      this.$set(this.query, "page", 1);
      this.getArticleList();
    },
    handleSearch() {
      this.$set(this.query, "page", 1);
      this.getArticleList();
    },
    handlePageChange(page) {
      this.$set(this.query, "page", page);
      this.getArticleList();
    },
    handleOrder() {
      this.query.order = -this.query.order;
      this.getArticleList();
    },
    handleTags(item) {
      let index = this.query.tags.findIndex((tag) => tag == item.name);
      if (index > -1) {
        this.query.tags.splice(index, 1);
      } else {
        this.query.tags.push(item.name);
      }
      this.$set(this.query, "page", 1);
      this.getArticleList();
    },
  },
  computed: {
    sort() {
      return [{ name: "全部", _id: null }].concat(
        this.$store.state.articleSort
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.form-control {
  background-color: rgba($color: #fff, $alpha: 0.5) !important;
  text-shadow: 0 0 5px rgba($color: #fff, $alpha: 0.5);
}

$navColor: rgb(51, 122, 183);
.content {
  background-color: rgba(255, 255, 255, 0.503);
  overflow: hidden;
  .sortNav {
    // border-bottom: 1px solid rgb(51, 122, 183);
    background-color: rgba($color: #fff, $alpha: 0.6);
    align-items: center;
    height: 50px;
    .item {
      flex-grow: 1;
      transition: 0.5s;
      text-align: center;
      text-shadow: 0 0 3px rgba($color: #fff, $alpha: 0.5);
      color: rgb(67, 67, 67);
      cursor: pointer;
      font-size: 12px;
      line-height: 30px;
      border-right: 1px solid rgba($color: rgb(151, 151, 151), $alpha: 0.5);
      &:hover {
        background-color: rgba(51, 121, 183, 0.502);
        color: white;
        line-height: 50px;
        font-size: 15px;
        border-right: 1px solid
          rgba($color: rgba(51, 121, 183, 0.502), $alpha: 0.5);
      }
      &:last-child {
        border-right: 0px !important;
      }
    }
    .active {
      background-color: $navColor !important;
      color: white;
      line-height: 50px;
      font-size: 15px;
      box-shadow: inset 0 0px 5px rgba(255, 255, 255, 0.175) !important;
      border-right: 1px solid $navColor !important;
    }
  }
  .query {
    padding: 10px 20px 0 20px;
    .downIcon {
      transition: 0.5s;
      display: inline-block;
    }
    .reversal {
      transform: rotate(180deg);
    }
  }

  .articleList {
    min-height: 612px;
    align-content: flex-start;
    .empty {
      flex-grow: 1;
    }
  }
}

%tagsBox {
  background-color: rgba(255, 255, 255, 0.503);
  .tag {
    cursor: pointer;
    border-radius: 0px;
    padding: 5px 10px;
    background-color: rgb(108, 117, 125);
    color: white;
    margin-right: 5px;
    font-size: 10px;
    display: inline-block;
    transition: 0.5s;
    margin-bottom: 5px;
  }
  .active {
    background-color: $navColor !important;
  }
}
.tagsBox-right,
.tagsBox-top {
  @extend %tagsBox;
}

.tagsBox-top {
  display: none;
}

@media all and (max-width: 768px) {
  .articleList {
    min-height: unset !important;
  }
  .tagsBox-top {
    display: block !important;
  }
  .tagsBox-right {
    display: none !important;
  }
}
</style>
