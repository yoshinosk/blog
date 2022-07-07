<template>
  <div class="selectImage">
    <div class="imgBox" @click="$bvModal.show('selectImage')" v-if="!isEmpty">
      <b-icon icon="plus"></b-icon>
    </div>
    <template v-else>
      <template v-if="Array.isArray(value)">
        <div class="imgBox" v-for="(item, index) in value" :key="index" @click="$bvModal.show('selectImage')">
          <img class="smallImg" :src="item | imgUrl" fit="contain" />
        </div>
      </template>
      <template v-else>
        <div class="imgBox" @click="$bvModal.show('selectImage')">
          <img class="smallImg" :src="value | imgUrl" fit="contain" />
        </div>
      </template>
    </template>
    <b-modal title="选择图片" id="selectImage" size="lg">
      <b-tabs card v-model="mode">
        <b-tab title="外链图片">
          <b-input v-model="linkImgUrl" placeholder="请输入图片地址"></b-input>
        </b-tab>
        <b-tab title="上传图片">
          <div class="d-flex flex-wrap">
            <div class="imgBox" v-for="(item, index) in tempList" :key="index">
              <img class="smallImg" :src="item" fit="contain" />
              <div class="mask">
                <b-icon
                  class="mr-2"
                  icon="x-circle"
                  @click="handleDel(index)"
                ></b-icon>
                <b-icon icon="search" @click="handlePreview(item)"></b-icon>
              </div>
            </div>
            <div
              class="imgBox"
              @click="handleSelect"
              v-if="tempList.length < limit"
            >
              <input
                type="file"
                id="uploads"
                class="d-none"
                accept="image/png,image/jpg,image/jpeg"
                @change="handleChange($event, 1)"
              />
              <b-icon icon="plus"></b-icon>
            </div>
          </div>
        </b-tab>
      </b-tabs>
      <template v-slot:modal-footer>
        <b-button size="sm" @click="$bvModal.hide('selectImage')"
          >取消</b-button
        >
        <b-button size="sm" variant="primary" @click="handleSubmit">确定</b-button>
      </template>
    </b-modal>
    <b-modal title="预览图片" id="preview" size="lg">
      <b-img :src="previewUrl" fluid></b-img>
      <template v-slot:modal-footer>
        <span> </span>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      linkImgUrl: "",
      fileList: [], // 等待上传的文件列表
      tempList: [], // 上传图片展示的blob路径
      previewUrl: "",
      mode: 0,
    };
  },
  props: {
    value: {
      type: [String, Array],
      default: "",
    },
    limit: {
      type: Number,
      default: 1,
    },
  },
  mounted(){
    if(this.limit == 1){
      this.linkImgUrl = this.value;
    }else{

    }
  },
  methods: {
    handleDel(index) {
      this.fileList.splice(index, 1);
      this.tempList.splice(index, 1);
    },
    handlePreview(item) {
      this.previewUrl = item;
      this.$bvModal.show("preview");
    },
    handleSelect() {
      document.getElementById("uploads").click();
    },
    handleChange(e) {
      let file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$bvToast.toast("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种", {
          title: `错误信息`,
          variant: "danger",
          solid: true,
          toaster: "b-toaster-top-center",
        });
        return false;
      }
      if (this.fileList.find((item) => item.name == file.name)) return false;
      this.fileList.push(file);
      this.tempList.push(URL.createObjectURL(file));
    },
    handleSubmit(){
      // 外链
      if(this.mode == 0){
        this.$emit('input',this.linkImgUrl);
        this.$bvModal.hide("selectImage");
      }else{
        // 上传
        if(!this.tempList.length){
          this.$emit('input', this.limit == 1 ? '' : []);
          this.$bvModal.hide("selectImage");
          return;
        }
        let formData = new FormData();
        for(let item of this.fileList){
          formData.append('files',item);
        }
        this.$store.commit('setLoading',true)
        this.$api.user.upload(formData).then(res=>{
          this.$store.commit('setLoading',false);
          this.$emit('input', this.limit == 1 ? res.data[0] : res.data);
          this.$bvModal.hide("selectImage");
          this.fileList = []
        }).catch(err=>{
          this.$store.commit('setLoading',false)
        })
      }
    }
  },
  computed: {
    isEmpty() {
      return Array.isArray(this.value) ? this.value.length : this.value;
    },
  },
};
</script>

<style lang="scss">
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
  margin-right: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  .mask {
    opacity: 0;
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: rgba($color: #000000, $alpha: 0.3);
    transition: 0.5s;
    color: white;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &:hover,
  &:active,
  &:focus {
    border: 1px dashed #898e94;
    .mask {
      opacity: 1;
    }
  }
  .smallImg {
    height: auto;
    width: 100%;
  }
}
</style>
