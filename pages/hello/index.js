//index.js
//获取应用实例
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    silde: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    console.log("globalData:", app.globalData);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    let data = {
      "inter": "slideShow",
      "parm": "?id=1"
    }
    data["fun"] = function (res) {
      console.log(res);
      that.setData({
        silde: res.list
      })
    }
    util.getData(data)
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  xxx(){
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
  },
  submitForm() {
      this.selectComponent('#form').validate((valid, errors) => {
          console.log('valid', valid, errors)
          if (!valid) {
              const firstError = Object.keys(errors)
              if (firstError.length) {
                  this.setData({
                      error: errors[firstError[0]].message
                  })

              }
          } else {
              wx.showToast({
                  title: '校验通过'
              })
          }
      })
      // this.selectComponent('#form').validateField('mobile', (valid, errors) => {
      //     console.log('valid', valid, errors)
      // })
  }
})