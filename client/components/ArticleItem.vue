<template>
  <div
    class="articleBox rounde"
    :class="{ articleShow: show }"
    @click="handleClick"
  >
    <div class="bg">
      <img :src="cover | articleCover" @error="handleError" />
    </div>
    <div class="info rounde">
      <div class="title line-1" :title="article.title">{{ article.title }}</div>
      <p class="abstract" :title="article.desc">
        {{ article.desc }}
      </p>
      <div class="bottom">
        <b-badge variant="primary">
          <b-icon icon="person-fill"></b-icon>
          {{ article.author.nickname }}
        </b-badge>
        <b-badge variant="secondary">
          <b-icon icon="clock-fill"></b-icon>
          <span>{{ (article.createTime * 1000) | prettyDate }}</span>
        </b-badge>
        <b-badge variant="info">
          <b-icon icon="tag-fill"></b-icon>
          {{ article.sort.name }}
        </b-badge>
        <b-badge variant="success" v-for="item in article.tag" :key="item">
          <!-- <b-icon icon="tag-fill"></b-icon> -->
          {{ item }}
        </b-badge>
      </div>
    </div>
  </div>
</template>

<script>
import { IsPC } from "~/assets/js/utils";
export default {
  data() {
    return {
      show: false,
      cover: this.$store.getters.articleCover,
    };
  },
  props: {
    article: {
      type: Object,
      default: {},
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  created() {
    this.cover = this.article.coverImg;
  },
  mounted() {
    if (IsPC()) {
      let ms = this.index.toFixed(0).slice(-1) * 200;
      let start = new Date().getTime();
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
    }
  },
  methods: {
    handleClick() {
      this.$router.push({ path: `/article/${this.article._id}` });
    },
    handleError(err) {
      this.cover = this.$store.getters.articleCover;
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin-bottom: 0;
}
.articleShow {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
.articleBox {
  padding: 5px;
  position: relative;
  width: 100%;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  overflow: hidden;
  transition: all 0.5s;
  margin-bottom: 20px;
  height: 200px;
  cursor: pointer;
  transform: translateY(20px);
  opacity: 0;
  &:hover {
    .bg {
      filter: blur(0px);
    }
    .bottom {
      opacity: 0;
      transform: translateY(5px);
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
        font-size: 160%;
        top: 20%;
      }

      .abstract {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .title {
      text-align: center;
      font-size: 140%;
      font-weight: bold;
      transition: 0.4s;
      text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 50%;
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
      transform: translateY(10px);
      transition: all 0.5s;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      padding-top: 25px;
      text-shadow: 0 0 2px rgba(255, 255, 255, 0.2);
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

@media all and (max-width:768px){
  .articleBox{
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
}
</style>
