<template>
  <div class="log">
    <h5 class="blockTitle">硬币记录</h5>
    <div class="d-flex mb-3">
      <b-button variant="primary" @click="getList" size="sm" class="mr-2">
        <b-icon icon="arrow-repeat"></b-icon>
      </b-button>
      <b-form-select
        v-model="query.type"
        :options="typeOpt"
        size="sm"
        class="mr-2 col-md-2"
        @change="handleUpdate"
      ></b-form-select>
    </div>
    <b-table
      hover
      :items="list"
      :fields="fields"
      bordered
      responsive="sm"
      small
      table-class="arTable"
      class="shadow-sm"
      show-empty
    >
      <template v-slot:cell(value)="data">
        <span>{{ (data.item.type == 1 ? "+" : "-") + data.value }}</span>
      </template>
      <template v-slot:cell(createTime)="data">
        <span>{{ (data.value * 1000) | formatDate }}</span>
      </template>
      <template v-slot:empty>
        <empty text="这里啥也没有~" color="#5e6ea6"></empty>
      </template>
    </b-table>
    <b-pagination
      v-show="list.length"
      v-model="query.page"
      :total-rows="total"
      :per-page="query.pageSize"
      align="center"
      @change="handlePageChange"
      size="sm"
      class="mt-auto"
    >
    </b-pagination>
  </div>
</template>

<script>
export default {
  layout: "profile",
  data() {
    return {
      typeOpt: [
        { text: "全部变化", value: null },
        { text: "增加", value: 1 },
        { text: "减少", value: 2 },
      ],
      list: [],
      query: {
        page: 1,
        pageSize: 10,
        type: null,
      },
      fields: [
        { key: "value", label: "变化", class: "text-center w-10" },
        { key: "msg", label: "信息", class: "" },
        { key: "createTime", label: "时间", class: "text-center w-25" },
      ],
    };
  },
  async asyncData({ app }) {
    let { data } = await app.$api.user.coinLog({ page: 1, pageSize: 10 });
    return {
      list: data.list,
      total: data.total,
    };
  },
  methods: {
    async getList() {
      try {
        let { data } = await this.$api.user.coinLog(this.query);
        this.list = data.list;
        this.total = data.total;
        this.$set(this.query, "page", data.page);
      } catch (error) {}
    },
    handlePageChange(page) {
      this.$set(this.query, "page", page);
      this.getList();
    },
    handleUpdate() {
      this.$set(this.query, "page", 1);
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.arTable {
  font-size: 13px;
  line-height: 40px;
  white-space: nowrap;
  color: rgb(42, 40, 40);

  td,
  th {
    // box-shadow: 0 1px 5px rgba($color: rgb(92, 92, 92), $alpha: 0.3);
    background-color: rgba($color: #fff, $alpha: 0.2);
  }
  th {
    background-color: rgba($color: #fff, $alpha: 0.5);
  }
  .b-icon {
    font-size: 100% !important;
  }
}
</style>
