<template>
  <div class="subscribe glassMask rounde">
    <h4 class="blockTitle" :style="{ background: color }">{{ title }}</h4>
    <ul>
      <li
        class="item"
        v-for="item in list"
        :key="item.title"
        @click="open(item.url)"
      >
        <div class="info">
          <span class="title" :title="item.title">{{ item.title }}</span>
          <p class="desc" :title="item.desc">{{ item.desc }}</p>
          <!-- <p class="desc" v-b-popover.hover.bottom="item.desc" :title="item.title">{{ item.desc }}</p> -->
        </div>
        <div class="left align-y">
          <img class="img-fluid" :src="item.coverImg" alt="封面图" />
        </div>
      </li>
    </ul>
    <empty v-if="!list.length"></empty>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "资讯块",
    },
    color: {
      type: String,
      default: "rgb(255,92,124)",
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  created(){
    this.list.sort((a, b) => (b.order || 0) - (a.order || 0));
  },
  methods: {
    open(url) {
      window.open(url);
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.blockTitle {
  text-align: center;
  padding: 15px;
  background-color: rgb(255, 92, 124);
  font-size: 15px;
  font-weight: bold;
  color: white;
  border-radius: 0 !important;
}

.subscribe {
  background-color: rgba($color: #fff, $alpha: 0.7);
  margin-bottom: 20px;
  .item {
    margin: 10px 0;
    display: flex;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      box-shadow: rgba(255, 255, 255, 0.15) 0 0 38px inset;
      transform: translateY(-5px);
    }
    .left {
      min-width: 35%;
      max-width: 35%;
      background-color: rgba($color: #fff, $alpha: 0.5);
    }
    .coverimg {
      width: 100%;
      // height: 100%;
    }
    .info {
      padding: 10px;
      flex-grow: 1;
      background: rgba($color: #fff, $alpha: 0.1);
      .title {
        font-weight: bold;
        font-size: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        color: #6257aa;
        text-align: center;

      }
      .desc {
        font-size: 70%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 7;
        -webkit-box-orient: vertical;
        color: #423d66;
          line-height: 14px;
          text-shadow: 0 0 5px rgb(255, 255, 255);
      }
    }
  }
}
</style>
