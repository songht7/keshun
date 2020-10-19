import common from "./common.js"
const ctx = common.Interface

const funs = {
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
  startLocation: parm => {
    var result = {};
    wx.startLocationUpdateBackground({
      // type: parm.type || 'wgs84',
      success(res) {
        // const latitude = res.latitude
        // const longitude = res.longitude
        // const speed = res.speed
        // const accuracy = res.accuracy
        // console.log("startLocationUpdateBackground:", ress);
        result = res;
        funs.getLocation(parm)
      },
      fail(err) {
        console.log("startLocationUpdateBackground---err:", err);
        result = {
          "success": false,
          "msg": "定位失败",
          "err": err
        }
      },
      complete() {}
    })
  },
  getLocation: parm => {
    const _locationChangeFn = function (res) {
      console.log('_locationChangeFn', res)
      if (parm.fun) {
        new parm.fun(res)
      }
    }
    wx.onLocationChange(_locationChangeFn)
  },
  offLocationChange: parm => {
    wx.stopLocationUpdate({
      success(res) {},
      fail(err) {},
      complete() {}
    })
    const _locationChangeFn = function (res) {
      console.log('location change', res)
    }
    wx.offLocationChange(_locationChangeFn)
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