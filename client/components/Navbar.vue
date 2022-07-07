<template>
  <b-navbar class="myNavbar" type="dark" fixed="top" toggleable="lg">
    <login-modal v-model="showLoginModal"></login-modal>
    <message-box v-if="user" @unread="handleUnread"></message-box>
    <div class="container">
      <b-navbar-brand href="#">{{ title }}</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item
            v-for="(item, index) in navList"
            :key="item.name"
            :to="item.to"
            :active="active == index"
            >{{ item.name }}</b-nav-item
          >
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <li class="nav-item nav-player nav-custom" v-if="!profile">
            <a class="player" href="#">
              <img class="icon" src="~/assets/img/cloudmusic.png" />
              <iframe
                id="playerIframe"
                frameborder="no"
                border="0"
                marginwidth="0"
                marginheight="0"
                width="100%"
                height="300"
                src="//music.163.com/outchain/player?type=0&id=7514719126&auto=1&height=400"
              ></iframe>
            </a>
          </li>
          <b-nav-item v-show="!user && showNav" @click="showLoginModal = true"
            >登录</b-nav-item
          >
          <li class="nav-item nav-custom" id="avatar" v-if="user">
            <b-img
              rounded="circle"
              height="50"
              width="50"
              :src="user.avatar"
              class="avatar mr-2"
            ></b-img>
            <span class="nickname">{{ user.nickname }}</span>
            <b-popover
              target="avatar"
              variant="light"
              triggers="hover focus click"
              placement="bottom"
            >
              <template #title>
                <div class="profile d-flex align-items-center flex-column">
                  <span class="nickname">{{ user.nickname }}</span>
                  <span class="account text-secondary mb-2">{{
                    user.email
                  }}</span>
                  <div class="coinsItem d-flex align-items-center mb-2">
                    <div class="item">
                      <span class="name">硬币：</span>
                      <span class="value">{{ user.coin }}</span>
                    </div>
                    <div class="item">
                      <span class="name">累计签到：</span>
                      <span class="value">{{ user.signInTol }}</span>
                    </div>
                  </div>
                  <div class="level">
                    <div class="lvProgress d-flex align-items-center">
                      <span class="lvTag curLv mr-2"
                        >Lv{{ user.level.level }}</span
                      >
                      <b-progress
                        class="lvpro"
                        height="10px"
                        :value="user.exp"
                        :max="user.level.endExp"
                      ></b-progress>
                      <span class="lvTag nextLv ml-2"
                        >Lv{{ user.level.level + 1 }}</span
                      >
                    </div>
                    <span class="lvTips"
                      >当前经验值：{{ user.exp }}，距离升级还差：{{
                        user.level.endExp - user.exp
                      }}</span
                    >
                  </div>
                </div>
              </template>
              <div class="linkList">
                <div class="item" @click="handleProfile">
                  <b-icon icon="person-fill"></b-icon>
                  <span>个人中心</span>
                  <b-icon icon="chevron-right" class="ml-auto"></b-icon>
                </div>
                <div class="item" @click="$bvModal.show('messageBox')">
                  <b-icon icon="envelope-fill"></b-icon>
                  <span>消息</span>
                  <b-badge class="ml-auto mr-1" pill variant="danger" v-if="unread">{{ unread }}</b-badge>
                  <b-icon icon="chevron-right" :class="{ 'ml-auto': !unread}"></b-icon>
                </div>
                <div
                  class="item"
                  @click="$mixin.debounce(handleSinIn, 500, true)"
                >
                  <b-icon icon="table"></b-icon>
                  <span>签到</span>
                  <b-icon icon="chevron-right" class="ml-auto"></b-icon>
                </div>
                <div class="splitLine"></div>
                <div class="item" @click="handleLogout">
                  <b-icon icon="power"></b-icon>
                  <span>退出登录</span>
                  <b-icon icon="chevron-right" class="ml-auto"></b-icon>
                </div>
              </div>
            </b-popover>
          </li>
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    navList: {
      type: Array,
      default: () => [
        { name: "首页", to: "/" },
        { name: "文章", to: "/article" },
        { name: "试验田", to: "/test" },
        { name: "留言板", to: "/board" },
      ],
    },
    profile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showLoginModal: false,
      unread: 0, // 未读消息
    };
  },
  methods: {
    handleUnread(unread){
      this.unread = unread;
    },
    handleProfile() {
      this.$router.push("/user/profile");
    },
    handleLogout() {
      this.$bvModal
        .msgBoxConfirm("请确认是否退出登录？", {
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
          await this.$api.user.logout();
          this.currentPath.indexOf("/user/profile") > -1 &&
            this.$router.replace("/");
          this.$store.commit("user/setCurrent", null);
        });
    },
    async handleSinIn() {
      try {
        let { data } = await this.$api.user.signIn();
        if (data) {
          this.$store.commit("user/setCurrent", data);
        }
      } catch {}
    },
  },
  computed: {
    currentPath() {
      return this.$route.path;
    },
    active() {
      return this.currentPath == "/"
        ? 0
        : this.navList.findIndex(
            (item) => this.currentPath.indexOf(item.to) > -1 && item.to != "/"
          );
    },
    user() {
      return this.$store.state.user.current;
    },
    showNav() {
      return this.$store.state.user.showNav;
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.player {
  position: relative;
  margin-right: 15px;
  overflow: hidden;
  .icon {
    height: 30px;
    width: auto;
    animation: rotate 5s linear 2s infinite normal;
  }
  &:hover {
    overflow: unset!important;
    #playerIframe {
      opacity: 1;
    }
  }

  #playerIframe {
    opacity: 0;
    transition: 0.5s;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 100%);
    bottom: 0;
    width: 310px;
    height: 400px;
  }
}
.nav-custom {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
}
.avatar {
  border: 1px white solid !important;
}
#avatar {
  transition: 0.3s;
  & > .nickname {
    color: white;
    padding-right: 10px;
  }
  &:hover {
    background: rgba($color: #ffffff, $alpha: 0.3);
  }
}

