// pages/carrier/driver/index.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parm: {
      page: 1,
      limit: 15,
      CarrierId: "",
      DriverName: "",
      DriverLicense: "",
      ContactPhone: ""
    },
    list: [],
    count: 0,
    field: {
      id: "Id",
      title: "CarrierDesc",
      name: "DriverName",
      subTitle: "ContactPhone"
    },
    addBtn: {
      name: "添加",
      url: "/pages/carrier/driver-detail/index"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
    that.getList();
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
    const that = this;
    const parm = that.data.parm;
    parm['page'] == 1;
    that.getList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that = this;
    const parm = that.data.parm;
    if (that.data.list.length >= that.data.count) {
      return
    }
    parm['page']++;
    that.getList('more');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getList(type) {
    const that = this;
    const _parm = that.data.parm;
    let data = {
      "inter": "driverList",
      "parm": "?page=" + _parm.page + "&limit=" + _parm.limit + "&CarrierId=" + _parm.CarrierId + "&DriverName=" + _parm.DriverName + "&DriverLicense=" + _parm.DriverLicense + "&ContactPhone=" + _parm.ContactPhone
    }
    data["fun"] = function (res) {
      console.log(res);
      wx.hideLoading()
      if (type == 'more') {
        const _list = res.data;
        that.setData({
          list: [...that.data.list, ..._list],
          count: res.count
        });
      } else {
        that.setData({
          list: res.data,
          count: res.count
        });
      }
    }
    util.getData(data)
  },
  search(e) {
    const that = this;
    const keyword = e.detail;
    console.log("onSearchkeyword:", keyword);
    const parm = that.data.parm;
    parm['DriverName'] = keyword;
    parm['page'] = 1;
    that.getList();
  },
  onTap(e) {
    const that = this;
    // const _id = e.detail;
    console.log(e.detail);
    const temp = that.data.list.filter((obj, key) => {
      if (key == e.detail.index && obj.Id == e.detail.id) {
        return obj
      }
    });
    util.tempData = temp[0];
    wx.navigateTo({
      url: '/pages/carrier/driver-detail/index?id=' + e.detail.id,
    })
  }
})