<template>
  <div class="ArticleBoxWrap rounde">
    <div class="title">{{ title }}</div>
    <!-- list -->
    <ul class="ArticleBox pt-2">
      <li v-for="item in list" :key="item._id" @click="jump(item._id)">
        <div class="left">
          <img :src="item.coverImg | articleCover" />
        </div>
        <div class="right">
          <div class="authorTitle line-2">
            {{ item.title }}
          </div>
          <div class="tags"><b-badge class="mr-1" variant="info" v-for="tag in item.tag" :key="tag">{{ tag }}</b-badge></div>
        </div>
      </li>
    </ul>
    <!-- list end -->
    <empty v-if="!list.length" text="暂无文章"></empty>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: "相关文章",
    },
  },
  methods: {
    jump(id) {
      this.$router.push({ path: `/article/${id}` });
    },
  },
  components: {},
};
</script>

<style  scoped>
.title {
  font-size: 15px;
  font-weight: bold;
  color: white;
  background-color: rgb(61, 113, 233);
  text-align: center;
  padding: 10px;
}
.label {
  margin-right: 2px;
}

.ArticleBoxWrap {
  background-color: rgba(255, 255, 255, 0.5);
  overflow: hidden;
}
.ArticleBox li {
  padding: 10px 10px;
  transition: all 0.2s;
  margin: 0 !important;
  font-size: 80%;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.ArticleBox li:hover {
  box-shadow: rgba(3, 3, 8, 0.15) 0 0 38px;
  transform: translateY(-5px);
}
.ArticleBox li .left {
  height: 50px;
  max-width: 80px;
  min-width: 80px;
  margin-right: 10px;
  color: .444;
  text-align: center;
}
.ArticleBox li .left img {
  height: 100%;
  max-width: 100%;
}
.ArticleBox li .right {
  display: flex;
  flex-direction: column;
}
.ArticleBox li .right .authorTitle {
  font-weight: bold;
  margin: 5px 0;
  color: rgb(52, 96, 217);
}
.ArticleBox li .right .read {
  color: #aaa;
  font-size: 80%;
}
</style>
