// pages/driver/my-order/index.js
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
}, {
  id: 3,
  order: "ks0020020090093233",
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
      Type: ""
    },
    carrier: {
      CarrierId: "",
      CarrierDesc: ""
    },
    carrierList: [],
    carrierShow: false,
    list: [],
    count: 0,
    checkedAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
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
    const that = this;
    const parm = that.data.parm;
    parm['page'] == 1;
    that.getList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom");
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
  filterSubmit() {
    const that = this;
    const parm = that.data.parm;
    parm['page'] = 1;
    console.log(parm);
    that.getList();
    const FilterBox = this.selectComponent('#FilterBox');
    FilterBox.closeFilter()
  },
  checkAll(e) {
    console.log(e.detail.value);
    const that = this;
    const list = that.data.list;
    const ck = e.detail.value[0];
    list.map((obj) => {
      obj.checked = ck == 'all' ? true : false
    });
    that.setData({
      list
    });
  },
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail)
    const that = this;
    const list = that.data.list;
    const values = e.detail;
    for (let i = 0, lenI = list.length; i < lenI; ++i) {
      list[i].checked = false;
      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (list[i]["Id"].toString() === values[j].toString()) {
          list[i].checked = true
          break
        }
      }
    };
    that.setData({
      checkedAll: false
    });
  },
  onSubmit() {
    const that = this;
    const list = that.data.list;
    const cks = [];
    list.map((obj, key) => {
      if (obj.checked) {
        cks.push(obj.Id)
      }
    });
    console.log(cks);
    setTimeout(() => {
      const fL = list.filter((obj, key) => {
        if (!cks.includes(obj['Id'])) {
          console.log(obj)
          return obj
        }
      });
      that.setData({
        list: fL
      });
    }, 1000);
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
  getList(type) {
    const that = this;
    const _parm = that.data.parm;
    let data = {
      "inter": "orderList",
      "parm": "?page=" + _parm.page + "&limit=" + _parm.limit
    }
    wx.showLoading({
      title: '加载中',
    })
    data["fun"] = function (res) {
      console.log(res);
      wx.hideLoading()
      if (res.status > 0) {
        const _list = res.data;
        /** 设置列表可选择 **/
        _list.map(obj => {
          obj['PlanDeliveryDate'] = obj.PlanDeliveryDate.split(" ")[0];
          obj['checked'] = false;
          obj['hasCheck'] = true;
        });
        console.log(_list)
        /** /设置列表可选择 **/
        if (type == 'more') {
          that.setData({
            list: [...that.data.list, ..._list]
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
})