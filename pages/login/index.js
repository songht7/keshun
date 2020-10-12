// pages/sign/sign.js

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
    code: ""
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
        icon: 'none',
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
      wx.showToast({
        title: graceChecker.error,
        icon: 'none',
        duration: 2000
      })
    }
  },
  formSubmit(e) {
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
      wx.setStorage({
        key: 'usrInfo',
        data: {
          id: Math.floor(Math.random() * (3 - 1)) + 1, //测试 测试 测试 测试 测试 
          subscribe: false
        },
        success() {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }
      })
    } else {
      wx.showToast({
        title: graceChecker.error,
        icon: 'none',
        duration: 2000
      })
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
  /**用户登录**/
  getUserInfo() {
    // 登录
    wx.login({
      success: res => {
        console.log("wx.login:", res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }
})