// pages/driver/location-detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    status: "上传成功！",
    latitude: "",
    longitude: "",
    locationList: [{
      "address": "广东省佛山市顺德区容桂街道红旗中路38号",
      "date": "2020 年 9 月 20日 14 点 56 分",
      // "submitStatus": "success"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const code = options.code || "";
    const lat = options.lat;
    const long = options.long;
    console.log(code, lat, long);
    if (code) {
      that.setData({
        latitude: lat,
        longitude: long,
        code: options.code
      });
    }
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