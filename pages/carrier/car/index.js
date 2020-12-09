// pages/carrier/car/index.js
const app = getApp();
const util = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parm: {
      page: 1,
      limit: 15,
      CarrierId: "",
      NumberPlate: "",
      DrivingIicense: "",
      InsuranceCertificateNumber: "",
      remark: ""
    },
    carrier: {
      CarrierId: "",
      CarrierDesc: ""
    },
    carrierList: [],
    carrierShow: false,
    list: [],
    count: 0,
    field: {
      id: "Id",
      name: "NumberPlate"
    },
    addBtn: {
      name: "添加",
      url: "/pages/carrier/car-detail/index"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
    const parm = that.data.parm;
    parm['page'] = 1;
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
  getList(type) {
    const that = this;
    const _parm = that.data.parm;
    var params = Object.keys(_parm).map(function (key) {
      return key + "=" + _parm[key];
    }).join("&");
    let data = {
      "inter": "carList",
      "parm": "?" + params
    }
    wx.showLoading({
      title: '加载中',
    })
    data["fun"] = function (res) {
      console.log(res);
      wx.hideLoading()
      wx.stopPullDownRefresh()
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
  search(e) {
    const that = this;
    const keyword = e.detail;
    console.log("onSearchkeyword:", keyword);
    const parm = that.data.parm;
    parm['NumberPlate'] = keyword;
    parm['page'] = 1;
    that.getList();
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
      url: '/pages/carrier/car-detail/index?id=' + e.detail.id,
    })
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
})