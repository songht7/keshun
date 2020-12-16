// pages/carrier/order/index.js
const app = getApp();
const util = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    item: {},
    list: [],
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      code: options.code,
      imgurl: util.config.imgurl
    });
    that.getList()
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
      "inter": "orderGPS",
      "method": "POST",
      "data": {
        Dn_No: that.data.code
      }
    }
    wx.showLoading({
      title: '加载中',
    })
    data["fun"] = function (res) {
      wx.hideLoading()
      if (res.status > 0) {
        const _list = res.data;
        _list.map((obj, key) => {
          let date = obj['CreateDate'].split(" ");
          obj['Date'] = date[0];
          obj['Time'] = date[1];
        });
        that.setData({
          list: _list,
          count: _list.length
        });
      } else {
        wx.showToast({
          title: '获取订单信息失败！',
        })
      }

    }
    util.getData(data)
  },
  showGPS(){
    wx.navigateTo({
      url: '/pages/carrier/order-detail/index?code=' + this.data.code,
    })
  }
})