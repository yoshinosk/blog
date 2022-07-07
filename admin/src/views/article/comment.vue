<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/article' }">文章管理</el-breadcrumb-item>
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 文章评论 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-refresh"
                    class="handle-del mr10"
                    @click="getData"
                ></el-button>
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="query.article" placeholder="文章" style="width:200px" class="handle-input mr10"></el-input>
                <el-input v-model="query.nickname" placeholder="用户名" style="width:200px" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="table"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="article.title" label="文章" width="150"></el-table-column>
                <el-table-column prop="from.nickname" label="用户" width="150"></el-table-column>
                <el-table-column prop="content" label="内容" ></el-table-column>
                <el-table-column prop="createTime" label="发布时间" :formatter="dateFormat" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="80">
                    <template v-slot="{ row }">
                        <el-tag size="medium" effect="dark" :type="row.status ? 'success' : 'danger'">{{ row.status ? '正常' : '已删除' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete( scope.row)" v-if="scope.row.status"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.page"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { commentList,commentDel } from '@/api/article';
import { dateFormat } from '@/utils/tool'
export default {
    data() {
        return {
            query: {
                page: 1,
                pageSize: 10,
                nickname: '',
                article: ''
            },
            pageTotal: 0,
            tableData: [],
            multipleSelection: [],
        };
    },
    created() {
        this.getData();
    },
    methods: {
        dateFormat(row){ return dateFormat(row.createTime) },
        getData() {
            commentList(this.query).then(({data})=>{
                this.pageTotal = data.total;
                this.tableData = data.list;
            })
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'page', val);
            this.getData();
        },
        // 删除操作
        handleDelete(row){
            this.$confirm(`请确认是否删除该评论：${row.content}`).then(()=>{
                commentDel(row._id).then(res=>{
                    this.getData();
                })
            })
        },
        handleSearch(){
            this.$set(this.query, 'page', 1);
            this.getData();
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            if(!this.multipleSelection.length) return;
            this.$confirm(`请确认是否删除${this.multipleSelection.length}条评论`).then(()=>{
                commentDel(this.multipleSelection.map(item=>item._id)).then(res=>{
                    this.getData();
                    this.multipleSelection = [];
                })
            })
        },
    }
};
</script>

<style lang="scss" scoped>
@import url('../../assets/css/table.css');
</style>