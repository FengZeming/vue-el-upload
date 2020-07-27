/*
 * @Author: liu
 * @LastEditTime: 2020-07-27 11:25:19
 * @FilePath: \vue-el-upload\server\dao\uploadDao.js
 * @version: Do not edit
 * @Description: 文件描述
 */

const fs = require('fs-extra')

const common = require('./common')

module.exports = {
  upload: function(req, res, next) {
    const appDir = './public/upload'
    fs.ensureDir(appDir).then(() => {
      common.upload(appDir, req).then(function([obj, textObj]) {
        console.log('文件', obj)
        res.json({
          code: 0,
          file: 'http://localhost:3000/upload/' + obj.file[0].originalFilename
        })
      })
    })
  }
}
