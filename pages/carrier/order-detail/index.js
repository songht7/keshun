// pages/carrier/order-detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    subKey: '',
    map: {
      latitude: 31.233501,
      longitude: 121.505406,
      scale: 14,
      markers: [{
        latitude: 31.233501,
        longitude: 121.505406,
        iconPath: '/static/icon-car.png',
        width: 25,
        height: 25
        // name: 'T.I.T 创意园'
      }]
    },
    order: [{
      id: 1,
      order: "ks0020020090093231",
      numb: "1000件",
      weight: "2吨",
      address: "上海中心大厦",
      name: "曹操",
      phone: "13918181818",
      deliver: "广州",
      estimate: "2020年10月30日"
    }],
    list: [{
      date: "10-13",
      time: "08:00",
      title: "已签收",
      subtitle: "快递已签收 签收人：曹操",
      pic: "/static/goods-2.png",
      status: 2
    }, {
      date: "10-12",
      time: "08:00",
      title: "",
      subtitle: "快递已到达广州",
      pic: "",
      status: 0
    }, {
      date: "10-11",
      time: "08:00",
      title: "",
      subtitle: "快递已离开上海",
      pic: "",
      status: 0
    }, {
      date: "10-10",
      time: "08:00",
      title: "已发货",
      subtitle: "快递已发货",
      pic: "",
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