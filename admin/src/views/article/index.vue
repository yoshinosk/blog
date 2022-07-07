<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 文章管理
                </el-breadcrumb-item>
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
                    icon="el-icon-plus"
                    class="handle-del mr10"
                    @click="$router.push('/article/publish')"
                >添加</el-button>
                <el-select class="mr10" v-model="query.sort" placeholder="文章分类">
                    <el-option
                        v-for="item in articleSorts"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id">
                    </el-option>
                </el-select>
                <el-select class="mr10" v-model="query.status" placeholder="文章状态">
                    <el-option
                        v-for="item in articleStatus"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key">
                    </el-option>
                </el-select>
                <el-input v-model="query.searchKey" placeholder="文章标题/作者" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                row-key="_id"
            >
                <el-table-column prop="_id" label="ID" width="120" align="center"></el-table-column>
                <el-table-column prop="title" label="标题" width="350"></el-table-column>
                <el-table-column prop="sort.name" label="分类" align="center"></el-table-column>
                <el-table-column prop="author.nickname" label="作者"></el-table-column>
                <el-table-column prop="views" label="阅读" width="60" align="center"></el-table-column>
                <el-table-column prop="goods" label="点赞" width="60" align="center"></el-table-column>
                <el-table-column prop="order" label="排序" width="150" align="center">
                    <template v-slot="{ row, $index }">
                        <span class="order" v-if="orderIndex != $index" @click="orderIndex = $index">{{ row.order }}</span>
                        <el-input-number size="mini" v-else v-model="row.order" @change="handleChangeOrder" :min="0" :max="255" @blur="orderIndex = -1"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="发布时间" :formatter="dateFormat" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" width="100" align="center">
                    <template v-slot="{ row }">
                        <el-tag size="medium" effect="dark" :type="getArticleTag(row.status)">{{ row.status | articleStatus }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit-outline"
                            @click="handleApproval(scope.row)"
                            v-if="[0,2].includes(scope.row.status)"
                        >审核</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.row)"
                        >删除</el-button>
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

        <el-dialog title="文章审核" :visible.sync="showApprDialog">
            <el-form ref="apprForm" :model="apprForm" :rules="rules" label-width="100px">
                <el-form-item label="文章">
                    <el-input v-model="apprForm.title" placeholder="" disabled></el-input>
                </el-form-item>
                <el-form-item label="审核结果" prop="result" required>
                    <el-select v-model="apprForm.result">
                        <el-option v-for="item in approvalResults" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="不通过原因" prop="remark" required v-if="apprForm.result == 2">
                    <el-input v-model="apprForm.remark" placeholder=""></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showApprDialog = false">取 消</el-button>
                <el-button type="primary" @click="approval">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import editor from '@/components/page/VueEditor.vue'
import { getList,del,sortList,approval,setOrder } from '@/api/article';
import { articleStatus } from '@/utils/enum'
import { dateFormat } from '@/utils/tool'
export default {
    name: 'article',
    data() {
        let that = this;
        return {
            showApprDialog: false, // 审核窗口
            approvalResults: [{name:'审核通过',value:1},{name:'审核不通过',value:2}],
            apprForm:{
                result: 1,
                remark: ''
            },
            rules:{
                result: [
                    { required: true, message: '请选择审核结果', trigger: 'blur' },
                ],
                remark: [
                    { 
                        validator: (rule,value,callback) => {
                            if(that.apprForm.result == 2 && value == '') callback('请输入审核不通过原因')
                            else callback()
                        },
                         trigger: 'blur'
                    }
                ]
            },
            query:{
                page: 1,
                pageSize: 10,
                sort: '',
                status: ''
            },
            articleSorts:[{_id: '',name: '全部分类'}],
            articleStatus:[{key: '',value: '全部状态'},...articleStatus],
            pageTotal: 0,
            tableData: [],
            orderIndex: -1, // 选中的需要排序的文章
        };
    },
    created() {
        this.getData();
        sortList().then(res=>{
            this.articleSorts.push(...res.data)
        })
    },
    methods: {
        handleChangeOrder(e){

            let article = this.tableData[this.orderIndex];
            setOrder(article._id, e).then(res=>{

            })
        },
        dateFormat(row){ return dateFormat(row.createTime) },
        getData() {
            getList(this.query).then(res => {
                this.pageTotal = res.data.total;
                this.tableData = res.data.list;
            });
        },
        getArticleTag(status){
            if(status < 0) status = String(status);
            let map = {
                '-1': 'danger',
                0: 'info',
                1: 'success',
                2: 'warning'
            }
            return map[status]
        },
        // 编辑操作
        handleEdit(row) {
            this.$router.push(`/article/publish?id=${row._id}`);
        },
        // 删除操作
        handleDelete(row){
            this.$confirm(`请确认是否删除该文章：${row.title}`).then(()=>{
                del(row._id).then(res=>{
                    this.getData();
                })
            })
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'page', val);
            this.getData();
        },
         // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'page', 1);
            this.getData();
        },
        // 审核
        handleApproval(row){
            this.$set(this.apprForm,'title',row.title)
            this.$set(this.apprForm,'id',row._id)
            this.showApprDialog = true;
        },
        approval(){
            this.$refs['apprForm'].validate((valid) => {
                if (!valid)  return;
                approval(this.apprForm).then(res=>{
                    this.showApprDialog = false;
                    this.getData();
                })
            });
        }
    },
    components:{
        editor
    },
    filters:{
        articleStatus(status){
            return articleStatus.find(item=>item.key == status).value;
        },
    }
};
</script>

<style scoped>
@import url('../../assets/css/table.css');
.order{
    cursor: pointer;
}
</style>