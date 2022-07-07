<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 等级管理
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
                    @click="editVisible = true"
                >添加</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                row-key="_id"
            >
                <el-table-column prop="level" label="等级"></el-table-column>
                <el-table-column prop="title" label="等级称号"></el-table-column>
                <el-table-column prop="startExp" label="开始经验"></el-table-column>
                <el-table-column prop="endExp" label="结束经验"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template v-slot="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="editMode ? '编辑' : '添加'" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="等级" required>
                    <el-input v-model.number="form.level" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="等级称号" >
                    <el-input v-model="form.title" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="开始经验" required>
                    <el-input v-model.number="form.startExp" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="结束经验" required>
                    <el-input v-model.number="form.endExp" placeholder=""></el-input>
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
import { getList,add,edit,del } from '@/api/level';
export default {
    name: 'level',
    data() {
        return {
            query:{},
            tableData: [],
            editMode: false,
            editVisible: false,
            form: {}
        };
    },
    created() {
        this.getData();
    },
    watch:{
        // 退出编辑时清空表单数据
        editVisible(val){
            if(!val){
                this.form = {}
                this.editMode = false;
            }
        }
    },
    methods: {
        getData() {
            getList(this.query).then(res => {
                
                this.tableData = res.data;
            });
        },
        // 编辑操作
        handleEdit(index, row) {
            this.form = row
            this.editMode = true;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            let request = this.editMode ? edit : add;
            if(!this.form.rights) this.form.rights = [];
            request(this.form).then(res=>{
                this.getData()
                this.editVisible = false;
            })
        },
    }
};
</script>

<style scoped>

</style>
