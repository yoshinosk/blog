<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item to="/setting">
                    <i class="el-icon-lx-cascades"></i> 系统设定
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 设定管理
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
                <el-table-column prop="name" label="设定名"></el-table-column>
                <el-table-column prop="type" label="设定类型"></el-table-column>
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
            <el-form-item label="设定名" required>
                    <el-input v-model="form.name" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="设定类型" required>
                    <el-input v-model="form.type" placeholder=""></el-input>
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
import { getList,add,edit,del } from '@/api/setting';
export default {
    name: 'settingList',
    data() {
        return {
            query:{},
            tableData: [],
            editMode: false,
            editVisible: false,
            form: {
                data: JSON.stringify({})
            }
        };
    },
    created() {
        this.getData();
    },
    watch:{
        // 退出编辑时清空表单数据
        editVisible(val){
            if(!val){
                this.form = {
                    data: JSON.stringify({})
                }
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
