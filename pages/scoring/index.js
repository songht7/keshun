// pages/scoring/index.js
import graceChecker from "../../common/graceChecker.js";
var base64  = require('../../common/base64.js');
// const app = getApp();
// const util = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    H5link: "http://tms.keshun.com.cn:8099/src/views/Evaluate/OrderEvaluate.html?key=",
    orderCode: ""
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
    // console.log(e.detail);
    let formData = e.detail;
    if (formData.orderCode) {
      let H5link = that.data.H5link;
      let random = parseInt(Math.random() * (99 - 10 + 1) + 10, 10);
      let key = formData.orderCode + random;
      key = parseInt(key)
      console.log("key:", key)
      let b64Key = base64.encode(key);
      console.log("b64Key:", b64Key)
      H5link = H5link + b64Key;
      console.log("H5link:", H5link)
      that.setData({
        orderCode: formData.orderCode,
        H5link
      });
    } else {
      that.setData({
        error: "交货单号不能为空"
      });
    }
  },
  binderror(e) {
    const that = this;
    that.setData({
      error: "页面加载失败"
    });
  }
})