<template>
  <div
    class="item shadow-lg mb-3 rounde"
    :class="{ articleShow: show }"
    @click="handleClick"
  >
    <div class="bg">
      <img :src="cover | articleCover" @error="handleError" />
    </div>
    <div class="info">
      <div class="title" :title="item.title">{{ item.title }}</div>
      <p class="abstract" :title="item.desc">
        {{ item.desc }}
      </p>
      <div class="bottom">
        <b-badge variant="secondary">
          {{ item.author.nickname }}
        </b-badge>
        <b-badge variant="primary">
          <b-icon icon="clock-fill"></b-icon>
          <span>{{ (item.createTime * 1000) | prettyDate }}</span>
        </b-badge>
        <b-badge variant="info">
          <b-icon icon="tag-fill"></b-icon>
          {{ item.sort.name }}
        </b-badge>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      show: false,
      cover: this.$store.getters.articleCover,
    };
  },
  created() {
    this.cover = this.item.coverImg;
  },
  mounted() {
    let ms = this.index.toFixed(0).slice(-1) * 100;
    let work = this.$worker
      .run(
        (ms) => {
          let start = new Date().getTime();
          while (Date.now() - start <= ms) {
            if (Date.now() - start >= ms) {
              return;
            }
          }
        },
        [ms]
      )
      .then((e) => {
        this.show = true;
        work = null;
      })
      .catch((err) => {});
  },
  methods: {
    handleClick() {
      this.$router.push({ path: `/article/${this.item._id}` });
    },
    handleError() {
      this.cover = this.$store.getters.articleCover;
    },
  },
};
</script>

<style lang="scss" scoped>
.articleShow {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
.item {
  position: relative;
  transition: all 0.5s;
  height: 120px;
  z-index: 1;
  overflow: hidden;
  transform: translateY(10px);
  opacity: 0;
  cursor: pointer;
  &:hover{
    transform: scale(1.05)!important;
    .bg {
      filter: blur(0px);
    }
  }
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 110%;
    width: 110%;
    margin: -5%;
    filter: blur(5px);
    content: "";
    z-index: -1;
    text-align: center;
    transition: all 0.5s;
    img {
      height: auto;
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .info {
    position: relative;
    z-index: 1;
    padding: 10px;
    color: white;
    height: 100%;
    width: 100%;
    transition: all 0.5s;
    display: flex;
    justify-content: center;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.1);
    &:hover {
      background: rgba(0, 0, 0, 0.2);
      .title {
        font-size: 15px;
        top: 15%;
      }

      .abstract {
        opacity: 1;
      }
    }
    .title {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      transition: 0.4s;
      text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      padding: 0 10px;
    }
    .abstract {
      opacity: 0;
      transition: all 0.5s;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      padding-top: 22px;
      text-shadow: 0 0 2px rgba(255, 255, 255, 0.2);
      font-size: 12px;
    }
    .bottom {
      position: absolute;
      text-align: left;
      font-size: 90%;
      bottom: 5px;
      left: 5px;
      // background-color: rgba(255, 255, 255, 0.4);
      padding: 5px;
      width: 100%;
      // opacity: 0;
      transition: 0.5s;
      .label {
        margin-right: 5px;
      }
      span {
        margin-right: 2px;
      }
    }
  }
}
</style>
