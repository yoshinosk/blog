<template>
  <b-modal title="修改头像" id="avatarModal">
    <div class="d-flex flex-wrap">
      <div class="left text-center">
        <div class="cropper">
          <vue-cropper
            ref="cropper"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :fixed-box="option.fixedBox"
            fixed
            :original="option.original"
            :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox"
            :high="option.high"
            :maxImgSize="500"
            @realTime="preview"
          ></vue-cropper>
        </div>
        <input
          type="file"
          id="uploads"
          class="d-none"
          accept="image/png,image/jpg,image/jpeg"
          @change="handleChange($event, 1)"
        />
        <b-button class="mt-2" size="sm" @click="handleSelect">
          <b-icon icon="image"></b-icon>
          <span class="ml-1">选择图片</span>
        </b-button>
        <b-button
          class="mt-2 ml-2"
          size="sm"
          @click="$refs.cropper.rotateLeft()"
        >
          <b-icon icon="arrow-counterclockwise"></b-icon>
        </b-button>
        <b-button
          class="mt-2 ml-2"
          size="sm"
          @click="$refs.cropper.rotateRight()"
        >
          <b-icon icon="arrow-clockwise"></b-icon>
        </b-button>
      </div>
      <div
        class="
          right
          position-relative
          ml-4
          flex-grow-1
          d-flex
          align-items-end
          justify-content-center
        "
      >
        <div class="show-preview">
          <div :style="previewStyle">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </div>
        <!-- <span class="text-secondary">头像预览</span> -->
      </div>
    </div>
    <template v-slot:modal-footer>
      <b-button size="sm" @click="$bvModal.hide('avatarModal')">取消</b-button>
      <b-button size="sm" variant="primary" @click="handleUpload"
        >上传</b-button
      >
    </template>
  </b-modal>
</template>

<script>
export default {
  data() {
    return {
      option: {
        img: "",
        size: 1,
        full: false,
        outputType: "png",
        canMove: true, // 上传图片是否可以移动
        fixedBox: false, // 固定截图框大小
        original: false, //上传图片按照原始比例渲染
        canMoveBox: true, // 截图框能否拖动
        autoCrop: true, // 是否默认生成截图框
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 150,
        autoCropHeight: 150,
        centerBox: false, //截图框是否被限制在图片里面
        high: true, //是否按照设备的dpr 输出等比例图片
      },
      previews: {},
      previewStyle: {},
    };
  },
  mounted() {
    if (this.avatar) this.$set(this.previews, "url", this.avatar);
  },
  methods: {
    handleChange(e, num) {
      var file = e.target.files[0];
      this.fileName = file.name;
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      var reader = new FileReader();
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          this.option.img = data;
        } else if (num === 2) {
          this.example2.img = data;
        }
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file);
    },
    handleSelect() {
      document.getElementById("uploads").click();
    },
    handleUpload() {
      this.$refs.cropper.getCropBlob((data) => {
        let formData = new FormData();

        formData.append(
          "avatar",
          new File([data], this.fileName, { type: data.type })
        );
        this.$api.user
          .uploadAvatar(formData)
          .then((res) => {
            return this.$api.user.setAvatar(res.data);
          })
          .then((res) => {
            this.$store.commit("user/setCurrent", { avatar: res.data });
            this.$bvModal.hide("avatarModal");
          });
      });
    },
    preview(previews) {
      this.previews = previews;
      this.previewStyle = {
        width: previews.w + "px",
        height: previews.h + "px",
        "-moz-transform": `scale(${100 / previews.w})`,
        "-moz-transform-origin": "left top",
        zoom: 100 / previews.w,
      };
    },
  },
  computed: {
    avatar() {
      return this.$store.getters.user ? this.$store.getters.user.avatar : "";
    },
  },
};
</script>

<style lang="scss" scoped>
.cropper {
  height: 250px;
  width: 250px;
}

.show-preview {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #e6eaf0;
  transform-origin: center top !important;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 40%;
}

@media all and (max-width: 768px) {
  .left {
    flex-grow: 1;
    .cropper {
      display: inline-block;
    }
  }
  .right {
    height: 200px;
  }
}
</style>
