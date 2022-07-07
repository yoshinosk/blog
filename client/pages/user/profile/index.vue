<template>
  <div class="home h-100">
    <avatar-modal></avatar-modal>
    <div class="block rounde shadow mb-4 overflow-hidden">
      <div class="bTitle bg-primary text-white">个人信息</div>
      <div class="userInfo d-flex">
        <div class="avatarWrap" @click="$bvModal.show('avatarModal')">
          <div class="mask">修改头像</div>
          <b-img
            rounded="circle"
            height="70"
            width="70"
            :src="user.avatar"
            class="avatar"
          ></b-img>
        </div>
        <div class="account d-flex flex-column">
          <div class="nickname">
            <span>{{ user.nickname }}</span>
            <!-- <b-badge variant="secondary">uid {{ user._id }}</b-badge> -->
            <b-badge
              class="mr-1"
              variant="success"
              v-for="item in user.roles"
              :key="item.name"
              >{{ item.title }}</b-badge
            >
          </div>
          <div class="level">
            <div class="lvProgress d-flex align-items-center">
              <b-badge class="shadow" variant="primary"
                >LV {{ user.level.level }}</b-badge
              >
              <b-progress
                class="lvpro shadow"
                height="20px"
                :max="user.level.endExp"
              >
                <b-progress-bar :value="user.exp">
                  <div>
                    {{ user.exp }} /
                    <span class="endExp">{{ user.level.endExp }}</span>
                  </div>
                </b-progress-bar>
              </b-progress>
              <b-badge class="lvTitle" variant="info">{{
                user.level.title
              }}</b-badge>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="infoList">
                <div class="item">
                  <span class="name">UID</span>
                  <span class="value">{{ user._id }}</span>
                </div>
                <div class="item">
                  <span class="name">账号</span>
                  <span class="value line-2">{{ user.email }}</span>
                </div>
                <div class="item">
                  <span class="name">昵称：</span>
                  <span class="value" v-if="!editMode">
                    {{ user.nickname }}
                  </span>
                  <span class="value" v-else>
                    <b-input
                      size="sm"
                      v-model="form.nickname"
                      :state="state_nickname"
                      placeholder="请输入您的昵称"
                    ></b-input>
                  </span>
                </div>
                <div class="item">
                  <span class="name">签名：</span>
                  <span class="value" v-if="!editMode">
                    {{ user.usersign }}
                  </span>
                  <span class="value" v-else>
                    <b-input
                      size="sm"
                      v-model="form.usersign"
                      :state="state_usersign"
                      placeholder="请输入您的签名"
                    ></b-input>
                  </span>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="infoList">
                <div class="item">
                  <span class="name">累计签到</span>
                  <span class="value">{{ user.signInTol }}</span>
                </div>
                <div class="item">
                  <span class="name">连续签到</span>
                  <span class="value">{{ user.signInCtn }}</span>
                </div>
                <div class="item">
                  <span class="name">注册时间</span>
                  <span class="value">{{
                    (user.registerTime * 1000) | formatDate
                  }}</span>
                </div>
                <div class="item">
                  <span class="name">上次登录</span>
                  <span class="value">{{
                    (user.lastLoginTime * 1000) | formatDate
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <b-button
        class="float-right m-2"
        variant="primary"
        size="sm"
        @click="handleEdit"
        >{{ editMode ? "保存" : "编辑资料" }}</b-button
      >
      <b-button
        v-show="editMode"
        class="float-right m-2"
        variant="secondary"
        size="sm"
        @click="editMode = false"
        >取消</b-button
      >
    </div>
    <div class="row">
      <div class="col-md-6 homeLeft">
        <div class="block rounde shadow">
          <div class="bTitle bg-primary text-white">我的评论</div>
          <ul class="commentList">
            <li
              class="item p-2"
              v-for="item in comment"
              :key="item._id"
              @click="$router.push(`/article/${item.article._id}`)"
            >
              <div class="header d-flex align-items-center">
                <b-icon icon="clock"></b-icon>
                <span class="text-secondary">{{
                  (item.createTime * 1000) | formatDate
                }}</span>
                <span
                  class="
                    trashBtn
                    ml-auto
                    text-white
                    bg-danger
                    p-1
                    rounded-circle
                  "
                  @click.stop="handleDelComment(item)"
                >
                  <b-icon icon="trash-fill"></b-icon>
                </span>
              </div>
              <div class="line-2 content">
                {{ item.content }}
              </div>
              <div class="line-1 to text-secondary">
                回复：{{ item | replyConten }}
              </div>
            </li>
          </ul>
          <b-pagination
            class="m-2"
            v-show="reply.length"
            v-model="query_comment.page"
            :total-rows="commentTotal"
            :per-page="query_comment.pageSize"
            align="center"
            @change="handlePageChangeComment"
            size="sm"
          >
          </b-pagination>
          <empty v-if="!comment.length" color="#ccc" text="暂无评论"></empty>
        </div>
      </div>
      <div class="col-md-6">
        <div class="block rounde shadow pb-2">
          <div class="bTitle bg-primary text-white" @click="getReply">
            回复我的
          </div>
          <ul class="replyList">
            <li
              class="item"
              v-for="item in reply"
              :key="item._id"
              @click="$router.push(`/article/${item.article._id}`)"
            >
              <div class="author d-flex align-items-center">
                <b-img

                  rounded="circle"
                  height="30"
                  width="30"
                  :src="item.from.avatar"
                ></b-img>
                <span class="nickname">{{ item.from.nickname }}</span>
                <span class="createTime ml-auto text-secondary">{{
                  (item.createTime * 1000) | formatDate
                }}</span>
              </div>
              <div class="content d-flex">
                <div class="cover">
                  <b-img
                    fluid
                    :src="item.article.coverImg | articleCover"
                  ></b-img>
                </div>
                <div
                  class="
                    right
                    d-flex
                    flex-column flex-grow-1
                    justify-content-center
                  "
                >
                  <span class="line-2 msg">{{ item.content }}</span>
                  <span class="line-1 to text-secondary">{{
                    item | replyConten
                  }}</span>
                </div>
              </div>
            </li>
          </ul>
          <b-pagination
            class="m-2"
            v-show="reply.length"
            v-model="query_reply.page"
            :total-rows="replyTotal"
            :per-page="query_reply.pageSize"
            align="center"
            @change="handlePageChangeReply"
            size="sm"
          >
          </b-pagination>
          <empty v-if="!reply.length" color="#ccc" text="暂无评论"></empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "profile",
  data() {
    return {
      query_reply: {
        page: 1,
        pageSize: 10,
      },
      query_comment: {
        page: 1,
        pageSize: 10,
      },
      replyTotal: 0,
      commentTotal: 0,
      reply: [],
      comment: [],
      form: {
        nickname: "",
        usersign: "",
      },
      editMode: false,
    };
  },
  mounted() {
    this.getReply();
    this.getComment();
  },
  methods: {
    handleEdit() {
      let keys = ["nickname", "usersign"];
      if (this.editMode) {
        if (!this.state_nickname || !this.state_usersign) return;
        let equal = true;
        for (let key of keys) {
          if (this.form[key] != this.user[key]) {
            equal = false;
            break;
          }
        }
        if (equal) {
          this.editMode = false;
          return;
        }
        this.$api.user.editProfile(this.form).then(({ data }) => {
          this.$store.commit("user/setCurrent", data);
          this.editMode = false;
        });
      } else {
        keys.forEach((item) => {
          this.$set(this.form, item, this.user[item]);
        });
        this.editMode = true;
      }
    },
    getReply() {
      this.$api.user.myReply(this.query_reply).then(({ data }) => {
        this.replyTotal = data.total;
        this.reply = data.list;
      });
    },
    getComment() {
      this.$api.user.myComment(this.query_comment).then(({ data }) => {
        this.commentTotal = data.total;
        this.comment = data.list;
      });
    },
    async handleDelComment(item) {
      let confirm = await this.$bvModal.msgBoxConfirm(`请确认是否删除该评论`, {
        title: "提示",
        size: "sm",
        buttonSize: "sm",
        okVariant: "danger",
        okTitle: "确定",
        cancelTitle: "取消",
        footerClass: "p-2",
        hideHeaderClose: false,
        centered: true,
      });
      if (!confirm) return false;
      try {
        await this.$api.user.delComment(item._id);
        let index = this.comment.findIndex((c) => c._id == item._id);
        this.comment.splice(index, 1);
      } catch (error) {}
    },
    handlePageChangeReply(page) {
      this.$set(this.query_reply, "page", page);
      this.getReply();
    },
    handlePageChangeComment(page) {
      this.$set(this.query_comment, "page", page);
      this.getComment();
    },
  },
  filters: {
    replyConten(item) {
      return (
        item?.reply?.content || item?.comment?.content || item.article.title
      );
    },
  },
  computed: {
    user() {
      return this.$store.state.user.current || {};
    },
    state_nickname() {
      return Boolean(this.form.nickname) && this.form.nickname.length <= 20 && /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/.test(this.form.nickname);
    },
    state_usersign() {
      return Boolean(this.form.usersign) && this.form.usersign.length <= 50;
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  .block {
    background-color: white;
    .bTitle {
      margin-bottom: 10px;
      padding: 10px 0;
      // border-bottom: 1px solid #ccc;
      text-align: center;
    }
  }
  .userInfo {
    padding: 5px;
    align-self: stretch;
    .avatarWrap {
      position: relative;
      height: 70px;
      .mask {
        color: white;
        text-align: center;
        font-size: 12px;
        line-height: 70px;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 50%;
        height: 100%;
        width: 100%;
        background-color: rgba($color: #000000, $alpha: 0.5);
        transition: 0.5s;
        opacity: 0;
        user-select: none;
        cursor: pointer;
      }
      &:hover {
        .mask {
          opacity: 1;
        }
      }
    }
    .account {
      padding: 10px 5px;
      flex-grow: 1;
      .nickname {
        font-size: 15px;
      }
      .email {
        font-size: 11px;
      }
    }
    .level {
      text-align: center;
      margin-top: 5px;
      .lvProgress {
        .lvpro {
          flex-grow: 1;
        }
        .endExp {
          color: rgb(179, 179, 179);
        }
        .lvTitle {
          margin-left: 10px;
        }
      }
    }
  }

  .infoList {
    font-size: 13px;
    margin-top: 20px;
    .item {
      margin-bottom: 5px;
      display: flex;
      span {
        display: inline-block;
      }
      .name {
        min-width: 60px;
      }
      .value {
        flex-grow: 1;
      }
    }
  }
}

.replyList {
  padding: 0 10px;
  .item {
    margin: 10px 0;
    cursor: pointer;
    box-shadow: 0 1px 5px rgba($color: #000000, $alpha: 0.2);
    .author {
      padding: 5px;
      .nickname {
        margin-left: 5px;
        font-size: 13px;
      }
      .createTime {
        font-size: 11px;
      }
    }
    .content {
      background-color: #f9f9f9;
      font-size: 13px;
      .right {
        padding: 5px 10px;
      }
      .msg {
      }
      .to {
        font-size: 11px;
      }
      .cover {
        display: flex;
        align-items: center;
        height: 70px;
        width: 70px;
        background-color: rgba($color: rgb(159, 159, 159), $alpha: 0.1);
      }
    }
  }
}

.commentList {
  .item {
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    .header {
      font-size: 10px;
      .bi-clock {
        transform: translateY(1px);
        margin-right: 3px;
      }
      .trashBtn {
        font-size: 12px;
        line-height: 12px;
        cursor: pointer;
      }
    }
    .content {
      font-size: 14px;
    }
    .to {
      font-size: 11px;
    }
  }
}

@media all and (max-width: 768px) {
  .homeLeft {
    margin-bottom: 30px;
  }
}
</style>
