<template>
  <div class="publish">
    <h5 class="blockTitle">{{ editMode ? "编辑" : "发布" }}文章</h5>
    <b-form>
      <b-form-group label="标题">
        <b-form-input
          v-model="form.title"
          :state="state.title"
          placeholder="请输入文章标题"
          trim
        ></b-form-input>
        <b-form-invalid-feedback :state="state.title">
          {{ 50 > form.title.length ? "请输入文章标题" : "文章标题过长" }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="分类">
        <b-form-select
          v-model="form.sort"
          :state="state.sort"
          :options="sortOptions"
        ></b-form-select>
        <b-form-invalid-feedback :state="state.sort">
          请选择文章分类
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="封面图">
        <!-- <b-form-input
          v-model="form.coverImg"
          trim
        ></b-form-input> -->
        <select-image v-model="form.coverImg"></select-image>
      </b-form-group>
      <b-form-group label="标签">
        <b-form-tags
          input-id="tags-state-event"
          tag-variant="primary"
          v-model="form.tag"
          :tag-validator="tagValidator"
          placeholder="按下回车或空格键创建标签"
          separator=" "
          trim
        ></b-form-tags>
      </b-form-group>
      <b-form-group label="摘要">
        <b-form-input
          trim
          v-model="form.desc"
          placeholder="请简单描述文章内容"
        ></b-form-input>
      </b-form-group>
      <b-form-group label="文章内容">
        <wang-editor
          class="editor"
          ref="editor"
          v-model="form.content"
        ></wang-editor>
        <b-form-invalid-feedback :state="state.content">
          请输入文章内容
        </b-form-invalid-feedback>
      </b-form-group>
      <div class="text-center">
        <b-button variant="info" @click="$router.back()">
          <b-icon icon="chevron-left"></b-icon>
          返回
        </b-button>
        <b-button variant="danger" @click="handleClear">
          <b-icon icon="trash-fill"></b-icon>
          清空
        </b-button>
        <b-button variant="primary" @click="handleSubmit">
          <b-icon icon="cursor-fill"></b-icon>
          发布</b-button
        >
      </div>
    </b-form>
  </div>
</template>

<script>
const baseForm = {
  sort: null,
  tag: [],
  content: "",
  desc: "",
  title: "",
};

export default {
  layout: "profile",
  head() {
    return {
      script: [
        { src: "https://unpkg.com/@wangeditor/editor@latest/dist/index.js" },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://unpkg.com/@wangeditor/editor@latest/dist/css/style.css",
        },
      ],
    };
  },
  data() {
    return {
      editMode: false,
      form: {
        ...baseForm,
      },
      state: {
        sort: null,
        content: null,
        title: null,
      },
      showEditor: false
    };
  },
  async created() {
    if (!this.articleSort.length) await this.$store.dispatch("getArticleSort");
    let { query } = this.$route;
    let id = query.id;
    if (id && !isNaN(id)) {
      this.editMode = true;
      let { data: article } = await this.$api.user.getArticle(Number(id));
      let keys = ["content", "tag", "_id", "title", "desc","coverImg"];
      keys.forEach((key) => this.$set(this.form, key, article[key]));
      this.$set(this.form, "sort", article.sort._id);
      this.$refs.editor.setHtml(article.content);
    }
  },
  methods: {
    validator() {
      this.$set(this.state, "sort", Boolean(this.form.sort));
      this.$set(
        this.state,
        "title",
        Boolean(this.form.title) && this.form.title.length < 50
      );
      this.$set(this.state, "content", Boolean(this.form.content));
      for (let key in this.state) {
        if (!this.state[key]) return false;
      }
      return true;
    },
    tagValidator(tag) {
      return tag.length >= 2 && tag.length <= 10;
    },
    handleClear() {
      this.$bvModal
        .msgBoxConfirm(`确认清空全部内容`, {
          title: "提示",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "确定",
          cancelTitle: "取消",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then(async (value) => {
          if (!value) return;
          this.form = { ...baseForm };
          this.$refs.editor && this.$refs.editor.clear();
        });
    },
    handleSubmit() {
      if (!this.validator()) return;
      if (!this.form.desc)
        this.form.desc = this.$refs.editor.getText().substr(0, 200);
      if (this.editMode) {
        this.$api.user.editArticle(this.form).then((res) => {
          this.$router.replace("/user/profile/article");
        });
      } else {
        this.$api.user.addArticle(this.form).then((res) => {
          this.$router.replace("/user/profile/article");
        });
      }
    },
  },
  computed: {
    articleSort() {
      return this.$store.state.articleSort;
    },
    sortOptions() {
      return [{ text: "请选择文章分类", value: null }].concat(
        this.articleSort.map((item) => ({ text: item.name, value: item._id }))
      );
    },
  },
};
</script>

<style lang="scss">
.editor {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  ul {
    list-style: inherit !important;
  }
  ol {
    list-style: decimal !important;
  }
  li {
    list-style: inherit !important;
  }
}
</style>
