<template>
  <b-modal title="我的消息" id="messageBox">
    <div class="list" role="tablist">
      <b-card no-body class="mb-1" v-for="(item, index) in list" :key="index">
        <b-card-header
          header-tag="header"
          class="msgHeader p-1 d-flex align-items-center"
          role="tab"
          @click="handleMsg(item, index)"
        >
          <b-img
            :src="item.from.avatar"
            rounded="circle"
            height="30"
            width="30"
            class="mr-1"
          ></b-img>
          <span class="line-1 mr-1">{{ item.content }}</span>
          <b-badge variant="danger" v-if="!item.read">new</b-badge>
          <span class="date ml-auto text-secondary">
            <b-icon icon="clock"></b-icon>
            {{ (item.createTime * 1000) | prettyDate }}
          </span>
        </b-card-header>
        <b-collapse :id="`my-collapse-${index}`" visible accordion="tablist">
          <b-card-body class="msgContent">
            <b-card-text>{{ item.content }}</b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-pagination
        class="m-2"
        v-show="list.length > query.pageSize"
        v-model="query.page"
        :total-rows="total"
        :per-page="query.pageSize"
        align="center"
        @change="handlePageChange"
        size="sm"
      >
      </b-pagination>
      <empty v-if="!list.length" text="暂无消息" color="#ccc"></empty>
    </div>
    <template v-slot:modal-footer>
      <span> </span>
    </template>
  </b-modal>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      query: {
        page: 1,
        pageSize: 10,
      },
      total: 0,
      unread: 0
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async handleMsg(item, index) {
      this.$root.$emit("bv::toggle::collapse", `my-collapse-${index}`);
      if(!item.read){
        try{
          await this.$api.user.setRead(item._id)
          this.$set(this.list[index],'read',1)
          this.$emit("unread", --this.unread);
        }catch(error){}
      }
    },
    async getList() {
      try {
        let { data } = await this.$api.user.msgList(this.query);
        this.$set(this.query, "page", data.page);
        this.total = data.total;
        this.list = data.list;
        if (data.unread) {
          this.unread = data.unread;
          this.$emit("unread", data.unread);
        }
      } catch (error) {}
    },
    handlePageChange(page) {
      this.$set(this.query, "page", page);
      this.getList();
    },
  },
};
</script>

<style lang="scss">
#messageBox {
  .card-header {
    background-color: white;
  }
  .msgHeader {
    white-space: nowrap;
    font-size: 14px;
    .date {
      padding-left: 10px;
      display: inline-block;
      font-size: 12px;
    }
  }
  .msgContent {
    font-size: 12px;
  }
}
</style>
