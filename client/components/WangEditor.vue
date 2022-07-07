<template>
  <div class="editor">
    <div id="toolbar-container"></div>
    <div id="editor-container" style="height: 500px"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: "",
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val, old) {
        if (val && old == "") this.editor && this.editor.setHtml(val);
      },
    },
  },
  mounted() {
    const that = this;
    const { createEditor, createToolbar, IEditorConfig, IDomEditor } =
      window.wangEditor;

    // 编辑器配置
    const editorConfig = { MENU_CONF: {} };
    let token = this.$store.getters.token;
    editorConfig.MENU_CONF["uploadImage"] = {
      server: process.env.BASE_URL + "/api/user/upload/image",
      fieldName: "files",
      maxNumberOfFiles: 5,
      maxFileSize: 1 * 1024 * 5000,
      allowedFileTypes: ["image/*"],
      // 自定义上传
      customUpload(file, insertFn) {
          // file 即选中的文件
          // 自己实现上传，并得到图片 url alt href
          // 最后插入图片
          let formData = new FormData();
          formData.append('files',file)
          that.$api.user.upload(formData).then(res=>{
            res.data.forEach(item=>{
              let url = new URL(item,process.env.BASE_URL)
              insertFn(url.toString(), '', url.toString())
            })
          })
      }
    };
    editorConfig.placeholder = "请输入内容";
    editorConfig.onChange = (editor) => {
      // 当编辑器选区、内容变化时，即触发
      that.$emit("input", editor.getHtml());
    };

    // 工具栏配置
    const toolbarConfig = {
      excludeKeys: ["uploadVideo"],
    };

    // 创建编辑器
    this.editor = createEditor({
      selector: "#editor-container",
      config: editorConfig,
      mode: "default", // 或 'simple' 参考下文
    });
    // 创建工具栏
    const toolbar = createToolbar({
      editor: this.editor,
      selector: "#toolbar-container",
      config: toolbarConfig,
      mode: "default", // 或 'simple' 参考下文
    });
  },
  methods: {
    getText() {
      return this.editor ? this.editor.getText() : "";
    },
    setHtml(html){
      this.editor.setHtml(html);
    },
    clear() {
      this.editor && this.editor.clear();
    },
  },
  beforeDestroy() {
    if (this.editor == null) return;
    this.editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
};
</script>

<style lang="scss" scoped>
.editor {
  z-index: 10;
}
</style>
