<template>
  <div class="board row">
    <div class="col-md-2"></div>
    <div class="col-md-8">
      <div class="form shadow">
        <div class="header row">
          <div class="col-sm-4 d-flex" v-if="!user">
            <label>昵称：</label>
            <b-input
              size="sm"
              v-model="form.nickname"
              :placeholder="`请输入${callName}的称呼`"
              :state="state.nickname"
            ></b-input>
          </div>
          <div class="col-sm-4 d-flex" v-if="!user">
            <label>邮箱：</label>
            <b-input
              size="sm"
              v-model="form.email"
              :placeholder="`请输入${callName}的邮箱`"
              :state="state.email"
            ></b-input>
          </div>
          <b-button
            class="ml-auto mr-3"
            variant="primary"
            size="sm"
            @click="handleSubmit"
            >提交</b-button
          >
        </div>
        <b-form-textarea
          v-model="form.content"
          placeholder="欢迎留下您的足迹"
          :state="state.content"
          rows="3"
          size="sm"
        ></b-form-textarea>
      </div>
      <ul class="list glassMask">
        <li class="item shadow-lg d-flex" v-for="item in list" :key="item._id">
          <div class="left">
            <b-img
              class="avatar"
              rounded="circle"
              :src="item | avatar"
              height="40"
              width="40"
            ></b-img>
          </div>
          <div class="right">
            <div class="userInfo">
              <span class="nickname">{{ item | nickname }}</span>
              <span class="ml-auto createTime text-muted">{{
                (item.createTime * 1000) | prettyDate
              }}</span>
            </div>
            <p class="content">
              {{ item.content }}
            </p>
          </div>
        </li>
        <empty v-if="!list.length" text="暂无留言"></empty>
      </ul>
      <b-pagination
        v-show="total > query.pageSize"
        v-model="query.page"
        :total-rows="total"
        :per-page="query.pageSize"
        align="center"
        @change="handlePageChange"
        size="sm"
        class="mb-2"
      ></b-pagination>
    </div>
    <div class="col-md-2"></div>
  </div>
</template>

<script>
import defaultAvatar from "~/assets/img/head.jpg";
export default {
  async asyncData({ app }) {
    let query = {
      page: 1,
      pageSize: 20,
    };
    let { data } = await app.$api.site.getMsgBoardList(query);
    return {
      list: data.list,
      total: data.total,
      query,
    };
  },
  data() {
    return {
      state: {
        content: null,
        email: null,
        nickname: null,
      },
      total: 0,
      form: {},
      list: [],
    };
  },
  methods: {
    async getList() {
      try {
        let { data } = await this.$api.site.getMsgBoardList(this.query);
        this.list = data.list;
        this.total = data.total;
      } catch (error) {}
    },
    handlePageChange(page) {
      this.$set(this.query, "page", page);
    },
    async handleSubmit() {
      this.$set(
        this.state,
        "content",
        Boolean(this.form.content) && this.form.content.length < 500
      );
      // 判断是否为匿名用户 校验数据
      if (!this.user) {
        this.$set(
          this.state,
          "nickname",
          Boolean(this.form.nickname) && this.form.nickname.length < 20
        );
        this.$set(
          this.state,
          "email",
          Boolean(this.form.email) &&
            /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(
              this.form.email
            )
        );
      }

      for (let key in this.state) {
        if (typeof this.state[key] == "boolean" && !this.state[key]) return;
      }

      try {
        let { data } = await this.$api.site.addMsg(this.form);
        this.form = {};
        this.list.unshift(data);
      } catch (error) {}
    },
  },
  computed: {
    callName() {
      return this.$store.getters.callName;
    },
    user() {
      return this.$store.getters.user;
    },
  },
  filters: {
    avatar(item) {
      return item.from ? item.from.avatar : defaultAvatar;
    },
    nickname(item) {
      return item.from ? item.from.nickname : item.nickname;
    },
  },
};
</script>

<style lang="scss">
.board {
  .form {
    padding: 15px;
    background-color: rgba($color: #fff, $alpha: 0.5);
    margin-bottom: 20px;
    .header {
      white-space: nowrap;
      margin-bottom: 10px;
    }
  }
  .page-item.disabled .page-link {
    background-color: rgba($color: #fff, $alpha: 0.5);
  }
  .list {
    padding: 0 10px;
    .item {
      margin: 10px 0;
      padding: 10px;
      border-radius: 5px;
      background-color: rgba(253, 253, 253, 0.5);
      .left {
        margin-right: 10px;
      }
      .right {
        flex-grow: 1;
      }
      .userInfo {
        display: flex;
        align-items: center;
      }
      .nickname {
        font-size: 14px;
      }
      .createTime {
        font-size: 12px;
      }
      .content {
        background-color: rgba(253, 253, 253, 0.7);
        padding: 5px 10px;
        font-size: 14px;
        text-shadow: 0 0 5px white;
        color: #464646;
        margin: 10px 0 !important;
        word-wrap: anywhere;
      }
    }
  }
}
</style>
