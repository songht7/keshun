import common from "./common.js"
const ctx = common.Interface

const funs = {
  config: {
    ...ctx
  },
  getData: parm => {
    let _parm = parm.parm || '';
    let _url = ctx.apiurl + ctx.addr[parm.inter] + _parm
    var result = [];
    wx.request({
      url: _url,
      data: parm.data || {},
      method: parm.method || "GET",
      header: parm.header || {},
      success(res) {
        console.log("getData-success-", parm.inter, "：", res)
        //console.log(res)
        if (res.data.success) {
          result = res.data.data
        }
      },
      fail(err) {
        console.log("getData-err-", parm.inter, "：", err)
        result = {
          "success": false,
          "msg": "接口请求失败",
          "err": err
        }
      },
      complete() {
        if (parm.fun) {
          new parm.fun(result)
        }
      }
    })
  },
  getLocation: parm => {
    var result = {};
    wx.getLocation({
      type: parm.type || 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        result = res;
      },
      fail(err) {
        result = {
          "success": false,
          "msg": "定位失败",
          "err": err
        };
      },
      complete() {
        if (parm.fun) {
          new parm.fun(result)
        }
      }
    })
  },
  stopLocation: parm => {
    wx.stopLocationUpdate({
      success(res) {
        console.log('stopLocation:', res);
      },
      fail(err) {},
      complete() {}
    })
    const _locationChangeFn = function (res) {
      console.log('location change', res)
    }
    wx.offLocationChange(_locationChangeFn)
  },
  uploadFile: parm => {
    wx.uploadFile({
      url: "http://localhost:8080/upload/upload",
      filePath: parm.imgPath,
      name: "upload_file",
      // 请求携带的额外form data
      /*formData: {
        "id": id
      },*/
      header: {
        'Content-Type': "multipart/form-data"
      },
      success: function (res) {
        wx.showToast({
          title: "图像上传成功！",
          duration: 1500,
          mask: true
        });
      },
      fail: function (res) {
        wx.showToast({
          title: "上传失败，请检查网络或稍后重试。",
          icon: "none",
          duration: 1500,
          mask: true
        });
      }
    })
  },
  logout: parm => {
    wx.removeStorage({
      key: 'usrInfo',
      success() {
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
    })
  },
  formatTime: (date, mark) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    if (mark) {
      return year + '年' + month + '月' + day + '日' + ' ' + hour + '点' + minute + '分'
    } else {
      //return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
      return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
    }
  },
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
module.exports = {
  ...funs
};