<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/article' }">文章管理</el-breadcrumb-item>
                <el-breadcrumb-item>文章分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-refresh" class="handle-del mr10" @click="getData"></el-button>
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="editVisible = true">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" row-key="_id">
                <!-- <el-table-column type="index" width="50"></el-table-column> -->
                <el-table-column prop="_id" label="ID" width="50"></el-table-column>
                <el-table-column prop="name" label="分类名"></el-table-column>
                <el-table-column prop="desc" label="描述"></el-table-column>
                <el-table-column prop="order" label="排序" width="150" align="center">
                    <template v-slot="{ row, $index }">
                        <span class="order" v-if="orderIndex != $index" @click="orderIndex = $index">{{ row.order }}</span>
                        <el-input-number
                            size="mini"
                            v-else
                            v-model="row.order"
                            @change="handleChangeOrder"
                            :min="0"
                            :max="255"
                            @blur="orderIndex = -1"
                        ></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 编辑弹出框 -->
            <el-dialog :title="editMode ? '编辑' : '添加'" :visible.sync="editVisible" width="30%">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="分类名" required>
                        <el-input v-model="form.name" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="描述" required>
                        <el-input v-model="form.desc" placeholder=""></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import editor from '@/components/page/VueEditor.vue';
import { sortList, sortAdd, sortEdit, sortDel, sortOrder } from '@/api/article';
export default {
    name: 'sort',
    data() {
        return {
            tableData: [],
            editMode: false,
            editVisible: false,
            form: {},
            orderIndex: -1 // 选中的需要排序的文章
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
        handleChangeOrder(e) {
            let item = this.tableData[this.orderIndex];
            sortOrder(item._id, e).then((res) => {});
        },
        getData() {
            sortList(this.query).then((res) => {
                this.tableData = res.data;
            });
        },
        // 删除操作
        handleDelete(row) {
            this.$confirm(`请确认是否删除该分类：${row.name}`).then(() => {
                sortDel(row._id).then((res) => {
                    this.getData();
                });
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
            let request = this.editMode ? sortEdit : sortAdd;
            request(this.form).then((res) => {
                this.getData();
                this.editVisible = false;
                this.form = {};
            });
        }
    },
    components: {
        editor
    }
};
</script>