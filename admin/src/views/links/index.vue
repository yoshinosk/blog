<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-s-promotion"></i> 友情链接 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-refresh" class="handle-del mr10" @click="getData"></el-button>
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="editVisible = true">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" row-key="_id">
                <el-table-column label="网站图标" align="center">
                    <template slot-scope="scope">
                        <el-avatar class="table-td-thumb" :src="scope.row.icon" ></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="网站名称"></el-table-column>
                <el-table-column prop="url" label="网站链接"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" :formatter="dateFormat" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template v-slot="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="editMode ? '编辑' : '添加'" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="网站名称" required>
                    <el-input v-model="form.name" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="网站地址" required>
                    <el-input v-model.number="form.url" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <el-input v-model.number="form.icon" placeholder=""></el-input>
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
import { getList, add, edit, del } from '@/api/links';
import { dateFormat } from '@/utils/tool';
export default {
    name: 'links',
    data() {
        return {
            query: {},
            tableData: [],
            editMode: false,
            editVisible: false,
            form: {}
        };
    },
    created() {
        this.getData();
    },
    watch: {
        // 退出编辑时清空表单数据
        editVisible(val) {
            if (!val) {
                this.form = {};
                this.editMode = false;
            }
        }
    },
    methods: {
        dateFormat(row) {
            return dateFormat(row.createTime);
        },
        getData() {
            getList(this.query).then((res) => {
                this.tableData = res.data;
            });
        },
        // 编辑操作
        handleEdit(index, row) {
            this.form = row;
            this.editMode = true;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            let request = this.editMode ? edit : add;
            if (!this.form.rights) this.form.rights = [];
            request(this.form).then((res) => {
                this.getData();
                this.editVisible = false;
            });
        },
        // 删除操作
        handleDelete(row) {
            this.$confirm(`请确认是否删除友情链接：${row.name}`).then(() => {
                del(row._id).then((res) => {
                    this.getData();
                });
            });
        },
    }
};
</script>

<style scoped>
</style>
