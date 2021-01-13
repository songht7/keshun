// pages/carrier/order/index.js
var base64 = require('../../../common/base64.js');
const app = getApp();
const util = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    item: {},
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if (options.code) {
      let _code = options.code;
      let random = parseInt(Math.random() * (99 - 10 + 1) + 10, 10);
      var kkk = _code + random;
      kkk = kkk.toString();
      let b64Key = base64.encode(kkk);
      that.setData({
        code: b64Key,
        code2: _code,
        imgurl: util.config.imgurl
      });
      that.getList()
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

  },
  getList(type) {
    const that = this;
    let data = {
      "inter": "getOrderLogisticsTrack", //getOrderLogisticsTrack getOrderByDNNO
      "parm": "?dn_no=" + that.data.code
      // "method": "POST",
      // "data": {
      //   Dn_No: that.data.code
      // }
    }
    wx.showLoading({
      title: '加载中',
    })
    data["fun"] = function (res) {
      wx.hideLoading()
      console.log(res);
      if (res.status > 0) {
        let item = res.data;
        if (item) {
          let date = item['PlanArriveDate1'] ? item['PlanArriveDate1'].split(" ") : "";
          item['Date'] = date[0] ? date[0] : "";
          item['Time'] = date[1] ? date[1] : "";
          that.setData({
            item
          });
        } else {
          item = {
            status: -1
          }
          that.setData({
            item
          });
        }
      } else {
        that.setData({
          item: res
        });
      }

    }
    util.getData(data)
  },
  showGPS() {
    wx.navigateTo({
      url: '/pages/carrier/order-detail/index?code=' + this.data.code2,
    })
  }
})