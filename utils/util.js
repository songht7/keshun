import common from "./common.js"
var base64 = require('../common/base64.js');
const ctx = common.Interface

const funs = {
  config: {
    ...ctx
  },
  cksToken: "",
  userInfo: {},
  userType: 0, //POSTID
  tempData: {},
  getData(parm = {}) {
    const that = this;
    let _parm = parm.parm || '';
    let _url = ctx.apiurl + ctx.addr[parm.inter] + _parm
    var result = [];
    // if (ctx.siteType == 'dev') {
    console.log("request-url:", _url)
    console.log("request-parm:", parm)
    // }
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
            "status": res.data.status,
            "msg": res.data.msg
          }
        }
      },
      fail(err) {
        console.log("getData-err-", parm.inter, "：", err)
        result = {
          "status": 0,
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
              wx.navigateTo({
                url: 'pages/index/index',
                success: function (res) {}
              })
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
  checkLocation() {
    //检查小程序是否开启定位服务
    wx.getSetting({
      // withSubscriptions: true,
      success(res) {
        if (ctx.siteType == 'dev') {
          console.log("checkLocation-success:", res.authSetting)
        }
        if (!res.authSetting['scope.userLocation']) {
          res.authSetting = {
            "scope.userLocation": true
          }
          wx.showModal({
            title: '请开启位置服务',
            content: '“使用小程序期间和离开后”',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    if (ctx.siteType == 'dev') {
                      console.log("openSetting-success:", res.authSetting)
                    }
                  },
                  fail(err) {
                    if (ctx.siteType == 'dev') {
                      console.log("openSetting-err:", err)
                    }
                  }
                })
              } else if (res.cancel) {
                if (ctx.siteType == 'dev') {
                  console.log('用户点击取消')
                }
              }
            }
          })
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
        'Content-Type': 'multipart/form-data' //application/json
      },
      success: function (res) {
        console.log("uploadFile-success:", res);
        let ress = JSON.parse(res.data);
        if (ress.status) {
          console.log("uploadFile-ress:", ress);
          result = ress;
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
        let _toDay = that.today();
        let _userInfo = {};
        if (parm.reLogin) {
          // console.log("relogin:::", _toDay)
          _userInfo = ress.data;
          _userInfo["loginInfo"] = {
            ...parm.data,
            loginTime: _toDay
          }
        } else {
          _userInfo = {
            ...ress.data,
            loginInfo: {
              ...parm.data,
              loginTime: _toDay
            }
          };
        }
        wx.setStorage({
          key: 'userInfo',
          data: _userInfo,
          success() {}
        });
        that.userInfo = _userInfo;
        that.userType = parm.data.PostId;
        if (!parm.reLogin) {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000,
            complete() {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }
          })
        }
      },
      fail() {}
    })
  },
  login(parm = {}) {
    const that = this;
    // console.log("login-fun-userInfo:", that.userInfo);
    let openid = parm.openid ? parm.openid : (that.userInfo.openid ? that.userInfo.openid : '');
    let unionid = parm.unionid ? parm.unionid : (that.userInfo.unionid ? that.userInfo.unionid : '');
    if (openid == '') {
      return
    }
    // openid = base64.decode(openid);
    // unionid = base64.decode(unionid);
    let data = {
      "inter": "login",
      "method": "POST",
      "data": {
        WeChatID: openid,
        UnionID: unionid
      }
    }
    data["fun"] = function (res) {
      // console.log("app-login-res:", res);
      let _reLogin = parm.reLogin ? parm.reLogin : false
      if (res.status > 0) {
        that.setStorageUser({
          data: res.data,
          reLogin: _reLogin
        });
      } else {
        if (_reLogin && res.msg == '用户不存在') {
          that.logout();
        }
        // wx.showToast({
        //   title: res.msg,//'用户不存在'
        //   icon: 'error',
        //   duration: 2000
        // })

        // if (res.msg == '用户不存在') {
        //   that.checkUser({
        //     userErr: res.msg
        //   });
        // }
      }
    }
    that.getData(data)
  },
  relogin() {
    const that = this;
    wx.getStorage({
      key: 'userInfo',
      success(ress) {
        let _toDay = that.today();
        if (ress.data.loginInfo && ress.data.loginInfo.loginTime != _toDay) {
          that.login({
            reLogin: true
          });
        }
      },
      fail() {}
    })
  },
  subscribeMessage() { //订阅消息
    const that = this;
    wx.getStorage({
      key: 'subscribeMessage',
      success(res) {
        if (!res.data) {
          that.openSubscribeMessage();
        }
      },
      fail() {
        that.openSubscribeMessage();
      }
    })
  },
  openSubscribeMessage() {
    const that = this;
    let _tmplIds = [];
    switch (that.userType) {
      case 2:
        _tmplIds = ctx.tmplIds2
        break;
      case 3:
        _tmplIds = [...ctx.tmplIds1, ...ctx.tmplIds3]
        break;
      default:
        break;
    }
    if (_tmplIds.length <= 0) {
      return false
    }
    wx.showModal({
      title: '温馨提示',
      content: '为促进服务，需要向您发送消息',
      confirmText: "同意",
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.requestSubscribeMessage({
            tmplIds: _tmplIds,
            success(res) {
              /*
               *[TEMPLATE_ID]是动态的键，即模板id，
               *'accept'表示用户同意订阅该条id对应的模板消息，
               *'reject'表示用户拒绝订阅该条id对应的模板消息，
               *'ban'表示已被后台封禁。
               */
              // console.log("subscribeMessage-success:", res);
              if (res.errMsg == 'requestSubscribeMessage:ok') {
                let ckm = _tmplIds.filter((obj, k) => res[obj] == 'reject');
                if (ckm.length > 0) {
                  that.subscribeMessage();
                } else {
                  wx.setStorage({
                    key: "subscribeMessage",
                    data: true
                  })
                }
              }
            },
            fail(err) {
              console.log("subscribeMessage-fail:", err);
            },
            complete() {
              that.getSetting();
            }
          })
        } else if (res.cancel) {}
      }
    });
  },
  getSetting() {
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        console.log("getSetting:", res)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
    })
  },
  logout(parm = {}) {
    const that = this;
    wx.removeStorage({
      key: 'userInfo',
      success() {
        that.userInfo = {};
        that.userType = 0;
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    });
    wx.removeStorage({
      key: 'subscribeMessage',
      success() {}
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
  today() {
    const that = this;
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + "/" + month + "/" + day;
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