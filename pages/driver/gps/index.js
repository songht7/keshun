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
    timer: null,
    _location: {},
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
    const data = {
      fun: function (res) {
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
      }
    };
    wx.startLocationUpdateBackground({
      success() {
        wx.onLocationChange((loc) => {
          const date = util.formatTime(new Date(), '年月日');
          console.log("onLocationChange:", date, loc)
          that.data._location = {
            ...loc,
            time: Date.now(),
            date: date
          }
        })
      },
      fail(e) {
        console.log(e)
      }
    })
    clearInterval(that.data.timer)
    that.data.timer = setInterval(() => {
      console.log("setInterval:", that.data._location);
      /// 异常点返回
      if (!that.data._location.latitude && !that.data._location.latitude) {
        return false;
      }
      ///////////////////////////////////////////////
      let lct = {
        "address": that.data._location.time + " / " + that.data._location.latitude + '——' + that.data._location.longitude,
        "date": that.data._location.date,
        "submitStatus": "success"
      }
      that.setData({
        locationList: [lct, ...that.data.locationList]
      });
      ////////////////////////////////////////////////
      /// 速度大于1才记录
      if (!(that.data._location.speed > 0)) {
        return false;
      }
    }, 10000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
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
    // clearInterval(interval);
    console.log("onUnload");
    util.stopLocation();
    clearInterval(this.data.timer)
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

  }
})