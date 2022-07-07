<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 系统设定 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="网站设置" name="site">
                    <el-form ref="form_site" :model="form_site" label-width="120px">
                        <el-form-item label="网站名称">
                            <el-input class="form-input" v-model="form_site.name" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="用户称呼">
                            <el-input class="form-input" v-model="form_site.callName" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="开放注册">
                            <el-switch v-model="form_site.allowRegister"></el-switch>
                        </el-form-item>
                        <el-form-item label="允许评论">
                            <el-switch v-model="form_site.allowComment"></el-switch>
                        </el-form-item>
                        <el-form-item label="允许留言">
                            <el-switch v-model="form_site.allowBoard"></el-switch>
                        </el-form-item>
                        <el-form-item label="开启网站">
                            <el-switch v-model="form_site.status" :active-value="1" :inactive-value="0"></el-switch>
                        </el-form-item>
                        <!-- <el-form-item label="网站背景">
                            <selectImage v-model="form_site.bg" :uploadLimit="1" ref="selectImageBG"></selectImage>
                        </el-form-item> -->
                        <el-form-item label="文章默认封面">
                            <selectImage v-model="form_site.articleCover" :uploadLimit="1" ref="selectImageAr"></selectImage>
                        </el-form-item>
                        <el-form-item label="网站公告">
                            <el-input style="width:500px" type="textarea" v-model="form_site.notic" placeholder="" :autosize="{ minRows: 4}"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('form_site')">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="用户配置" name="user"> </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { get, edit } from '@/api/setting';
import selectImage from '@/components/SelectImage';
export default {
    name: 'setting',
    data() {
        return {
            activeName: 'site',
            form_site: {
                allowRegister: true,
                allowComment: true,
                allowBoard: true,
                status: 1
            },
            form_user: {

            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid)  return;
                if( this.$refs.selectImageAr.loading == true) {
                    this.$message.warning('请等待图片上传完毕后提交')
                    return this.$refs.selectImage.show();
                }
                let type = formName == 'form_site' ? 'site' : '';
                edit({
                    type,
                    data: JSON.stringify(this.form_site)
                }).then(res=>{

                })
            });
        },
        getData() {
            get().then((res) => {
                // res.data.forEach(item=>{
                //     let data = JSON.parse(item.data);
                //     for(let key in data){
                //         this.$set(this.$data[`form_${item.type}`],key,data[key])
                //     }    
                // })
                for(let type in res.data){
                    let item = res.data[type]
                    for(let key in item){
                        this.$set(this.$data[`form_${type}`],key,item[key])
                    } 
                }
            });
        }
    },
    components:{
        selectImage
    }
};
</script>

<style scoped>
.form-input {
    width: 200px;
}
</style>
