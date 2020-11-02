// pages/sign/sign.js
const app = getApp()
const util = require('../../utils/util.js')
import graceChecker from "../../common/graceChecker.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkUser: false,
    inputFocus: false,
    btnLoading: false,
    seconds: 60,
    getCodeTxt: "获取短信验证码",
    phone: "",
    code: "",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // that.setUserInfo(res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              // if (this.userInfoReadyCallback) {
              //   this.userInfoReadyCallback(res)
              // }
            }
          })
        }
      }
    })
    wx.getStorage({
      key: 'usrInfo',
      success(res) {
        if (res.data && res.data.id) {
          that.setData({
            checkUser: true
          });
          wx.redirectTo({
            url: '/pages/index/index',
          })
          console.log(res.data);
        }
      },
      fail() {
        that.setData({
          checkUser: false
        });
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
      that.setData({
        btnLoading: true
      });
      wx.showToast({
        title: '验证码已发送',
        icon: 'success',
        duration: 2000
      })
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
      // wx.showToast({
      //   title: graceChecker.error,
      //   // image: '/static/tip.png',
      //   icon: 'none',
      //   duration: 2000
      // })
    }
  },
  formSubmit(e) {
    const that = this;
    console.log(e.detail.value);
    let _formData = e.detail.value;
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
    var checkRes = graceChecker.check(_formData, rule);
    if (checkRes) {
      const tst = _formData['phone'].substring(_formData['phone'].length - 1);
      wx.setStorage({
        key: 'usrInfo',
        data: {
          id: tst, //测试 测试 测试 测试 测试 
          subscribe: false
        },
        success() {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }
      })
    } else {
      that.setData({
        error: graceChecker.error
      });
      // wx.showToast({
      //   title: graceChecker.error,
      //   // image: '/static/tip.png',
      //   icon: 'none',
      //   duration: 2000
      // })
    }
  },
  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
  },
  onFocus(e) {
    console.log(e);
    this.setData({
      inputFocus: e.currentTarget.dataset.type
    });
  },
  onBlur(e) {
    this.setData({
      inputFocus: false
    });
  },
  getUserInfo(e) {
    console.log("getUserInfo:", e)
    this.setUserInfo(e.detail.userInfo);
    // 登录
    wx.login({
      success: res => {
        console.log("wx.login:", res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let data = {
          "inter": "getOpenId",
          "parm": "?code=" + res.code
        }
        data["fun"] = function (res) {
          console.log(res);
        }
        util.getData(data)
      }
    })
  },
  setUserInfo(data) {
    this.setData({
      userInfo: data,
      hasUserInfo: true
    })
  }
})