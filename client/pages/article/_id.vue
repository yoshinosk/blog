<template>
  <article>
    <breadcrumb
      :list="[
        { name: '首页', href: '/' },
        { name: '文章', href: '/article' },
        { name: '内容', href: '#', active: true },
      ]"
    ></breadcrumb>
    <div class="row">
      <div class="col-md-9 mb-3">
        <div class="articleLeft rounde shadow p-3 mb-2">
          <h1 class="artTitle">{{ article.title }}</h1>
          <div class="artPalette d-flex align-items-center flex-wrap">
            <b-badge class="mr-1" variant="primary">
              <b-icon icon="person-fill"></b-icon>
              <span>{{ author.nickname }}</span>
            </b-badge>
            <b-badge class="mr-1" variant="primary">
              <b-icon icon="clock-fill"></b-icon>
              <span>{{ (createTime * 1000) | prettyDate }}</span>
            </b-badge>
            <b-badge class="mr-1" variant="success">
              <b-icon icon="tag-fill"></b-icon>
              <span>{{ sort }}</span>
            </b-badge>
            <b-badge class="mr-1" variant="info">
              <b-icon icon="eye-fill"></b-icon>
              <span>{{ views }} 次阅读</span>
            </b-badge>
            <div class="ml-auto text-secondary" v-if="updateTime">
              最后更新：{{ (updateTime * 1000) | prettyDate }}
            </div>
          </div>
          <content class="artContent wysiwyg" v-html="content"></content>
          <div class="artBottom text-center">
            <div class="goodIcon text-white bg-primary" @click="handleGoodUp">
              <span class="iconfont icon-dianzan"></span>
              <span class="value">{{ article.goods }}</span>
            </div>
          </div>
        </div>
        <article-comment
          v-if="allowComment"
          :list="comments"
          :total="commentTotal"
          :articleId="id"
        ></article-comment>
      </div>
      <div class="col-md-3">
        <div class="articleRight overflow-hidden">
          <div class="authorBox rounde glassMask d-flex">
            <div class="left mr-2">
              <b-img
                class="avatar"
                height="40"
                width="40"
                rounded="circle"
                :src="author.avatar"
              ></b-img>
            </div>
            <div class="right">
              <span class="nickname"
                >{{ author.nickname }}
                <b-badge variant="info">Lv {{ author.level.level }}</b-badge>
              </span>
              <span class="usersign">{{ author.usersign }}</span>
            </div>
          </div>
          <article-box class="mb-2" :list="relevant"></article-box>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import ArticleBox from "../../components/ArticleBox.vue";
import ArticleComment from "../../components/ArticleComment.vue";
export default {
  scrollToTop: true,
  components: { ArticleBox, ArticleComment },
  validate({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id);
  },
  head() {
    return {
      title: `${this.article.title} - ${this.siteName}`,
      link: [
        {
          rel: "stylesheet",
          href: "https://unpkg.com/prismjs@latest/themes/prism.css",
        }, // 代码高亮
      ],
      script: [
        { src: "https://cdn.jsdelivr.net/npm/prismjs@latest/prism.min.js" },
        {
          src: "https://cdn.jsdelivr.net/npm/prismjs@latest/components/prism-core.min.js",
        },
        {
          src: "https://cdn.jsdelivr.net/npm/prismjs@latest/plugins/autoloader/prism-autoloader.min.js",
        },
      ],
      meta: [
        {
          name: "description",
          content:this.article.desc
        },

      ],
    };
  },
  validate({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id);
  },
  async asyncData({ params, app, error }) {
    let { id } = params;
    if (!id || isNaN(id)) {
      return error({ message: "参数错误", statusCode: 422 });
    }
    let { data: article } = await app.$api.article.getArticle(id);
    if (!article) return error({ message: "文章不存在", statusCode: 400 });

    let { data: relevant } = await app.$api.article.getArticleList({
      page: 1,
      pageSize: 5,
      tags: article.tag,
      ne: id,
    });

    let comments = { list: [], total: 0 };
    if (article.allowComment) {
      let { data } = await app.$api.article.getArticleComment(id);
      comments.list = data.list;
      comments.total = data.total;
    }

    return {
      id,
      article,
      relevant: relevant.list,
      comments: comments.list,
      commentTotal: comments.total,
    };
  },
  data() {
    return {};
  },
  methods: {
    async handleGoodUp() {
      try {
        let { data } = await this.$api.article.goodUp(this.id);
        this.$set(this.article, "goods", this.article.goods + data);
      } catch (error) {}
    },
  },
  computed: {
    sort() {
      return this.article ? this.article.sort.name : "";
    },
    sortID() {
      return this.article ? this.article.sort._id : 0;
    },
    content() {
      return this.article ? this.article.content : "";
    },
    author() {
      return this.article ? this.article.author : {};
    },
    views() {
      return this.article ? this.article.views : "";
    },
    tag() {
      return this.article ? this.article.tag : [];
    },
    createTime() {
      return this.article ? this.article.createTime : "";
    },
    updateTime() {
      return this.article ? this.article.updateTime : "";
    },
    allowComment() {
      return this.article ? this.article.allowComment : 0;
    },
  },
};
</script>

<style lang="scss">
.articleLeft {
  background-color: white;
  .artTitle {
    font-size: 30px;
    color: rgb(37, 37, 37);
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    margin-top: 0;
  }
  .artPalette {
    font-size: 14px;
    position: relative;
    padding-bottom: 10px;
    margin-top: 20px;
    border-bottom: 1px solid #e4e4e4;
    margin-bottom: 20px;
    // display: flex;
    // flex-wrap: wrap;
  }
  .artContent {
    padding: 30px 0 50px;
    font-size: 14px;
    overflow: hidden;
    color: #333;
  }
}

.authorBox {
  padding: 10px;
  // background-color: rgb(61, 113, 233);
  margin-bottom: 20px;
  color: white;
  border: 3px solid white;
  .avatar {
    border: 3px solid white;
    // padding: 3px;
  }
  .nickname {
    font-size: 14px;
  }
  .usersign {
    font-size: 11px;
    color: rgb(234, 232, 232);
    display: block;
  }
}

.wysiwyg {
  blockquote {
    background-color: #f9f9f9;
  }
  ul {
    list-style: inherit !important;
  }
  ol {
    list-style: decimal !important;
  }
  li {
    list-style: inherit !important;
  }
  img {
    max-width: 100% !important;
    height: auto;
  }
}

.articleRight {
  // background-color: white;
}

.artBottom {
  margin-top: 20px;
  .goodIcon {
    border-radius: 50%;
    height: 60px;
    width: 60px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .iconfont {
      font-size: 16px;
    }
    .value {
      font-size: 12px;
    }
  }
}

@media all and (max-width: 768px) {
}
</style>
