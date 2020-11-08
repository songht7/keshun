// pages/driver/location/index.js
import graceChecker from "../../../common/graceChecker.js";
const app = getApp();
const util = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: {},
    date: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let date = util.formatTime(new Date());
    that.setData({
      date: date
    });
    console.log(date);
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        console.log(res);
        that.setData({
          location: res
        });
      },
      fail() {
        that.setData({
          error: "定位失败,请尝试重载界面"
        });
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
  location(e) {
    const that = this;
    console.log(e.detail);
    let formData = e.detail;
    if (formData.orderCode && that.data.location.latitude && that.data.location.longitude) {
      wx.navigateTo({
        url: '/pages/driver/location-detail/index?code=' + formData.orderCode + '&lat=' + that.data.location.latitude + '&long=' + that.data.location.longitude,
      })
    } else if (!that.data.location.latitude || !that.data.location.longitude) {
      that.setData({
        error: "请重新获取定位"
      });
    } else {
      that.setData({
        error: "交货单号不能为空"
      });
    }
  }
})