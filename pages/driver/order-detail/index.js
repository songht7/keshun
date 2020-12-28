// pages/driver/order-detail/index.js
import graceChecker from "../../../common/graceChecker.js";
const app = getApp();
const util = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    subKey: '',
    map: {
      latitude: "", //39.906930
      longitude: "", //116.397570
      scale: 4,
      markers: []
    },
    list: [],
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      code: options.code
    });
    that.getList()
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
    let data = {
      "inter": "orderGPS",
      "method": "POST",
      "data": {
        Dn_No: that.data.code
      }
    }
    wx.showLoading({
      title: '加载中',
    })
    data["fun"] = function (res) {
      wx.hideLoading()
      if (res.status > 0) {
        const _list = res.data;
        console.log("_list_list_list:", _list)
        if (_list.length) {
          _list.map((obj, key) => {
            let date = obj['CreateDate'].split(" ");
            obj['Date'] = date[0];
            obj['Time'] = date[1];
          });
          let map = that.data.map;
          let mapLocation = _list[0];
          if (mapLocation['Latitude'] && mapLocation['Longitude']) {
            map['latitude'] = mapLocation['Latitude'];
            map['longitude'] = mapLocation['Longitude'];
            map['scale'] = 14;
            let marker = [{
              latitude: parseFloat(mapLocation['Latitude']),
              longitude: parseFloat(mapLocation['Longitude']),
              iconPath: '/static/icon-car.png',
              width: 25,
              height: 25
              // name: 'T.I.T 创意园'
            }]
            map['markers'] = [...marker];
          }
          console.log(map)
          that.setData({
            map,
            list: _list,
            count: _list.length
          });
        } else {
          that.setData({
            msg: res.msg
          });
        }
      } else {
        wx.showToast({
          title: '获取订单信息失败！',
        })
      }

    }
    util.getData(data)
  },
})