.profile {
  .nickname {
    font-size: 16px;
    margin-bottom: 3px;
  }
  .account {
    font-size: 12px;
  }
  .coinsItem {
    justify-content: center;
    .item {
      font-size: 12px;
      margin-right: 10px;
      .value {
        font-weight: 500;
      }
      .name {
        color: rgb(129, 129, 129);
      }
    }
  }
  .level {
    align-self: stretch;
    text-align: center;
    .lvProgress {
      .lvpro {
        flex-grow: 1;
      }
      .lvTag {
        color: white;
        border-radius: 5px;
        padding: 2px 4px;
        font-size: 8px;
        letter-spacing: 1px;
      }
      .curLv {
        background-color: #ea8000;
      }
      .nextLv {
        background-color: #ccc;
      }
    }
    .lvTips {
      color: #ccc;
      font-size: 10px;
    }
  }
}

.linkList {
  .item {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    border-radius: 5px;
    transition: 0.3s;
    cursor: pointer;
    margin-bottom: 2px;
    color: rgb(69, 69, 69);
    &:hover {
      background: rgba($color: #000000, $alpha: 0.1);
      text-shadow: 0 1px 5px #fff;
    }
    span {
      margin-left: 6px;
      font-size: 90%;
    }
  }
  .splitLine {
    background-color: rgb(235, 235, 235);
    height: 1px;
    margin: 10px 0;
  }
}

.myNavbar {
  z-index: 8;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  padding: 0;
  .container {
    line-height: 35px;
  }
  &::before {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    content: "";
    background: url(~assets/img/bg.jpg) center center / cover no-repeat fixed;
    filter: blur(5px);
    z-index: -1;
  }
  .nav-link {
    transition: 0.3s;
    padding: 0.5rem 1.5rem !important;
    &:hover {
      background-color: hsla(0, 0%, 100%, 0.2);
    }
  }
  .active {
    background-color: hsla(0, 0%, 100%, 0.3) !important;
  }
}

@media all and (max-width: 768px) {
  .myNavbar {
    .nav-link {
      text-align: center;
    }
    .navbar-brand {
      padding-left: 20px;
    }
  }
  #avatar {
    justify-content: center;
    order: 1;
  }

  .nav-custom {
    padding: 5px 0;
  }

  .nav-player {
    order: 2;
    .player {
      margin-right: 0!important;
      overflow: unset!important;
      &:focus {
        #playerIframe {
          display: block;
          opacity: 1 !important;
        }
      }
    }
    #playerIframe {
      display: none;
    }
  }
}
</style>
