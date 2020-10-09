//app.js
App({
  onLaunch: function () {
    console.log('App onLaunch')
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

  },
  onShow: function () {
    //console.log('App Show')
  },
  globalData: {
    userInfo: null
  }
})