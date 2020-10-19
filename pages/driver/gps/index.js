// pages/driver/gps/index.js
const util = require('../../../utils/util.js');
// 引入SDK核心类
// var QQMapWX = require('xxx/qqmap-wx.js');
var interval = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: {},
    date: "",
    locationList: [{
      "address": "广东省佛山市顺德区容桂街道红旗中路38号",
      "date": "2020 年 9 月 20日 14 点 56 分",
      "submitStatus": "success"
    }, {
      "address": "广东省佛山市顺德区容桂街道红旗中路38号",
      "date": "2020 年 9 月 20日 14 点 56 分",
      "submitStatus": "fale"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    // // 实例化腾讯地图API核心类
    // qqmapsdk = new QQMapWX({
    //   key: '开发密钥（key）' // 必填
    // });
    that.setLocation();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
    interval = setInterval(() => {
      that.setLocation()
    }, 10000);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(interval);
    const _locationChangeFn = function (res) {
      console.log('location change', res)
    }
    wx.offLocationChange(_locationChangeFn)
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
  setLocation() {
    const that = this;
    const date = util.formatTime(new Date(), '年月日');
    console.log(date);
    const data = {
      type: 'gcj02',
      fun: function (res) {
        console.log(res);
        // that.setData({
        //   location: res
        // });
        let lct = {
          "address": res.latitude + '-' + res.longitude,
          "date": date,
          "submitStatus": "success"
        }
        that.setData({
          locationList: [lct, ...that.data.locationList]
        });
        //  //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        //  qqmapsdk.reverseGeocoder({
        //   location: {
        //     latitude: res.latitude,
        //     longitude: res.longitude
        //   },
        //   success: function (addressRes) {
        //     var address = addressRes.result.formatted_addresses.recommend;
        //     that.setData({
        //       console.log(address)
        //     })
        //   }
        // })
        console.log(lct)
      }
    };
    util.getLocation(data);
  }
})