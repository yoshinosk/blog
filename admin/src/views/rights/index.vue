<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 权限管理
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
                <el-table-column prop="name" label="权限名称"></el-table-column>
                <el-table-column prop="field" label="列名" align="left"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
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
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="editMode ? '编辑' : '添加'" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="权限名称" required>
                    <el-input v-model="form.name" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="列名" required>
                    <el-input v-model="form.field" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-cascader
                        v-model="form.pid"
                        :options="tableData"
                        @change="handleChange"
                        :props="cascaderProps"
                       :disabled="!form.pid && form._id && !form.isRights "
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="是否为子权限">
                    <el-switch
                        v-model="form.isRights"
                        :active-value="1"
                        :inactive-value="0"    
                    >
                    </el-switch>
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
import { getList,add,edit,del } from '@/api/rights';
export default {
    name: 'rights',
    data() {
        return {
            query:{},
            tableData: [],
            editMode: false,
            editVisible: false,
            form: {},
            cascaderProps:{
                value:'_id',
                label:'name',
                checkStrictly:true
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
                this.form = {}
                this.editMode = false;
            }
        }
    },
    methods: {
        handleChange(e){
            if(e && e.length) this.$set(this.form,'pid',e.at(-1));
        },
        getData() {
            getList(this.query).then(res => {
                let checkRights = data =>{
                    data.forEach(item=>{
                        if(item.isRights) item.disabled = true;
                        else if(item.children) checkRights(item.children);
                    })
                }
                checkRights(res.data)
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
            if( this.form._id && (this.form.pid == this.form._id))  return this.$message.error('禁止选择当前分类')
            request(this.form).then(res=>{
                this.getData()
                this.editVisible = false;
            })
        },
        // 删除操作
        handleDelete(row){
            this.$confirm(`请确认是否删除权限：${row.name}`).then(()=>{
                del(row._id).then(res=>{
                    this.getData();
                })
            })
        }
    }
};
</script>

<style scoped>


</style>
