// pages/driver/order-into-detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderCode: "",
    list: [{
      id: 1,
      order: "ks0020020090093231",
      numb: "1000件",
      weight: "2吨",
      address: "上海中心大厦",
      name: "曹操",
      phone: "13918181818",
      deliver: "广州",
      estimate: "2020年10月30日"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const list = that.data.list;
    const orderCode = options.code;
    list.map(obj => {
      obj['checkBtn'] = true;
    });
    that.setData({
      list
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

  },
  orderCardSubmit(e) {
    console.log("子组件返回值ID：", e.detail);
  }
})