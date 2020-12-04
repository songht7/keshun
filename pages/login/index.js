// pages/sign/sign.js
import graceChecker from "../../common/graceChecker.js";
const app = getApp();
const util = app.globalData;
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
    util.checkUser();
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
    if (that.data.btnLoading) {
      return
    }
    var rule = [{
      name: "phone",
      checkType: "phoneno",
      checkRule: "",
      errorMsg: "请填写正确的手机号"
    }];
    let _formData = {
      "phone": that.data.phone
    };
    var checkRes = graceChecker.check(_formData, rule);
    if (checkRes) {
      let data = {
        "inter": "getVerify",
        "parm": "?phone=" + _formData['phone'],
        // "method": "POST",
        // "data": {
        //   phone: _formData['phone']
        // }
      }
      data["fun"] = function (res) {
        console.log(res);
        wx.showToast({
          title: '验证码已发送',
          icon: 'success',
          duration: 2000
        })
        if (res.status > 0) {
          that.setData({
            tempPhone: _formData['phone'],
            msgCode: res.msg
          });
        } else {
          if (util.config.siteType == 'dev') {
            that.setData({
              tempPhone: _formData['phone'],
              msgCode: '123' //*****测试用****
            });
          }
          that.setData({
            error: res.msg
          });
        }
      }
      util.getData(data)
      that.setData({
        btnLoading: true
      });
      //that.data.seconds = 10;
      var countdown = setInterval(() => {
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
          clearInterval(countdown)
          return
        }
        that.setData({
          getCodeTxt: `${that.data.seconds} 秒后重试`
        });
      }, 1000)
    } else {
      that.setData({
        error: graceChecker.error
      });
    }
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
    var checkRes = graceChecker.check(_formData, rule);
    if (checkRes) {
      let data = {
        "inter": "register",
        "method": "POST",
        "data": {
          UserName: _formData['phone'],
          // WeChatOpenId: util.userInfo.openid,
          HeadPortrait: util.userInfo.avatarUrl,
          Nickname: util.userInfo.nickName,
          WeChatID: util.userInfo.openid,
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
    console.log(e);
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
    console.log("getUserInfo:", e)
    wx.showLoading({
      title: '授权中...',
    })
    // 登录
    wx.login({
      success: res => {
        console.log("wx.login:", res)
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
          let _data = {
            ...e.detail.userInfo,
            ...res.data
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