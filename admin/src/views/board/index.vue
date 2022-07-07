<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 等级管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-refresh" class="handle-del mr10" @click="getData"></el-button>
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="editVisible = true">添加</el-button>
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                row-key="_id"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="nickname" label="昵称">
                    <template v-slot="{ row }">
                        <span v-if="row.from">
                            {{ row.from.nickname }}
                        </span>
                        <span v-else>{{ row.nickname }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                    <template v-slot="{ row }">
                        <span v-if="row.from">
                            {{ row.from.email }}
                        </span>
                        <span v-else>{{ row.email }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column prop="createTime" label="发布时间" :formatter="dateFormat"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template v-slot="scope">
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.page"
                    :page-size="query.pageSize"
                    :total="total"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { getList, del } from '@/api/board';
import { dateFormat } from '@/utils/tool';
export default {
    name: 'board',
    data() {
        return {
            query: {
                page: 1,
                pageSize: 10
            },
            tableData: [],
            form: {},
            total: 0,
            multipleSelection: []
        };
    },
    created() {
        this.getData();
    },
    methods: {
        handlePageChange() {
            this.$set(this.query, 'page', val);
            this.getData();
        },
        dateFormat(row) {
            return dateFormat(row.createTime);
        },
        getData() {
            getList(this.query).then((res) => {
                this.tableData = res.data.list;
                this.total = res.data.total;
            });
        },
        handleDel(row) {
            this.$confirm(`请确认是否删除该留言`).then(() => {
                del(row._id).then((res) => {
                    this.getData();
                });
            });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            if (!this.multipleSelection.length) return;
            this.$confirm(`请确认是否删除${this.multipleSelection.length}条留言`).then(() => {
                del(this.multipleSelection.map((item) => item._id)).then((res) => {
                    this.getData();
                    this.multipleSelection = [];
                });
            });
        }
    }
};
</script>

<style scoped>
</style>
