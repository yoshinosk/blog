<template>
  <div class="myArticle d-flex flex-column flex-grow-1">
    <h5 class="blockTitle">您已发布{{ arTotal }}篇文章~</h5>
    <div class="header mb-3">
      <b-button variant="primary" @click="getList" size="sm" class="mr-2">
        <b-icon icon="arrow-repeat"></b-icon>
      </b-button>
      <b-form-select
        v-model="query.sort"
        :options="sortOptions"
        size="sm"
        class="mr-2"
        @change="handleUpdate"
      ></b-form-select>
      <b-form-select
        v-model="query.status"
        :options="statusOptions"
        size="sm"
        class="mr-2"
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
      <template v-slot:cell(title)="data">
        <span v-b-tooltip.hover :title="data.value">{{ data.value }}</span>
      </template>
      <template v-slot:cell(createTime)="data">
        <span>{{ (data.value * 1000) | formatDate }}</span>
      </template>
      <template v-slot:cell(status)="data">
        <b-badge :variant="data.value == '正常' ? 'success' : 'secondary'">{{
          data.value
        }}</b-badge>
      </template>
      <template v-slot:cell(active)="{ item }">
        <b-button @click="handleToggle(item)" size="sm" variant="info" v-if="![0,-1,2].includes(item.status)">
          <b-icon icon="eye"></b-icon>

        切换显示 </b-button>
        <b-button @click="handleEdit(item)" size="sm" variant="primary">
          <b-icon icon="pencil"></b-icon>
          编辑
        </b-button>
        <b-button @click="handleDel(item)" size="sm" variant="danger">
          <b-icon icon="trash-fill"></b-icon>
          删除
        </b-button>
      </template>
      <template v-slot:empty>
        <empty text="这里啥也没有~" color="#5e6ea6"></empty>
      </template>
    </b-table>
    <b-pagination
      v-show="list.length"
      v-model="query.page"
      :total-rows="total"
      :per-page="10"
      align="center"
      @change="handlePageChange"
      size="sm"
      class="mt-auto"
    >
    </b-pagination>
  </div>
</template>

<script>
import { articleStatus } from "~/assets/js/enum";
export default {
  layout: "profile",
  async asyncData({ app }) {
    let { data } = await app.$api.user.myArticle({ page: 1 });
    return {
      total: data.total,
      arTotal: data.total,
      list: data.list,
    };
  },
  data() {
    return {
      query: {
        page: 1,
        status: null,
        sort: null,
      },
      list: [],
      total: 0,
      fields: [
        { key: "title", label: "标题", class: "titleCell" },
        { key: "sort.name", label: "分类", class: "text-center" },
        { key: "views", label: "阅读量", class: "text-center" },
        {
          key: "status",
          label: "状态",
          class: "text-center",
          formatter: (value) =>
            articleStatus.find((item) => item.key == value).value,
        },
        { key: "createTime", label: "发布时间", class: "text-center" },
        { key: "active", label: "操作", class: "text-center" },
      ],
    };
  },
  async mounted() {
    if (!this.articleSort.length) await this.$store.dispatch("getArticleSort");
  },
  methods: {
    async getList() {
      try {
        let { data } = await this.$api.user.myArticle(this.query);
        this.list = data.list;
        this.total = data.total;
      } catch (error) {}
    },
    handleToggle(item) {
      this.$api.user.articleToggle(item._id).then((res) => {
        let index = this.list.findIndex((art) => art._id == item._id);
        if (index >= 0) {
          this.$set(this.list[index], "status", item.status == 1 ? 3 : 1);
        }
      });
    },
    handleDel(item) {
      this.$bvModal
        .msgBoxConfirm(`请确认是否删除文章【${item.title}】`, {
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
          await this.$api.user.delArticle(item._id);
          this.getList();
        });
    },
    handleEdit(item) {
      this.$router.push(`/user/profile/publish?id=${item._id}`);
    },
    handlePageChange(val) {
      this.$set(this.query, "page", val);
      this.getList();
    },
    handleUpdate() {
      this.$set(this.query, "page", 1);
      this.getList();
    },
  },
  computed: {
    statusOptions() {
      return [{ text: "全部状态", value: null }].concat(
        articleStatus.map((item) => ({ text: item.value, value: item.key }))
      );
    },
    articleSort() {
      return this.$store.state.articleSort;
    },
    sortOptions() {
      return [{ text: "全部分类", value: null }].concat(
        this.articleSort.map((item) => ({ text: item.name, value: item._id }))
      );
    },
  },
};
</script>

<style lang="scss">
.myArticle {
  height: 100%;
  .custom-select {
    width: 150px;
  }
}
.titleCell {
  min-width: 200px;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 10px !important;
}
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

@media all and (max-width: 768px) {
  .myArticle {
    .custom-select {
      width: 33.3%;
    }
  }
}
</style>
