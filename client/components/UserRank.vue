<template>
  <div class="userRank">
    <div class="blockTitle mb-2">{{ title }}</div>
    <ul>
      <li class="item" v-for="(item,index) in list " :key="item._id">
        <b-badge pill variant="primary">{{ index + 1 }}</b-badge>
        <b-img rounded="circle" alt="头像" width="40" height="40" :src="item.avatar"></b-img>
        <span class="nickname">{{ item.nickname }}</span>
        <span>{{ item[field] }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        list: [],
        title: '签到排行榜',
        field: 'signInTol'
      }
    },
    props:{
      type:{
        type:String,
        default: 'signInTol'
      }
    },
    mounted(){
      switch(this.type){
        case 'signInTol':
          return this.getSignInTolRank();
      }
    },
    methods:{
      async getSignInTolRank(){
        try {
          let { data } = await this.$api.site.signInTolRank();
          this.list = data;
        } catch (error) {

        }
      }
    }
  }
</script>

<style lang="scss" scoped>

.userRank{
  background-color: rgba($color: #fff, $alpha: 0.5);
}
</style>
