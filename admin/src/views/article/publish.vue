<template>
    <div class="articlePublish">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/article' }">文章管理</el-breadcrumb-item>
                <el-breadcrumb-item >{{ mode == 'add' ? '发布' : '编辑' }}文章</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form :model="form" label-position="top" label-width="80px" :rules="rules" ref="articleForm">
                <el-form-item label="文章标题" prop="title" required>
                    <el-col :span="6">
                        <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="封面图">
                    <!-- <el-col :span="6">
                        <el-input v-model="form.coverImg" placeholder="图片外链地址"></el-input>
                    </el-col> -->
                    <selectImage v-model="form.coverImg" :uploadLimit="1" ref="selectImage"></selectImage>
                </el-form-item>
                <el-form-item label="文章分类" prop="sort" required>
                   <el-select v-model="form.sort">
                       <el-option
                            v-for="item in sortList"
                            :key="item.value"
                            :label="item.name"
                            :value="item._id">
                        </el-option>
                   </el-select>
                </el-form-item>
                <el-form-item label="文章状态" prop="status" v-if="mode == 'edit'">
                   <el-select v-model="form.status">
                       <el-option
                            v-for="item in articleStatus"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key">
                        </el-option>
                   </el-select>
                </el-form-item>
                <el-form-item label="标签">
                   <el-tag
                        :key="tag"
                        v-for="tag in form.tag"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)"
                        type="dark"
                        size="medium"
                    >
                        {{tag}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                        maxlength="10"
                        placeholder="按下回车添加"
                    >
                    </el-input>
                    <el-tag class="button-new-tag" v-else type="dark" size="medium" @click="showInput">
                        + 添加
                    </el-tag>
                </el-form-item>
                
                <el-form-item label="摘要">
                    <el-col :span="10">
                        <el-input v-model="form.desc" placeholder="简单的描述文章内容"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="文章内容" prop="content" required>
                    <quill-editor ref="articleEditor" v-model="form.content" :options="editorOption"></quill-editor>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('articleForm')">{{ mode == 'add' ? '发布' : '保存' }}</el-button>
                    <el-button @click="resetForm('articleForm')">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
import { add,sortList,edit,getArticle } from '@/api/article';
import selectImage from '@/components/SelectImage';
import { articleStatus } from '../../utils/enum';

const baseForm = {
    tag: [],
    coverImg: ''
}

export default {
    name: 'publish',
    data() {
        return {
            mode: 'add',
            sortList: [],
            form: {},
            inputVisible: false, // 是否显示标签输入框
            inputValue: '',// 标签内容
            editorOption: {
                placeholder: '请自由发挥吧'
            },
            rules:{
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' },
                ],
                sort: [
                    { required: true, message: '请选择文章分类', trigger: 'blur' },
                ],
                content: [
                    { required: true, message: '请填写文章内容', trigger: 'blur' },
                ],
            },
            articleStatus
        };
    },
    created() {
        this.getSortList()
    },
    activated(){
        let {id} = this.$route.query;
        if(id && !isNaN(id)){
            getArticle(id).then(res=>{
                this.mode = 'edit'
                for(let key in res.data){
                    this.$set(this.form,key,res.data[key])
                }
            })
        }else {
            this.form = Object.assign({},baseForm)
            this.mode = 'add'
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid)  return;
                if(this.$refs.selectImage.loading == true) {
                    this.$message.warning('请等待封面图上传完毕后发布')
                    return this.$refs.selectImage.show();
                }
                if(!this.form.desc) this.form.desc = this.$refs.articleEditor.quill.getText().substr(0,200)
                let submit = this.mode == 'add' ? add : edit;
                
                submit(this.form).then(res=>{
                    setTimeout(()=>{
                        this.$router.replace('/article')
                    },500)
                })
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        // 获取文章分类
        getSortList(){
            sortList().then(res=>{
                this.sortList = res.data;
            })
        },
        // 删除标签
        handleClose(tag) {
            this.form.tag.splice(this.form.tag.indexOf(tag), 1);
        },
        // 展开标签输入框
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 添加标签
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue && !this.form.tag.find(item=>item == inputValue)) {
            this.form.tag.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        }
    },
    components:{
        quillEditor,
        selectImage
    }
};
</script>

<style lang="scss" scoped>
.el-tag {
    margin-right: 10px;
}
.button-new-tag {

}
.input-new-tag {
    width: 130px;
    vertical-align: bottom;
}
</style>