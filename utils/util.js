import common from "./common.js"
const ctx = common.Interface

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const getData = parm => {
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
}
module.exports = {
  formatTime,
  getData
}