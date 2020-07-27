<template>
  <div>
    <el-dialog class="m-uploads-dialog"
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="close_on_click_modal"
      width="650px"
      append-to-body
      @open="do_open_callback">
      <div class="m-uploads">
        <!-- 头部按钮1 s-->
        <header class="m-uploads-header">
          <!-- 选择文件按钮 -->
          <ul class="_header_box">
            <li>
              <file-upload class="_btn"
                ref="upload"
                :name="name"
                :size="size"
                :maximum="maximum"
                :multiple="multiple"
                v-model="rule_form.files"
                :accept="accept"
                :extensions="extensions"
                :headers="headers"
                :path="path"
                @input-filter="do_files_filter"
                @input-file="do_select_file"
                :post-action="postAction">
                <i class="el-icon-plus"></i>
                选择文件
              </file-upload>
              <!-- 上传按钮 -->
              <el-button class="_ml20"
                type="success"
                icon="el-icon-upload2"
                size="mini"
                v-if="!$refs.upload || !$refs.upload.active"
                :disabled="cp_upload_btn_disabled"
                @click.prevent="$refs.upload.active = true">开始上传
              </el-button>
              <!-- 停止按钮 -->
              <el-button class="_ml20"
                type="danger"
                icon="el-icon-remove"
                size="mini"
                v-else
                @click.prevent="$refs.upload.active = false">停止上传
              </el-button>
            </li>
            <li>
              <span class="_hint">允许上传文件数：</span><strong class="_success_num">{{ cp_success_num }}</strong><strong>/</strong><strong class="_maximun">{{ maximum }}</strong>
            </li>
          </ul>
        </header>
        <!-- 头部按钮 e -->

        <!-- 上传文件列表s -->
        <el-form :model="rule_form"
          :rules="rule_form.rules"
          ref="rule_form">
          <el-table class="m-uploads-table"
            style="width:100%"
            :height="cp_height"
            :data="rule_form.files">
            <el-table-column prop="thumb"
              width="80"
              label="文件类型"
              align="center">
              <template slot-scope="{row}">
                <span v-if="row.thumb"
                  class="_type"
                  :style="{
                    background: 'url(' + row.thumb + ') no-repeat  top/cover'
                  }" />
                <span v-else>未知</span>
              </template>
            </el-table-column>
            <el-table-column prop="name"
              label="文件名称"
              header-align="center"
              show-overflow-tooltip>
              <template slot-scope="{row, $index}">
                <!-- {{ row.name }} -->
                <span v-if="row.status !== 'edit'">{{ row.name }}</span>
                <el-form-item :prop="'files.' + $index + '.name'"
                  :rules="rule_form.rules.name">
                  <el-input v-model="row.name"
                    size="mini"
                    v-if="row.status === 'edit'"
                    placeholder="请输入文件名"></el-input>
                </el-form-item>
                <el-progress v-if="row.active || row.progress !== '0.00'"
                  :text-inside="true"
                  :stroke-width="17"
                  :percentage="row.progress * 1"></el-progress>
                <ul class="_file_info_box"
                  v-if="row.status !== 'edit'">
                  <li>
                    <span v-if="row.active || row.progress !== '0.00'">{{
                        (row.size * (row.progress / 100)) | formatSize
                      }}
                      / </span>{{ row.size | formatSize }}
                  </li>
                  <li v-if="row.active || row.progress !== '0.00'">
                    {{ row.speed | formatSize }} / 秒
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column prop="speed"
              label="状态"
              align="center"
              width="100">
              <template slot-scope="{row}">
                <span v-if="row.error"
                  class="_error">{{
                  row.error | formatError
                }}</span>
                <span v-else-if="row.success"
                  class="_success">成功</span>
                <span v-else-if="row.active"
                  class="_warning">上传中</span>
                <span v-else>未上传</span>
              </template>
            </el-table-column>
            <el-table-column prop="address"
              label="操作"
              align="center"
              width="100">
              <template slot-scope="{row}">
                <!-- {{row.status}} -->

                <ul class="_action_box">
                  <li v-if="row.status === 'edit'">
                    <el-button type="text"
                      @click.prevent="do_file_save_name(row)">保存
                    </el-button>
                  </li>
                  <li v-if="row.status === 'init'">
                    <el-button type="text"
                      @click.prevent="do_file_edit_name(row)">修改
                    </el-button>
                  </li>

                  <li v-if="row.status == 'error' || row.status == 'stop'">
                    <el-button type="text"
                      @click.prevent="
                        $refs.upload.update(row, {
                          active: true,
                          error: '',
                          progress: '0.00',
                          status: 'active'
                        })
                      ">重传
                    </el-button>
                  </li>
                  <li v-if="
                      ['init', 'error', 'stop', 'edit'].includes(row.status)
                    ">
                    <el-button type="text"
                      @click.prevent="$refs.upload.remove(row)">删除
                    </el-button>
                  </li>

                  <li v-if="row.success">
                    <a class="_download_btn"
                      :href="row | formatResponse"
                      :download="row.name"
                      target="_blank">下载</a>
                  </li>
                </ul>
              </template>
            </el-table-column>
          </el-table>
        </el-form>

        <ul slot="footer"
          class="_dialog-footer">
          <li>允许上传文件类型：【 {{ extensions.join('，') }} 】</li>
          <li>
            <el-button type="primary"
              size="medium"
              @click="dialogVisible = false">关闭</el-button>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
