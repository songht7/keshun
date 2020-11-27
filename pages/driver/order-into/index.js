// pages/driver/order-into/index.js
import graceChecker from "../../../common/graceChecker.js";
// const app = getApp();
// const util = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  seachCode(e) {
    const that = this;
    console.log(e.detail);
    let formData = e.detail;
    if (formData.orderCode) {
      wx.navigateTo({
        url: '/pages/driver/order-into-detail/index?code=' + formData.orderCode,
      })
    } else {
      that.setData({
        error: "交货单号不能为空"
      });
    }
  }
})