// pages/carrier/car/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      id: 1,
      title: "沪A112233"
    }, {
      id: 2,
      title: "沪C223344"
    }, {
      id: 3,
      title: "苏CL666"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onTap(e) {
    const that = this;
    const _id = e.detail;
    // wx.navigateTo({
    //   url: '/pages/carrier/driver-detail/index?id=' + _id,
    // })
  }
})