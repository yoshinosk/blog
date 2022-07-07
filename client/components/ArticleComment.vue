<template>
  <div class="articleComment rounde p-3 mb-2 mt-4 pb-5">
    <div class="comTitle">{{ total }}条评论</div>
    <div class="comForm">
      <b-form-textarea
        v-model="comForm.content"
        placeholder="欢迎发表您的看法~"
        rows="3"
        class="rounde"
      ></b-form-textarea>
      <div class="formFooter d-flex justify-content-end">
        <b-button variant="primary" @click="handleSubCom">发表</b-button>
      </div>
    </div>
    <div class="comList">
      <div
        class="item shadow-lg d-flex rounde"
        v-for="(item, index) in list"
        :key="item._id"
      >
        <div class="left">
          <b-img
            class="avatar"
            rounded="circle"
            :src="item.from.avatar"
            height="50"
            width="50"
          ></b-img>
        </div>
        <div class="right">
          <div class="userInfo">
            <span class="nickname">{{ item.from.nickname }}</span>
            <span class="createTime text-muted ml-auto">{{
              (item.createTime * 1000) | prettyDate
            }}</span>
            <span class="replyBtn" @click="handleReply(index)">回复</span>
          </div>
          <p class="content">
            {{ item.content }}
          </p>
          <!-- 评论回复 -->
          <div class="reply">
            <div
              class="item shadow-sm d-flex rounde"
              v-for="reply in item.children"
              :key="reply._id"
            >
              <div class="left">
                <b-img
                  class="avatar"
                  rounded="circle"
                  :src="reply.from.avatar"
                  height="50"
                  width="50"
                ></b-img>
              </div>
              <div class="right">
                <div class="userInfo">
                  <span class="nickname">{{ reply.from.nickname }}</span>
                  <span class="createTime text-muted ml-auto">{{
                    (reply.createTime * 1000) | prettyDate
                  }}</span>
                  <span class="replyBtn" @click="handleReply(index, reply)"
                    >回复</span
                  >
                </div>
                <p class="content">
                  <span v-if="reply.reply"
                    >回复 {{ reply.reply.from.nickname }} ：</span
                  >
                  {{ reply.content }}
                </p>
              </div>
            </div>
          </div>
          <div class="comForm" v-if="curCommentIndex == index">
            <div class="wrap" :class="{ repFormShow }">
              <b-form-textarea
                v-model="repForm.content"
                :placeholder="repForm.placeholder"
                rows="3"
                size="sm"
                class="rounde"
                :ref="`textarea${index}`"
              ></b-form-textarea>
              <div class="formFooter d-flex justify-content-end">
                <b-button variant="primary" size="sm" @click="handleSubRep"
                  >发表</b-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <empty v-if="!list.length" text="暂无评论" color="#ccc" :size="50"></empty>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: [],
    },
    total: {
      type: Number,
      default: 0,
    },
    articleId: {
      type: [Number,String],

    }
  },
  mounted(){
    this.comForm.articleId = this.articleId;
    this.repForm.articleId = this.articleId;
  },
  data() {
    return {
      comForm: {
        articleId: null,
        content: "",
      },
      repForm: {
        articleId: null,
        commentId: null,
        replyId: null,
        content: "",
        placeholder: "欢迎发表您的看法~",
      },
      curCommentIndex: -1,
      repFormShow: false,
    };
  },
  methods: {
    handleReply(index, reply) {
      if(!this.user) return this.$store.commit('setErrMsg',`请${this.callName}先登录`)
      this.repFormShow = false;
      this.curCommentIndex = index;
      let comment = this.list[index];
      this.$set(this.repForm, "content", "");
      this.$set(
        this.repForm,
        "placeholder",
        `回复 ${reply ? reply.from.nickname : comment.from.nickname} `
      );
      this.$set(this.repForm, "commentId", comment._id);
      this.$set(this.repForm, "replyId", reply ? reply._id : null);
      this.$nextTick(() => {
        this.repFormShow = true;
        this.$refs[`textarea${index}`][0].focus();
      });
    },
    // 发表评论
    handleSubCom() {
      if(!this.user) return this.$store.commit('setErrMsg',`请${this.callName}先登录`)
      if(!this.comForm.content) return this.$store.commit('setErrMsg','请输入评论内容')
      if(!this.comForm.content.length > 500) return this.$store.commit('setErrMsg','评论内容过长')
      this.$api.article.addComment(this.comForm).then((res) => {
        this.$set(this.comForm, "content", "");
        this.list.push(res.data);
      });
    },
    // 发表回复
    handleSubRep() {
      if(!this.user) return this.$store.commit('setErrMsg',`请${this.callName}先登录`)
      if(!this.repForm.content) return this.$store.commit('setErrMsg','请输入评论内容')
      if(!this.repForm.content.length > 500) return this.$store.commit('setErrMsg','评论内容过长')
      this.$api.article.addComment(this.repForm).then((res) => {
        this.$set(this.repForm, "content", "");
        if(this.list[this.curCommentIndex].children){
          this.list[this.curCommentIndex].children.push(res.data)
        }else{
          this.$set(this.list[this.curCommentIndex],'children',[res.data])
        }
        this.$set(this.repForm, "commentId", null);
        this.$set(this.repForm, "replyId", null);
        this.curCommentIndex = -1;
      });
    },
  },
  computed:{
    user(){
      return this.$store.getters.user;
    },
    callName(){
      return this.$store.getters.callName;
    }
  }
};
</script>

<style lang="scss" scoped>
.articleComment {
  background-color: white;
  .comTitle {
    font-size: 16px;
    padding: 10px 0;
    // border-bottom: 1px solid #e4e4e4;
  }

  .comList {
    .item {
      margin: 10px 0;
      padding: 10px;
      background-color: rgb(253, 253, 253);
      .left {
        margin-right: 5px;
      }
      .right {
        flex-grow: 1;
      }
      .userInfo {
        display: flex;
        align-items: center;
        .replyBtn {
          margin-left: 10px;
          color: rgba(21, 18, 220, 0.5);
          font-size: 14px;
          cursor: pointer;
        }
      }
      .nickname {
        font-size: 14px;
      }
      .createTime {
        font-size: 12px;
      }
      .content {
        background-color: #f4f4f4;
        padding: 5px 10px;
        font-size: 14px;
        text-shadow: 0 0 5px white;
        color: #464646;
        margin: 10px 0 !important;
        word-wrap: anywhere;
      }
      .reply {
        background-color: #f7f7f7;
        .item {
          background-color: unset !important;
          margin: 0 !important;
          // border-bottom: 1px solid rgb(225, 225, 225);
          &:last-child {
            border-bottom: none !important;
          }
        }
      }
    }
  }

  .comForm {
    margin-top: 10px;
    .formFooter {
      margin-top: 10px;
    }
    .wrap {
      opacity: 0;
      transition: 1s;
      overflow: hidden;
    }
    .repFormShow {
      opacity: 1 !important;
    }
  }
}
</style>
