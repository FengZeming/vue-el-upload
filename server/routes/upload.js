/*
 * @Author: liu
 * @LastEditTime: 2020-07-27 11:26:05
 * @FilePath: \vue-el-upload\server\routes\upload.js
 * @version: Do not edit
 * @Description: 文件描述
 */

var express = require('express')
var router = express.Router()
var uploadDao = require('../dao/uploadDao.js')
router.post('/', function(req, res, next) {
  uploadDao.upload(req, res, next)
})

module.exports = router
