// pages/carrier/distribute/index.js
const app = getApp();
const util = app.globalData;

const list = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderCode: "",
    parm: {
      page: 1, //必须, 页码
      limit: 15, //必须, 页大小
      UserId: 0,
      ForwarderId: 0, //必须, 承运商ID
      // ForwarderNo: "",
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
      ShippingTypeNo: "", //物流干事是001 承运商是002
      IsUrgent: "", //1.是 0.不是 
      Status: "", //状态: 0.未派车 1.已派车 2.已签到 3.已入厂 4.已出厂 5.已跟踪 6.已回单 7.已结单 8.已转出
      Type: "手动分配",
      FreightType: '' // 运输方式（0.专车 1.零担)
    },
    isUrgent: {
      isUrgentId: "",
      isUrgentDesc: ""
    },
    isUrgentList: [{
      key: 999999,
      value: "全部"
    }, {
      key: 0,
      value: "不是 "
    }, {
      key: 1,
      value: "是"
    }],
    isUrgentShow: false,
    orderStatus: {
      orderStatusId: "",
      orderStatusDesc: ""
    },
    orderStatusList: [{
        key: 999999,
        value: "全部"
      }, {
        key: 0,
        value: "未派车"
      }, {
        key: 1,
        value: "已派车"
      }
      // , {
      //   key: 2,
      //   value: "已签到"
      // }, {
      //   key: 3,
      //   value: "已入厂"
      // }, {
      //   key: 4,
      //   value: "已出厂"
      // }, {
      //   key: 5,
      //   value: "已跟踪"
      // }, {
      //   key: 6,
      //   value: "已回单"
      // }, {
      //   key: 7,
      //   value: "已结单"
      // }, {
      //   key: 8,
      //   value: "已转出"
      // }
    ],
    orderStatusShow: false,
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
    const orderCode = options.code;
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
    const list = that.data.list;
    const user = util.userInfo.loginInfo;
    let parm = that.data.parm;
    parm['ForwarderId'] = user.ForwarderId ? parseInt(user.ForwarderId) : 1;
    parm['UserId'] = user.Id ? parseInt(user.Id) : 0;
    if (util.userType == 2) { //7物流干事是001 2承运商是002
      parm['ShippingTypeNo'] = '002';
    } else if (util.userType == 7) {
      parm['ShippingTypeNo'] = '001';
    }
    that.setData({
      parm
    })
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
      //return encodeURIComponent(key) + "=" + encodeURIComponent(_parm[key]);
      return key + "=" + _parm[key];
    }).join("&");
    let data = {
      "inter": "orderList3",
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
        _list = _list.map((obj, k) => {
          if (obj.PlanDeliveryDate) {
            obj['PlanDeliveryDate'] = obj.PlanDeliveryDate.split(" ")[0]
          }
          return obj
        })
        if (type == 'more') {
          that.setData({
            list: [...that.data.list, ..._list],
            count: res.count
          });
        } else {
          that.setData({
            list: _list,
            count: res.count
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
  isUrgentShow(parm) { ///选择状态
    console.log('isUrgentListShow', parm)
    this.setData({
      isUrgentShow: !this.data.isUrgentShow
    })
  },
  pickerIsUrgent(e) {
    const that = this;
    const data = e.detail;
    let parm = that.data.parm;
    parm['IsUrgent'] = parseInt(data.id) != 999999 ? parseInt(data.id) : '';
    that.setData({
      isUrgent: {
        isUrgentId: parseInt(data.id),
        isUrgentDesc: data.val
      },
      isUrgentShow: false
    })
  },
  orderStatusShow(parm) { ///选择状态
    console.log('orderStatusShow', parm)
    this.setData({
      orderStatusShow: !this.data.orderStatusShow
    })
  },
  pickerOrderStatus(e) {
    const that = this;
    const data = e.detail;
    let parm = that.data.parm;
    parm['Status'] = parseInt(data.id) != 999999 ? parseInt(data.id) : '';
    that.setData({
      orderStatus: {
        orderStatusId: parseInt(data.id),
        orderStatusDesc: data.val
      },
      orderStatusShow: false
    })
  },
  maskClose(e) {
    const that = this;
    const data = e.detail;
    that.setData({
      carrierShow: false,
      isUrgentShow: false,
      orderStatusShow: false
    })
  },
  iconClick(e) {
    const name = e.currentTarget.dataset.name;
    let parm = this.data.parm;
    parm[name] = "";
    this.setData({
      parm
    });
  },
  bindInput(e) {
    const name = e.currentTarget.dataset.name;
    const _datas = this.data.parm;
    _datas[name] = e.detail.value;
    this.setData({
      parm: _datas
    });
  },
  filterSubmit() {
    const that = this;
    const parm = that.data.parm;
    parm['page'] = 1;
    console.log(parm);
    that.getList();
    const FilterBox = this.selectComponent('#FilterBox');
    FilterBox.closeFilter()
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