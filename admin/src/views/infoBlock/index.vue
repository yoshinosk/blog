<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 信息块管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-refresh" class="handle-del mr10" @click="getData"></el-button>
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="editVisible = true">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" row-key="_id">
                <el-table-column type="expand">
                    <template v-slot="{ row }">
                        <el-table :data="row.list" border class="table" header-cell-class-name="table-header" row-key="name" size="mini">
                            <el-table-column prop="coverImg" width="120px" align="center" label="封面">
                                <template v-slot="{ row }">
                                    <el-image style="height: 100px; width: 100px" fit="contain" :src="row.coverImg | imgUrl"></el-image>
                                </template>
                            </el-table-column>
                            <el-table-column prop="title" label="标题" width="120px"></el-table-column>
                            <el-table-column prop="url" label="地址" width="200px" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="desc" label="描述" show-overflow-tooltip></el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" align="left"></el-table-column>
                <el-table-column prop="name" label="信息块名"></el-table-column>
                <el-table-column label="状态" align="center" width="60">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === 1 ? 'success' : scope.row.status === 0 ? 'danger' : ''">{{
                            viewStatus(scope.row)
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="editMode ? '编辑' : '添加'" :visible.sync="editVisible" width="50%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="标题" required>
                    <el-input v-model="form.title" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="信息块名" required>
                    <el-input v-model="form.name" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="状态" required>
                    <el-select v-model.number="form.status">
                        <el-option v-for="status in statusList" :key="status.key" :label="status.value" :value="status.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="列表">
                    <el-table :data="form.list" border class="table" header-cell-class-name="table-header" row-key="name" size="mini">
                        <el-table-column prop="coverImg" label="封面" width="70px" align="center">
                            <template v-slot="{ row }">
                                <el-image style="height: 50px; width: 50px" fit="contain" :src="row.coverImg | imgUrl"></el-image>
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="标题" width="100px" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="url" label="地址" width="150px" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="order" label="排序" width="150px" align="center">
                            <template v-slot="{ row, $index }">
                                <span class="order" v-if="orderIndex != $index" @click="orderIndex = $index">{{ row.order || 0 }}</span>
                                <el-input-number
                                    size="mini"
                                    v-else
                                    v-model="row.order"
                                    :min="0"
                                    :max="255"
                                    @blur="orderIndex = -1"
                                ></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column prop="desc" label="描述" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作" align="center" width="70px">
                            <template v-slot="{ row, $index }">
                                <el-button type="text" icon="el-icon-edit" @click="handleEditItem($index, row)">编辑</el-button>
                                <el-button type="text" icon="el-icon-delete" class="red" @click="handleDeleteItem(row, form)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item label="标题" required>
                    <el-input v-model="form_temp.title" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="描述" required>
                    <el-input v-model="form_temp.desc" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="地址" required>
                    <el-input v-model="form_temp.url" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="排序" required>
                    <el-input-number size="mini" v-model="form_temp.order" :min="0" :max="255"></el-input-number>
                </el-form-item>
                <el-form-item label="封面" required>
                    <SelectImage v-model="form_temp.coverImg" :uploadLimit="1"></SelectImage>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" @click="handleAddList">{{ editItem ? '保存' : '添加到列表' }}</el-button>
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
import { getList, add, edit, del } from '@/api/infoBlock';
import SelectImage from '../../components/SelectImage.vue';
import { viewStatus } from '@/utils/enum';

function formBaseData() {
    return {
        list: []
    };
}

export default {
    name: 'infoBlock',
    data() {
        return {
            query: {},
            tableData: [],
            editMode: false,
            editVisible: false,
            form: formBaseData(),
            form_temp: {}, // 子项目表单
            tempIndex: -1, // 需要编辑的子项目索引
            editItem: false, // 子项目编辑模式
            statusList: viewStatus,
            orderIndex: -1
        };
    },
    created() {
        this.getData();
    },
    watch: {
        // 退出编辑时清空表单数据
        editVisible(val) {
            if (!val) {
                this.form = formBaseData();
                this.form_temp = {};
                this.editMode = false;
                this.editItem = false;
                this.orderIndex = -1;
            }
        }
    },
    methods: {
        handleEditItem(index, row) {
            this.editItem = true;
            this.tempIndex = index;
            for (let key in row) {
                this.$set(this.form_temp, key, row[key]);
            }
        },
        viewStatus(row) {
            return viewStatus.find((item) => item.key == row.status).value;
        },
        getData() {
            getList(this.query).then((res) => {
                let checkRights = (data) => {
                    data.forEach((item) => {
                        if (item.isRights) item.disabled = true;
                        else if (item.children) checkRights(item.children);
                    });
                };
                checkRights(res.data);
                this.tableData = res.data;
            });
        },
        handleAddList() {
            let { title, desc, url, coverImg } = this.form_temp;
            if (!title || !desc || !url || !coverImg) return;
            if (this.editItem) {
                for (let key in this.form_temp) this.$set(this.form.list[this.tempIndex], key, this.form_temp[key]);
                for (let key in this.form_temp) this.$set(this.form_temp, key, '');
                this.editItem = false;
            } else {
                this.form.list.push({ title, desc, url, coverImg });
                for (let key in this.form_temp) this.$set(this.form_temp, key, '');
            }
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
            request(this.form).then((res) => {
                this.getData();
                this.editVisible = false;
            });
        },
        // 删除操作
        handleDelete(row) {
            this.$confirm(`请确认是否删除信息块：${row.name}`).then(() => {
                del(row._id).then((res) => {
                    this.getData();
                });
            });
        },
        handleDeleteItem(row, form) {
            form.list.splice(
                form.list.findIndex((item) => item.name == row.name),
                1
            );
        }
    },
    components: { SelectImage }
};
</script>

<style scoped>
.table {
    margin: 5px 0;
}
</style>
