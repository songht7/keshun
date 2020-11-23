// pages/carrier/distribute-detail/index.js
const app = getApp();
const util = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    orderCode: "",
    list: [],
    date: "/-/-/",
    carrier: {
      CarrierId: "",
      CarrierDesc: ""
    },
    carrierList: [],
    carrierShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let d = util.formatTime(new Date());
    that.setData({
      date: d.split(" ")[0]
    });
    if (options.id) {
      that.setData({
        list: [util.tempData],
        id: options.id
      });
      that.getCarrier();
    }
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
  getCarrier() {
    const that = this;
    let data = {
      "inter": "dropdownList",
      "parm": "?type=CarrierNo"
    }
    data["fun"] = function (res) {
      // console.log(res);
      that.setData({
        carrierList: [...res.data],
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
  formSubmit(e) {
    const that = this;
    console.log(e.detail.value);
    let _formData = e.detail.value;
    const _data = that.data;
    if (_data.carrier.CarrierId == '') {
      that.setData({
        error: "请选择承运商"
      });
    } else {
      let data = {
        "inter": "updateForwarder",
        "method": "POST",
        "data": {
          Id: parseInt(_data.id),
          ForwarderId: _data.carrier.CarrierId,
          ForwarderDesc: _data.carrier.CarrierDesc,
        }
      }
      wx.showLoading({
        title: '加载中',
      })
      data["fun"] = function (res) {
        console.log(res);
        wx.hideLoading()
        if (res.status > 0) {
          wx.showToast({
            title: '修改成功',
          })
        } else {
          that.setData({
            error: res.msg
          });
        }
      }
      util.getData(data)
    }
  }
})