.m-uploads-dialog .dialog-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.m-uploads-dialog /deep/ .el-dialog__body {
  padding-top: 10px;
  padding-bottom: 20px;
}

.m-uploads-table /deep/ .el-form-item {
  margin: 0;
}

.m-uploads-table /deep/ td {
  padding: 2px 0;
}
.m-uploads-dialog ._file_info_box {
  display: flex;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  margin: 0;
}

.m-uploads-dialog ._action_box {
  list-style: none;
  padding: 0;
  display: flex;
}
.m-uploads-dialog ._action_box > li {
  flex: 1;
}

.m-uploads-dialog ._action_box /deep/ .el-button {
  padding: 0;
}

.m-uploads-dialog ._error {
  color: #f56c6c;
}

.m-uploads-dialog ._success {
  color: #67c23a;
}

.m-uploads-dialog ._warning {
  color: #e6a23c;
}
.m-uploads-dialog ._download_btn {
  color: #409eff;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  position: relative;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
}

.m-uploads-dialog ._type {
  display: inline-block;
  width: 50px;
  height: 50px;
  margin-top: 5px;
}

.m-uploads-dialog ._dialog-footer {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 0 0;
}

.m-uploads-header {
  margin-bottom: 0px;
}
.m-uploads-header ._header_box {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.m-uploads-header ._hint {
  margin-right: 20px;
}

.m-uploads-header ._success_num {
  font-size: 16px;
  margin-right: 14px;
  color: #67c23a;
}

.m-uploads-header ._maximun {
  font-size: 16px;
  margin-left: 14px;
}

.m-uploads-header ._btn {
  line-height: 1;
  white-space: nowrap;

  cursor: pointer;
  border: 1px solid #409eff;
  background-color: #409eff;
  color: #fff;
  -webkit-appearance: none;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  /* // padding: 12px 20px;
    // font-size: 14px;
    // border-radius: 4px; */
  /* //small */
  padding: 7px 15px;
  font-size: 12px;
  border-radius: 3px;

  overflow: visible;
}
.m-uploads-header ._btn /deep/ label {
  cursor: pointer;
}

.m-uploads-header ._btn ._btn:focus,
.m-uploads-header ._btn ._btn:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}

.m-uploads-header ._btn ._btn.is-active,
.m-uploads-header ._btn ._btn:active {
  background: #3a8ee6;
  border-color: #3a8ee6;
  color: #fff;
}

._ml20 {
  margin-left: 20px;
}
</style>

<script>
import {
  getAccept,
  getType,
  get_error_type,
  set_error_type,
  get_path
} from './file_type'
import FileUpload from 'vue-upload-component'

import ImageCompressor from '@xkeshi/image-compressor'

// TODO: 操作中的修改 删除 功能 完成
// TODO: 显示最大上传数 完成

