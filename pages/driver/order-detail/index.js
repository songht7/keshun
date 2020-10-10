// pages/driver/order-detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    subKey: '',
    map: {
      latitude: "23.099994",
      longitude: "113.324520",
      scale: 14,
      markers: [{
        latitude: 23.099994,
        longitude: 113.324520,
        iconPath: '/static/location.png',
        // name: 'T.I.T 创意园'
      }]
    },
    list: [{
      date: "10-11",
      time: "08:00",
      title: "已签收",
      subtitle: "收件人：急急急",
      pic:"",
      status: 2
    }, {
      date: "10-11",
      time: "08:00",
      title: "",
      subtitle: "快递已离开上海",
      pic:"",
      status: 0
    }, {
      date: "10-10",
      time: "08:00",
      title: "已发货",
      subtitle: "快递已发货",
      pic:"",
      status: 1
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      code: options.code
    });
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

  }
})