<template>
  <div >
    <!-- <div class="row">
            <div class="col-md-4">
                <div class="worksCount glassMask">
                     <span>{{count}}</span>
                </div>
            </div>
        </div> -->
    <div class="row">
      <div class="col-md-4" v-for="(item, index) in list" :key="item._id">
        <workItem :work="item" :index="index"></workItem>
      </div>
      <div class="col-md-12" v-if="!list.length">
        <div class="glassMask emptyWrap"><empty></empty></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({app}) {
    let { data } = await app.$api.article.getTestFieldList()
    return {
      total: data.total,
      list: data.list
    }
  },
  data(){
    return {
      list: [],
      total: 0
    }
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.emptyWrap{
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.worksCount {
  padding: 10px;
  border-radius: 10px;
  color: white;
  margin: 10px;
  span {
    color: rgb(91, 192, 222);
    font-weight: bold;
  }
}
</style>
