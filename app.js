//app.js
import util from './utils/util.js';
App({
  onLaunch: function () {
    console.log('App onLaunch')
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    this.globalData.checkToken();
    this.globalData.checkUser();
  },
  onShow: function () {
    console.log('App Show')
  },
  globalData: {
    ...util
  }
})