// pages/carrier/order-list/index.js
const app = getApp();
const util = app.globalData;

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
    list: [],
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
    // const list = that.data.list;
    // const orderCode = options.code;
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
    const that = this;
    that.getList()
    that.getCarrier();
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
    console.log("onPullDownRefresh");
    const parm = that.data.parm;
    parm['page'] = 1;
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
    var params = Object.keys(_parm).map(function (key) {
      return key + "=" + _parm[key];
    }).join("&");
    let data = {
      "inter": "orderList",
      "parm": "?" + params
    }
    wx.showLoading({
      title: '加载中',
    })
    data["fun"] = function (res) {
      console.log(res);
      wx.hideLoading()
      wx.stopPullDownRefresh()
      if (res.status >= 1) {
        var _list = res.data;
        let count = res.count;
        _list = _list.map((obj, k) => {
          if (obj.PlanDeliveryDate) {
            obj['PlanDeliveryDate'] = obj.PlanDeliveryDate.split(" ")[0]
          }
          return obj
        })
        if (type == 'more') {
          that.setData({
            list: [...that.data.list, ..._list],
            count
          });
        } else {
          that.setData({
            list: _list,
            count
          });
        }
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
        carrierCount: res.count
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
      url: '/pages/carrier/order-list-detail/index?id=' + e.detail,
    })
  }
})