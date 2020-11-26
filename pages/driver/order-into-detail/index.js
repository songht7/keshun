// pages/driver/order-into-detail/index.js
const app = getApp();
const util = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dn_no: "",
    list: [],
    hasNull: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const dn_no = options.code;
    that.setData({
      dn_no
    });
    that.getData();
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
  orderCardSubmit(e) {
    console.log("子组件返回值ID：", e.detail);
  },
  getData() {
    const that = this;
    let data = {
      "inter": "getOrderByDNNO",
      "parm": "?dn_no=" + that.data.dn_no
    }
    wx.showLoading({
      title: '加载中...',
    })
    data["fun"] = function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.status > 0) {
        const list = res.data;
        list.map(obj => {
          obj['checkBtn'] = true;
        });
        that.setData({
          list
        });
      } else {
        that.setData({
          // error: res.msg,
          hasNull: true
        });
      }
    }
    util.getData(data)
  }
})