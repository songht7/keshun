import common from "./common.js"
const ctx = common.Interface

const funs = {
  config: {
    ...ctx
  },
  cksToken: "",
  userInfo: {},
  userType: 0,
  tempData: {},
  getData(parm = {}) {
    const that = this;
    let _parm = parm.parm || '';
    let _url = ctx.apiurl + ctx.addr[parm.inter] + _parm
    var result = [];
    console.log("request-url:", _url)
    console.log("request-parm:", parm)
    wx.request({
      url: _url,
      data: parm.data || {},
      method: parm.method || "GET",
      header: parm.header || {
        Authorization: 'BasicAuth ' + that.cksToken
      },
      success(res) {
        console.log("getData-success-", parm.inter, "：", res)
        //console.log(res)
        if (res.data.status) {
          result = res.data
        } else {
          result = {
            "status": false,
            "msg": res.data.msg
          }
        }
      },
      fail(err) {
        console.log("getData-err-", parm.inter, "：", err)
        result = {
          "status": false,
          "msg": "接口请求失败",
          "err": err
        }
      },
      complete() {
        if (result.msg == 'token无效') {
          wx.removeStorage({
            key: 'cksToken',
            success() {},
            complete() {
              that.checkToken();
              // wx.navigateBack({delta: 1});
            }
          })
        }
        if (parm.fun) {
          new parm.fun(result)
        }
      }
    })
  },
  getLocation(parm = {}) {
    const that = this;
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
          "status": false,
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
  stopLocation(parm = {}) {
    const that = this;
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
  uploadFile(parm = {}) {
    const that = this;
    let _parm = parm.parm || '';
    let _url = ctx.apiurl + ctx.addr[parm.inter] + _parm
    console.log("uploadFile-url:", _url, parm.filePath)
    var result = [];
    wx.uploadFile({
      url: _url,
      filePath: parm.filePath,
      name: "minipro",
      formData: {
        "file": parm.filePath,
        "type": "minipro"
      },
      header: {
        'Content-Type': "multipart/form-data"
      },
      success: function (res) {
        console.log("uploadFile-success:", res);
        if (res.data.status) {
          result = res.data;
          // wx.showToast({
          //   title: "图像上传成功！",
          //   duration: 1500,
          //   mask: true
          // });
        } else {
          result = {
            "status": false,
            "msg": res.data.msg
          }
        }
      },
      fail: function (err) {
        console.log("uploadFile-fail:", err);
        result = {
          "status": false,
          "msg": "上传失败",
          "err": err
        };
        wx.showToast({
          title: "上传失败，请检查网络或稍后重试。",
          icon: "none",
          duration: 1500,
          mask: true
        });
      },
      complete() {
        if (parm.fun) {
          new parm.fun(result)
        }
      }
    })
  },
  setStorageUser(parm = {}) {
    const that = this;
    wx.getStorage({
      key: 'userInfo',
      success(ress) {
        const _userInfo = {
          ...ress.data,
          loginInfo: {
            ...parm.data
          }
        };
        wx.setStorage({
          key: 'userInfo',
          data: _userInfo,
          success() {}
        });
        that.userInfo = _userInfo;
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000,
          complete() {
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }
        })
      },
      fail() {}
    })
  },
  login(parm = {}) {
    const that = this;
    console.log("login-fun-userInfo:", that.userInfo);
    const openid = parm.openid ? parm.openid : (that.userInfo.openid ? that.userInfo.openid : '');
    if (openid == '') {
      return
    }
    let data = {
      "inter": "login",
      "method": "POST",
      "data": {
        WeChatID: openid
      }
    }
    data["fun"] = function (res) {
      console.log("app-login-res:", res);
      if (res.status > 0) {
        that.setStorageUser({
          data: res.data
        });
      }
    }
    that.getData(data)
  },
  logout(parm = {}) {
    const that = this;
    wx.removeStorage({
      key: 'userInfo',
      success() {
        that.userInfo = {};
        that.userType = 0;
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
    })
  },
  checkToken(parm = {}) {
    const that = this;
    var setToken = function () {
      let data = {
        "inter": "getToken"
      }
      data["fun"] = function (res) {
        if (res.status && res.data.token) {
          var deadline = that.setDeadline();
          wx.setStorage({
            key: 'cksToken',
            data: {
              token: res.data.token,
              deadline: deadline
            },
            success() {
              that.cksToken = res.data.token;
              console.log("-----setStorage-token-success-----")
            }
          })
        }
      }
      that.getData(data)
    }
    wx.getStorage({
      key: 'cksToken',
      success(res) {
        let cksToken = res.data;
        that.cksToken = res.data.token;
        let timestamp = Math.round(new Date().getTime() / 1000);
        if (!cksToken.deadline || timestamp >= cksToken.deadline) {
          console.log("-----reSetCksToken-----")
          setToken()
        }
      },
      fail() {
        setToken()
      }
    })
  },
  checkUser(parm = {}) {
    const that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        // that.userInfo = res.data;
        that.userInfo = res.data;
        let logined = res.data.loginInfo;
        if (logined) {
          that.userType = logined.PostId;
        }
        if (!logined) {
          that.login();
        }
      },
      fail() {
        console.log("checkUser-fail")
        that.login();
      },
      complete() {
        console.log("checkUser", that.userInfo)
      }
    })
  },
  setDeadline(parm = {}) {
    const that = this;
    var x = that.formatTime(new Date())
    var time = new Date(x);
    var timeNum = ctx.deadline; //小时数
    time.setHours(time.getHours() + timeNum);
    var deadline = Math.round(new Date(that.formatTime(time)).getTime() / 1000);
    return deadline
  },
  formatTime(date, mark) {
    const that = this;
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