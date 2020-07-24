<!--
 * @Author: liu
 * @LastEditTime: 2020-07-24 18:06:51
 * @FilePath: \vue-el-upload\README.md
 * @version: Do not edit
 * @Description: 文件描述
-->

# vue-el-upload 组件说明

基于 elementUI
上传组件 [vue-upload-component](https://github.com/lian-yue/vue-upload-component)
编写的一个弹窗上传组件

![例子](https://i.loli.net/2020/07/24/N5BILQ8kncVJbfg.gif)

## props

| Prop name    | Type    | Default                | Required | Description                                   |
| ------------ | ------- | ---------------------- | -------- | --------------------------------------------- |
| `postAction` | string  | Required               | true     | 请求的上传 URL                                |
| `error_type` | object  |                        |          | 上传失败错误提示 \{ failed: '导入失败' \}     |
| `extensions` | array   | ['jpg', 'jpeg', 'png'] |          | 允许上传的文件后缀                            |  | `headers` | object | `{}` |  | 自定义上传请求 header 数据 \{'X-Token-CSRF': 'code'\} |
| `maximum`    | number  | this.multiple ? 10 : 1 |          | 列表最大文件,多选默认最多上传 10 条,单选 1 条 |  | `multiple` | boolean | `true` |  | 是否多选 |  |
| `name`       | string  | `file`                 |          | input 标签的 name 属性                        |  |
| `path`       | string  | `data`                 |          | 下载路径 'file.path'                          |
| `reset`      | boolean | `false`                |          | 每次弹窗弹出列表是否清空重置                  |
| `size`       | number  | `1024 * 1024 * 2`      |          | 允许上传的最大字节符 默认 2M                  |
| `title`      | string  | `上传附件`             |          | 组件弹窗标题                                  |

## Method

| Method name | Parameters | Description            |
| ----------- | ---------- | ---------------------- |
| `open()`    |            | 打开上传组件弹窗的方法 |

## Event

| Event name   | Type      | Description        |     |
| ------------ | --------- | ------------------ | --- |
| `on-success` | undefined | 上传成功的回调函数 |

## Arguments

on-success : fn
`newFile`: objct — 上传文件的对象
`error`: fn — 成功后通过 newFile 判断,设置上传失败调用此方法 |
