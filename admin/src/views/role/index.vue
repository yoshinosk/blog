<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 角色管理
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
                <el-table-column prop="_id" label="ID" width="120"></el-table-column>
                <el-table-column prop="name" label="角色名称"></el-table-column>
                <el-table-column prop="title" label="角色称号"></el-table-column>
                <el-table-column prop="rights" label="角色权限">
                    <template v-slot="{row}">
                        <span v-if="!row.rights.length">无</span>
                        <el-cascader
                            v-else
                            v-model="row.rights"
                            :options="rightsList"
                            :props="cascaderProps"
                            disabled
                            placeholder="无"
                            clearable>
                        </el-cascader>
                    </template>
                </el-table-column>
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
                <el-form-item label="角色名称" required>
                    <el-input v-model="form.name" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="角色称号" >
                    <el-input v-model="form.title" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="角色权限" >
                    <el-cascader
                        v-model="form.rights"
                        :options="rightsList"
                        :props="cascaderProps"
                        clearable>
                    </el-cascader>
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
import { getList,add,edit } from '@/api/role';
import { getList as getRightsList } from '@/api/rights';
export default {
    name: 'role',
    data() {
        return {
            query:{},
            tableData: [],
            rightsList:[],
            editMode: false,
            editVisible: false,
            form: {},
            cascaderProps:{
                value:'_id',
                label:'name',
                multiple: true, 
                checkStrictly: false,
                emitPath:false
            }
        };
    },
    created() {
        this.getData();
        getRightsList().then(res=>{
            this.rightsList = res.data;
        })
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
