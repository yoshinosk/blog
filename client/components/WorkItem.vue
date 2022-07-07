<template>
    <div class="workItem" :class="{show}" @click="handleClick">
      <div class="coverImg">
        <img :src="work.coverImg | articleCover" />
      </div>
      <div class="info">
        <h4 class="line-1 w-100 text-center" :title="work.title">{{ work.title }}</h4>
        <div class="desc">
          {{ work.text }}
        </div>
        <div class="tag">
          <label class="label label-info" v-for="tag in work.tag" :key="tag">
            <span>{{ tag }}</span>
          </label>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  props: {
    work: {
      type: Object,
    },
    index: {
      type: Number,
    },
  },
  mounted() {
    setTimeout(() => {
      this.show = true;
    }, this.index * 300);
  },
  methods:{
    handleClick(){
      this.$router.push(`/test/${this.work._id}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.show{
  opacity: 1!important;
  transform: translateY(0px)!important;
}
.workItem {
  opacity: 0;
  border-radius: 8px;
  transform: translateY(20px);
  margin: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 1s;
  cursor: pointer;
  height: 300px;
  &:hover {
    .coverImg {
      filter: blur(5px);
    }
  }
  .coverImg {
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    transition: all 0.3s;
    img {
      width: 100%;
      height: auto;
    }
  }
  .info {
    z-index: 1;
    flex-grow: 1;
    width: 100%;
    padding: 0 10px 10px 10px;
    background: rgba(0, 0, 0, 0.2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    transition: all 0.3s;
    h4 {
      font-size: 160%;
      // margin-top: 100px;
      font-weight: bold;
    }
    .desc {
      font-size: 90%;
      // color: rgb(97, 97, 97);
      white-space: pre-wrap;
      display: inline-block;
      width: 100%;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      word-break: break-all;
      text-align: center;
    }
    .label {
      margin-right: 3px;
      .glyphicon {
        margin-right: 2px;
      }
    }
  }
  &:hover {
    transform: translateY(5px) !important;
    transition: 0.3s;
  }
}
</style>
