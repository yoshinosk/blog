<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-user"></i> 用户管理
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
                <el-select v-model="query.status" class="handle-select mr10">
                    <el-option v-for="item in userStatus" :key="item.value" :label="item.value" :value="item.key"></el-option>
                </el-select>
                <el-input v-model="query.searchKey" placeholder="昵称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column prop="_id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column label="头像" align="center">
                    <template slot-scope="scope">
                        <el-avatar
                            class="table-td-thumb"

                            :src="scope.row.avatar"
                            :preview-src-list="[scope.row.avatar]"
                        ></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column prop="nickname" label="用户名" width="150"></el-table-column>
                <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
                <el-table-column prop="roles" label="角色" :formatter="roleFormat"></el-table-column>
                <el-table-column prop="exp" label="经验" width="50"></el-table-column>
                <el-table-column prop="level.level" label="等级" width="50"></el-table-column>
                <el-table-column prop="coin" label="金币" width="50"></el-table-column>
                <el-table-column prop="lastLoginTime" label="最后登录" :formatter="dateFormat"></el-table-column>
                <el-table-column prop="registerTime" label="注册时间" :formatter="dateFormat"></el-table-column>
                <el-table-column label="状态" align="center" width="60">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.status===1?'success':(scope.row.status===0?'danger':'')"
                        >{{scope.row.status == 1 ? '正常' : '封禁'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <!-- <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%" v-loading="loading">
            <el-form ref="form" :model="form" label-width="70px">
            <el-form-item label="ID">
                    <el-input v-model="form._id" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="form.nickname" disabled></el-input>
                </el-form-item>
                <el-form-item label="经验值">
                    <el-input v-model.number="form.exp"></el-input>
                </el-form-item>
                <el-form-item label="金币">
                    <el-input v-model.number="form.coin"></el-input>
                </el-form-item>
                <el-form-item label="角色组">
                    <el-select v-model="form.roles" :multiple="true">
                        <el-option v-for="item in roleList" :key="item._id" :label="item.title" :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号状态">
                    <el-select v-model="form.status">
                        <el-option v-for="item in userStatus" :key="item.value" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getList,edit } from '@/api/user';
import { getList as getRoleList } from '@/api/role';
import { dateFormat } from '@/utils/tool';
import { userStatus } from '@/utils/enum';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                page: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            roleList: [],
            userStatus,
            loading: false
        };
    },
    created() {
        this.getData();
        getRoleList().then(({data})=>{
            this.roleList = data;
        })
    },
    methods: {
        roleFormat(row){
            return row.roles.map(item=>item.title).join(';')
        },
        dateFormat(row,col){
            return dateFormat(row[col.property])
        },
        getData() {
            getList(this.query).then(({data}) => {
                this.tableData = data.list;
                this.pageTotal = data.total;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'page', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.editVisible = true;
            for(let key in row){
                if(key == 'roles'){
                    this.$set(this.form,key,row[key].map(item=>item.name))
                }else this.$set(this.form,key,row[key])
            }
        },
        // 保存编辑
        saveEdit() {
            this.loading = true;
            this.editVisible = false;
            edit(this.form).then(res=>{
                this.loading = false;
                this.getData()
            })
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
@import url('../../assets/css/table.css');
</style>
