// pages/driver/location-detail/index.js
const app = getApp();
const util = app.globalData;
var QQMapWX = require('../../../common/qqmap-wx-jssdk.min.js');
var qqmapsdk, interval = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    code: "",
    statusVal: "",
    status: 0,
    latitude: "",
    longitude: "",
    address: "",
    source: "JK",
    locationList: [{
      "address": "",
      "date": ""
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const code = options.code || "";
    const lat = options.lat;
    const long = options.long;
    if (code) {
      that.setData({
        latitude: lat,
        longitude: long,
        code: code
      });
      qqmapsdk = new QQMapWX({
        key: util.config.mapkey // 必填
      });
      that.getSDKAddress()
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
  getData() {
    const that = this;
    const _data = that.data;
    let data = {
      "inter": "uploadOrderGPS",
      "method": "POST",
      "data": {
        Dn_No: _data.code,
        Longitude: _data.longitude,
        Latitude: _data.latitude,
        Address: _data.address,
        Source: _data.source
      }
    }
    wx.showLoading({
      title: '加载中',
    })
    data["fun"] = function (res) {
      wx.hideLoading()
      that.setData({
        loading: false
      });
      if (res.status > 0) {
        that.setData({
          status: 1,
          statusVal: "上传成功！"
        });
      } else {
        that.setData({
          status: 0,
          statusVal: "上传失败！"
        });
      }

    }
    util.getData(data)
  },
  getSDKAddress() {
    const that = this;
    const date = util.formatTime(new Date(), '年月日');
    //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: that.data.latitude,
        longitude: that.data.longitude
      },
      success: function (addressRes) {
        // console.log("address:", addressRes)
        var city = addressRes.result.address_component.city + ',' + addressRes.result.address_component.district;
        var address = addressRes.result.formatted_addresses.recommend;
        // var address = addressRes.result.address;
        const _locationList = [{
          "address": city + ',' + address,
          "date": date
        }]
        that.setData({
          address: city + ',' + address,
          locationList: _locationList
        });
        that.getData();
      },
      fail(err) {
        console.log("===qqmapsdk-err===", err);
      }
    })
  }
})