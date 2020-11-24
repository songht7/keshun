// pages/carrier/distribute/index.js
const app = getApp();
const util = app.globalData;

const list = [{
  id: 1,
  order: "ks0020020090093231",
  numb: "1000件",
  weight: "2吨",
  address: "上海中心大厦",
  name: "曹操",
  phone: "13918181818",
  deliver: "广州",
  estimate: "2020年10月30日"
}, {
  id: 2,
  order: "ks0020020090093232",
  numb: "1000件",
  weight: "2吨",
  address: "上海中心大厦",
  name: "曹操",
  phone: "13918181818",
  deliver: "广州",
  estimate: "2020年10月30日"
}]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderCode: "",
    parm: {
      page: 1,
      limit: 15,
      ForwarderNo: "",
      OrderNo: "",
      DN_No: "",
      OrderType: "",
      FreightPayType: "",
      SaleGroupName: "",
      CustomerNo: "",
      CustomerName: "",
      FactoryNo: "",
      WareHouseNo: "",
      ArrivalAddress: "",
      Status: "", //状态: 0.待处理 1.已派车 2.已签到 3.已入场 4.已出厂 5.已跟踪 6.已回单 7.已结单
      Type: "手动分配"
    },
    carrier: {
      CarrierId: "",
      CarrierDesc: ""
    },
    carrierList: [],
    carrierShow: false,
    list: list,
    count: 0,
    addBtn: {
      name: "添加",
      url: "/pages/carrier/distribute-detail/index"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const list = that.data.list;
    const orderCode = options.code;
    that.getList()
    that.getCarrier();
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
    const _parm = that.data.parm;
    let data = {
      "inter": "orderList",
      "parm": "?page=" + _parm.page + "&limit=" + _parm.limit + "&ForwarderNo=" + _parm.ForwarderNo + "&OrderNo=" + _parm.OrderNo + "&DN_No=" + _parm.DN_No + "&OrderType=" + _parm.OrderType + "&FreightPayType=" + _parm.FreightPayType + "&SaleGroupName=" + _parm.SaleGroupName + "&CustomerNo=" + _parm.CustomerNo + "&FactoryNo=" + _parm.FactoryNo + "&WareHouseNo=" + _parm.WareHouseNo + "&ArrivalAddress=" + _parm.ArrivalAddress + "&Status=" + _parm.Status + "&Type=" + _parm.Type
    }
    wx.showLoading({
      title: '加载中',
    })
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
  getCarrier() {
    const that = this;
    let data = {
      "inter": "dropdownList",
      "parm": "?type=CarrierNo"
    }
    data["fun"] = function (res) {
      // console.log(res);
      that.setData({
        carrierList: [{
          key: 999999,
          value: "全部"
        }, ...res.data],
        count: res.count
      });
    }
    util.getData(data)
  },
  carrierShow(parm) { ///选择承运商
    console.log('carrierShow', parm)
    this.setData({
      carrierShow: !this.data.carrierShow
    })
  },
  pickerSelected(e) {
    const that = this;
    const data = e.detail;
    let parm = that.data.parm;
    parm['CarrierId'] = parseInt(data.id) != 999999 ? parseInt(data.id) : '';
    that.setData({
      carrier: {
        CarrierId: parseInt(data.id),
        CarrierDesc: data.val
      },
      carrierShow: false
    })
  },
  maskClose(e) {
    const that = this;
    const data = e.detail;
    that.setData({
      carrierShow: false
    })
  },
  navDetail(e) {
    console.log("子组件返回值ID：", e.detail);
    const that = this;
    const temp = that.data.list.filter((obj, key) => {
      if (obj.Id == e.detail) {
        return obj
      }
    });
    util.tempData = temp[0];
    wx.navigateTo({
      url: '/pages/carrier/distribute-detail/index?id=' + e.detail,
    })
  }
})