export default {
  name: 'VueElUpload',
  components: {
    FileUpload
  },

  props: {
    /**
     *input 标签的 name 属性
     */
    name: {
      type: String,
      default: 'file'
    },

    /**
     *是否多选
     */

    multiple: {
      type: Boolean,
      default: true
    },
    /**
     * 请求的上传 URL
     */
    postAction: {
      type: String,
      required: true
    },
    /**
     * 列表最大文件,多选默认最多上传 10 条,单选 1 条
     */
    maximum: {
      type: Number,
      default() {
        return this.multiple ? 10 : 1
      }
    },
    /**
     * 允许上传的最大字节符 默认2M
     */
    size: {
      type: Number,
      default: 1024 * 1024 * 2 //默认2M
    },
    /**
     * 允许上传的文件后缀
     */
    extensions: {
      type: Array,
      default() {
        return ['jpg', 'jpeg', 'png']
      }
    },
    /**
     * 每次弹窗弹出列表是否清空重置
     */
    reset: {
      type: Boolean,
      default: false
    },
    /**
     * 上传失败错误提示 { failed: '导入失败' }
     */
    error_type: {
      type: Object
    },
    /**
     * 组件弹窗标题
     */
    title: {
      type: String,
      default: '上传附件'
    },
    /**
     * 下载路径 'file.path'
     */
    path: {
      type: String,
      default: 'data'
    },
    /** 
      自定义上传请求 header 数据 {'X-Token-CSRF': 'code'}
    */
    headers: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      //  extensions: ['mp4'],
      // postAction: 'dev-api/upload',
      // name: 'file',
      // multiple: true,
      //  size: 1024 * 1024 * 2000, //10m
      // maximum: 10,
      //其它
      dialogVisible: false,
      close_on_click_modal: false,
      destroy_on_close: true,
      edit_map: new Map(),
      edit_map_change_tracker: 0,
      rule_form: {
        files: [],
        rules: {
          name: [{required: true, message: '文件名称不能为空', trigger: 'blur'}]
        }
      }
    }
  },
  computed: {
    //根据上传类型获取accept
    accept() {
      return getAccept(this.extensions)
    },
    //开始上传按钮是否禁用
    cp_upload_btn_disabled() {
      // es6 map 需要通过 一个数字参数实现数据驱动
      let tracler = this.edit_map_change_tracker
      return tracler ? true : false
    },

    //已经成功上传的文件总数
    cp_success_num() {
      let a_success_files = this.rule_form.files.filter(item => {
        return item.success === true
      })
      return a_success_files.length
    },
    cp_height() {
      return this.maximum * 66 + 80 >= 500 ? 500 : this.maximum * 66 + 80
    },
    cp_response() {
      console.log(this)
    }
  },
  filters: {
    //格式换文件字节
    formatSize(size) {
      if (size > 1024 * 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
      } else if (size > 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
      } else if (size > 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + ' MB'
      } else if (size > 1024) {
        return (size / 1024).toFixed(2) + ' KB'
      }
      return size.toString() + ' B'
    },
    //格式化文件状态
    formatError(type) {
      return get_error_type(type)
    },
    formatResponse(row) {
      let path = get_path(row)
      return path
    }
  },

  mounted() {
    set_error_type(this.error_type)
  },

  methods: {
    /**
     * @description:重置上传组件方法
     * @param {type}
     * @return:
     */

    do_open_callback() {
      if (this.reset) {
        if (this.$refs.upload) {
          this.$refs.upload.clear()
        }
        this.edit_map.clear()
        this.edit_map_change_tracker = 0
      }
    },

    /**
     * @description: 获取组件名称和后缀
     * @param {type}
     * @return:
     */

    get_file_extending_Name(name) {
      var reg = /\.[^\.]+$/
      var matches = name.match(reg)
      if (matches) {
        return {name: name.substr(0, matches.index), suffix: matches[0]}
      }
      return null
    },

    /**
     * @description: 行操作-保存按钮
     * @param {type}
     * @return:
     */

    do_file_save_name(row) {
      this.$refs.rule_form.validate((valid, model) => {
        if (valid) {
          this.edit_map.delete(row.id)
          this.edit_map_change_tracker = this.edit_map.size
          row.status = 'init'
          row.name = row.name + row.suffix
        } else {
          return false
        }
      })
    },

    /**
     * @description: 行操作-修改按钮
     * @param {type}
     * @return:
     */

    do_file_edit_name(row) {
      row.status = 'edit'
      const {name, suffix} = this.get_file_extending_Name(row.name)
      row.suffix = suffix
      row.name = name
      this.edit_map.set(row.id, row)
      this.edit_map_change_tracker += 1
    },

    /**
     * @description:上传文件方法
     * @param {newFile, oldFile}
     * @return:
     */

    do_select_file(newFile, oldFile) {
      if (newFile && !oldFile) {
        // 添加文件
      }

      if (newFile && oldFile) {
        // 更新文件

        // 开始上传
        if (newFile.active !== oldFile.active) {
          console.log('Start upload', newFile.active, newFile)
          this.$refs.upload.update(newFile, {
            status: newFile.active ? 'active' : 'stop'
          })

          // 限定最小字节
          if (
            newFile.size >= 0 &&
            this.minSize > 0 &&
            newFile.size < this.minSize
          ) {
            this.$refs.upload.update(newFile, {
              error: 'size',
              status: 'error'
            })
          }
        }

        // 上传进度
        if (newFile.progress !== oldFile.progress) {
          console.log('progress', newFile.progress, newFile)
        }

        // 上传错误
        if (newFile.error !== oldFile.error) {
          if (newFile.error.length) {
            this.$refs.upload.update(newFile, {status: 'error'})
          }
          console.log('error', newFile.error, newFile)
        }

        // 上传成功
        if (newFile.success !== oldFile.success) {
          let status = true
          /**
           * 上传成功的回调函数
           * @property {objct} newFile - 上传文件的对象 <br/>
           * @property {fn}      error - 成功后通过newFile判断,设置上传失败调用此方法
           */
          this.$emit('on-success', newFile, () => {
            status = false
          })
          if (!status) {
            this.$refs.upload.update(newFile, {
              error: 'failed',
              status: 'error',
              success: false
            })
          } else {
            this.$refs.upload.update(newFile, {status: 'success'})
          }
        }
      }

      if (!newFile && oldFile) {
        // 删除文件

        // 自动删除 服务器上的文件
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/file/delete?id=' + oldFile.response.id,
          // });
        }
      }

      // 自动上传
      // if (
      //   Boolean(newFile) !== Boolean(oldFile) ||
      //   oldFile.error !== newFile.error
      // ) {
      //   if (!this.$refs.upload.active) {
      //     this.$refs.upload.active = true;
      //   }
      // }
    },

    /**
     * @description: 文件上传前过滤器
     * @param {type}
     * @return:
     */

    do_files_filter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前

        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }

        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
        //判断上传文件的类型是否正确(后缀是否匹配)
        if (!this.extensions.includes(newFile.name.split('.').pop())) {
          return prevent()
        }

        // Automatic compression
        // 自动压缩
        if (
          newFile.file &&
          newFile.type.substr(0, 6) === 'image/' &&
          this.autoCompress > 0 &&
          this.autoCompress < newFile.size
        ) {
          newFile.error = 'compressing'

          const imageCompressor = new ImageCompressor(null, {
            convertSize: Infinity,
            maxWidth: 512,
            maxHeight: 512
          })
          imageCompressor
            .compress(newFile.file)
            .then(file => {
              this.$refs.upload.update(newFile, {
                error: '',
                file,
                size: file.size,
                type: file.type
              })
            })
            .catch(err => {
              this.$refs.upload.update(newFile, {
                error: err.message || 'compress'
              })
            })
        }
      }

      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }

        // Thumbnails
        // 缩略图
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        } else {
          newFile.thumb = getType(newFile.type)
        }
        newFile.status = 'init'
        newFile.path = this.path
      }
      //文件是否初始化
      console.log('111')
    },
    /**
     *  打开上传组件弹窗的方法
     * @public
     */
    open() {
      this.dialogVisible = true
    }
  }
}
</script>
