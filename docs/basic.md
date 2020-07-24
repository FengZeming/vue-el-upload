<!--
 * @Author: liu
 * @LastEditTime: 2020-07-24 17:43:25
 * @FilePath: \vue-el-upload\docs\basic.md
 * @version: Do not edit
 * @Description: 文件描述
-->

基本用法

```vue
<template>
  <div id="app">
    <el-button type="danger" @click.prevent="do_open_dialog">上传</el-button>

    <vue-el-upload
      ref="upload"
      postAction="dev-api/upload"
      :path="path"
      :title="title"
      :headers="headers"
      :maximum="maximum"
      :error_type="error_type"
      @on-success="do_success"
    ></vue-el-upload>
  </div>
</template>

<script>
export default {
  name: 'app',

  data() {
    return {
      // extensions: ['mp4', 'css'],
      postAction: 'dev-api/upload',
      // name: 'file',
      // multiple: true,
      // size: 1024 * 1024 * 2000, //10m
      maximum: 5,
      reset: false,
      path: 'file',
      error_type: {failed: '失败了吧!'},
      title: '图片上传',
      headers: {
        token: '1222223333333333333'
      }
      //其它
    }
  },
  methods: {
    do_open_dialog() {
      this.$refs.upload.open()
    },
    do_success(file, error) {
      if (file.response.code === 1) {
        error()
      }
    }
  }
}
</script>
```
