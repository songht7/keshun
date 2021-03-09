// pages/sign/sign.js
import graceChecker from "../../common/graceChecker.js";
var base64 = require('../../common/base64.js');
const app = getApp();
const util = app.globalData;
var countdown = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginAuto: false, //授权后是否自动登录
    checkUser: false,
    inputFocus: false,
    btnLoading: false,
    seconds: 60,
    getCodeTxt: "获取短信验证码",
    phone: "",
    code: "",
    msgCode: "",
    myCode: "Ss12321",
    tempPhone: "",
    wxInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    siteType: ""
  },
  Create() {
    console.log("Create")

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.showLoading({
      title: '加载中',
    });
    that.setData({
      siteType: util.config.siteType
    });
    if (util.config.siteType != 'dev') {
      that.setData({
        loginAuto: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        if (res.data && res.data.openid) {
          that.setUserInfo(res.data)
          that.setData({
            checkUser: false
          });
        }
      },
      fail() {},
      complete() {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    util.checkUser();
    wx.getStorage({
      key: 'msgCountDown',
      success(res) {
        if (res.data) {
          let cd = res.data.countDown;
          that.setData({
            phone: res.data.phone
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    const that = this;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getCode() {
    const that = this;
    let _formData = {
      "phone": that.data.phone
    };
    if (that.data.btnLoading) {
      return
    }
    
    wx.getStorage({
      key: 'msgCountDown',
      success(res) {
        if (res.data) {
          let cd = res.data.countDown;
          let p = res.data.phone;
          let d = new Date(util.formatTime(new Date())).getTime() / 1000;
          // console.log(parseInt(cd), d, p, _formData['phone'].toString());
          if (parseInt(cd) >= d && p == _formData['phone'].toString()) {
            that.setData({
              error: "该手机号获取短信过于频繁"
            });
          } else {
            that.setCode(_formData)
          }
        }
      },
      fail() {
        that.setCode(_formData)
      }
    })
  },
  setCode(formData) {
    const that = this;
    let _formData = formData;
    var rule = [{
      name: "phone",
      checkType: "phoneno2",
      checkRule: "",
      errorMsg: "请填写正确的手机号"
    }];
    var checkRes = graceChecker.check(_formData, rule);
    if (checkRes) {
      let data = {
        "inter": "getVerify",
        "parm": "?phone=" + parseInt(_formData['phone']),
        // "method": "POST",
        // "data": {
        //   phone: _formData['phone']
        // }
      }
      data["fun"] = function (res) {
        // console.log(res);
        if (res.status > 0) {
          wx.showToast({
            title: '验证码已发送',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            tempPhone: _formData['phone'],
            msgCode: res.msg
          });
        } else {
          if (util.config.siteType == 'dev') {
            that.setData({
              tempPhone: _formData['phone'],
              msgCode: '123', //*****测试用****
              seconds: 60, //*****dev短信发送失败计时10s****
            });
          }
          that.setData({
            error: res.msg || '短信发送失败'
          });
        }
      }
      util.getData(data)
      that.setData({
        btnLoading: true
      });
      //that.data.seconds = 10;
      that.countDown();
      /* 3分钟后可再发验证码 */
      var x = util.formatTime(new Date())
      var time = new Date(x);
      time.setMinutes(time.getMinutes() + 3);
      var t = new Date(util.formatTime(time)).getTime() / 1000;
      //console.log("timeCount:", x, new Date(x).getTime() / 1000, util.formatTime(time), t);
      wx.setStorage({
        data: {
          countDown: t,
          phone: _formData['phone']
        },
        key: 'msgCountDown',
      })
      /* 3分钟后可再发验证码 */

    } else {
      that.setData({
        error: graceChecker.error
      });
    }
  },
  countDown() { //倒计时
    const that = this;
    countdown = setInterval(() => {
      var s = that.data.seconds;
      s--;
      that.setData({
        seconds: s
      });
      if (that.data.seconds < 0) {
        that.setData({
          getCodeTxt: "获取短信验证码",
          seconds: 60,
          btnLoading: false
        });
        wx.removeStorage({
          key: 'msgCountDown',
        })
        clearInterval(countdown)
        countdown = "";
        return
      }
      that.setData({
        getCodeTxt: `${that.data.seconds} 秒后重试`
      });
    }, 1000)
  },
  formSubmit(e) {
    const that = this;
    console.log(e.detail.value);
    let _formData = e.detail.value;
    const _msgCode = that.data.msgCode;
    _formData['msgCode'] = _msgCode;
    var rule = [{
      name: "phone",
      checkType: "phoneno",
      checkRule: "",
      errorMsg: "请填写正确的手机号"
    }, {
      name: "code",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请输入验证码"
    }];
    if (_formData['code'] && _formData['code'] != that.data.myCode) {
      let r = [{
        name: "code",
        checkType: "same",
        checkRule: _msgCode,
        errorMsg: "验证码有误"
      }, {
        name: "phone",
        checkType: "same",
        checkRule: that.data.tempPhone,
        errorMsg: "请重新获取验证码"
      }]
      rule = [...rule, ...r];
    }
    var checkRes = graceChecker.check(_formData, rule);
    if (checkRes) {
      let openid = util.userInfo.openid ? util.userInfo.openid : '';
      // openid = base64.decode(openid);
      let data = {
        "inter": "register",
        "method": "POST",
        "data": {
          UserName: _formData['phone'],
          // WeChatOpenId: util.userInfo.openid,
          HeadPortrait: util.userInfo.avatarUrl,
          Nickname: util.userInfo.nickName,
          WeChatID: openid,
          //PhoneNumber: _formData['phone'],
          //code: _formData['code']
        }
      }
      data["fun"] = function (res) {
        console.log(res);
        if (res.status > 0) {
          that.setData({
            code: "",
            msgCode: "",
            tempPhone: ""
          });
          that.setUserInfo(res.data);
          util.setStorageUser({
            data: res.data
          });
        } else {
          that.setData({
            error: res.msg
          });
        }
      }
      util.getData(data)
    } else {
      that.setData({
        error: graceChecker.error
      });
    }
  },
  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
  },
  onFocus(e) {
    // console.log(e);
    const that = this;
    that.setData({
      inputFocus: e.currentTarget.dataset.type
    });
  },
  onBlur(e) {
    this.setData({
      inputFocus: false
    });
  },
  onInput(e) {
    const that = this;
    if (that.data.phone.length < 11) {
      that.setData({
        code: ""
      });
    }
  },
  getUserInfo(e) {
    const that = this;
    // console.log("getUserInfo:", e)
    wx.showLoading({
      title: '授权中...',
    })
    // 登录
    wx.login({
      success: res => {
        // console.log("wx.login:", res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let data = {
          "inter": "getOpenId",
          "method": "POST",
          "data": {
            code: res.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            rawData: e.detail.rawData,
            signature: e.detail.signature
          }
        }
        // console.log(data);
        data["fun"] = function (res) {
          wx.hideLoading()
          if (res.status > 0) {
            let uData = res.data;
            // uData['openid'] = uData['openid'] ? base64.encode(uData['openid']) : null;
            // uData['unionid'] = uData['unionid'] ? base64.encode(uData['unionid']) : null;
            uData['openid'] = uData['openid'] ? uData['openid'] : null;
            uData['unionid'] = uData['unionid'] ? uData['unionid'] : null;
            let _data = {
              ...e.detail.userInfo,
              ...uData
            }
            that.setUserInfo(_data);
            wx.setStorage({
              key: 'userInfo',
              data: _data,
              success() {
                if (that.data.loginAuto) {
                  util.login(_data); //授权后自动登录
                }
              }
            })
          } else {
            that.setData({
              error: '授权失败'
            });
          }
        }
        util.getData(data)
      },
      fail() {
        that.setData({
          error: '授权失败'
        });
        wx.hideLoading()
      }
    })
  },
  setUserInfo(data) {
    // console.log("setUserInfo:", data);
    this.setData({
      wxInfo: data,
      hasUserInfo: true
    });
    util.userInfo = data;
  }
})