<template>
    <div class="selectImage">
        <div class="imgBox" v-if="!imgList.length" @click="visible = true">
            <i class="el-icon-plus"></i>
        </div>
        <div v-else>
            <div class="imgBox" v-for="(item, index) in imgList" :key="index" @click="visible = true">
                <el-image class="smallImg" :src="item | imgUrl" fit="contain"></el-image>
            </div>
        </div>
        <el-dialog title="选择图片" :visible.sync="visible" append-to-body>
            <el-tabs v-model="activeTab" @tab-click="handleTabClick" v-loading="loading">
                <el-tab-pane label="外链图片" name="link">
                    <el-input v-model="linkImgUrl" placeholder="请输入图片外链地址" size="medium"></el-input>
                </el-tab-pane>
                <el-tab-pane label="上传图片" name="upload">
                    <el-upload
                        :action="`${HOST}/api/user/upload/image`"
                        name="files"
                        accept="image/jpeg,image/png,image/gif,image/jpg,image/bmp"
                        :headers="headers"
                        list-type="picture-card"
                        ref="upload"
                        :auto-upload="false"
                        :limit="uploadLimit"
                        :on-change="handleOnChange"
                        :on-preview="handlePictureCardPreview"
                        :on-success="handleUploadSuccess"
                        :on-error="handleUploadFail"
                    >
                        <i slot="default" class="el-icon-plus"></i>
                        <!-- <div slot="file" slot-scope="{ file }">
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                            <span class="el-upload-list__item-actions">
                                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                    <i class="el-icon-zoom-in"></i>
                                </span>
                                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                    <i class="el-icon-delete"></i>
                                </span>
                            </span>
                        </div> -->
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="素材库" name="store"> </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 预览图 -->
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
    </div>
</template>

<script>
import { LIMIT_UPLOAD_SIZE } from '@/utils/config';
export default {
    name: 'selectImage',
    data() {
        return {
            visible: false,
            activeTab: 'link',
            linkImgUrl: '',
            // ELEMENT上传组件相关 **
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            fileList: [],
            // ELEMENT上传组件相关 **
            imgList: [],
            loading: false,
        };
    },
    props: {
        // 上传文件最大数
        uploadLimit: {
            type: Number,
            default: 6
        },
        value: {
            type: [Array, String],
            default: ''
        }
    },
    methods: {
        // 展开选择框 外部调用
        show() {
            this.visible = true;
        },
        // 点击确定
        confirm() {
            switch (this.activeTab) {
                case 'link':
                    if (this.linkImgUrl) {
                        this.imgList = [this.linkImgUrl];
                        this.$emit('input', this.linkImgUrl);
                    }
                    break;
                case 'upload':
                    this.loading = true;
                    this.$refs.upload.submit();
                    break;
            }
            this.visible = false;
        },
        cancel() {
            this.visible = false;
        },
        handleTabClick(e) {
            // console.log(e);
        },
        handleOnChange(file, fileList) {
            if (!/(gif|jpg|jpeg|png|GIF|JPG|PNG|bmp|BMP)/.test(file.raw.type)) {
                this.$message.error('请选择图片文件');
                fileList.pop();
            } else if (file.raw.size / 1024 / 1024 > LIMIT_UPLOAD_SIZE) {
                this.$message.error(`图片大小不能超过${LIMIT_UPLOAD_SIZE}MB`);
                fileList.pop();
            }
            this.fileList = fileList;
        },
        // 预览
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleUploadSuccess(response, file, fileList) {
            console.log(response, file, fileList);
            this.uploadLimit == 1 ? (this.imgList = [response.data[0]]) : this.imgList.push(...response.data);
            if (this.imgList.length == this.fileList.length) {
                this.loading = false;
                this.$emit('input', this.uploadLimit == 1 ? this.imgList[0] : this.imgList);
            }
        },
        handleUploadFail(err, file, fileList) {
            console.log(err);
            this.$message.error(err.toString());
            this.loading = false;
        }
    },
    computed: {
        headers() {
            return {
                Authorization: 'Bearer ' + this.$store.state.user.token
            };
        },
        HOST(){
            return this.$store.state.HOST;
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(value, oldVal) {
                if (oldVal == '' && !this.imgList.length) {
                    if (this.value) {
                        if (this.value instanceof Array) {
                            this.value.forEach(item=>{
                                this.imgList.push(item);
                            })
                            
                        } else {
                            this.imgList.push(this.value);
                        }
                    }
                }
            }
        }
    }
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
    padding: 10px 20px 20px 20px !important;
}

.imgBox {
    font-size: 30px;
    border-radius: 8px;
    padding: 10px;
    border: 1px dashed #c0ccda;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #fbfdff;
    color: #8c939d;
    width: 100px;
    height: 100px;
    margin-right: 15px;
    cursor: pointer;
    &:hover {
        border: 1px dashed #898e94;
    }
    .smallImg {
        height: 100%;
        width: auto;
    }
}
</style>
