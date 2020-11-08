// pages/driver/gps/index.js
const app = getApp();
const util = app.globalData;
// 引入SDK核心类
var QQMapWX = require('../../../common/qqmap-wx-jssdk.min.js');
var qqmapsdk, interval = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: {},
    date: "",
    timer: null,
    _location: {},
    locationList: [],
    source: 'JK'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    // // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: util.config.mapkey // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log("getLocationgetLocationgetLocation:", res);
        const date = util.formatTime(new Date(), '年月日');
        const _location = {
          ...res,
          time: Date.now(),
          date: date
        }
        that.data._location = _location
        that.getSDKAddress(_location)
      }
    })
    wx.startLocationUpdateBackground({
      success() {
        wx.onLocationChange((loc) => {
          that.setLocation(loc);
        })
      },
      fail(e) {
        console.log(e)
      }
    })
    clearInterval(that.data.timer)
    that.data.timer = setInterval(() => {
      const _location = that.data._location;
      const date = util.formatTime(new Date(), '年月日');
      that.data._location = {
        ..._location,
        time: Date.now(),
        date: date
      }
      /// 异常点返回
      if (!_location.latitude && !_location.latitude) {
        return false;
      }
      ///////////////////////////////////////////////
      that.getSDKAddress(_location)
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
    const that = this;
    wx.getSetting({
      // withSubscriptions: true,
      success(res) {
        console.log("getSetting-success:", res.authSetting)
        if (!res.authSetting['scope.userLocation'] || !res.authSetting['scope.userLocationBackground']) {
          res.authSetting = {
            "scope.userLocationBackground": true,
            "scope.userLocation": true
          }
          wx.showModal({
            title: '请开启位置服务',
            content: '“使用小程序期间和离开后”',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    console.log("openSetting-success:", res.authSetting)
                  },
                  fail(err) {
                    console.log("openSetting-err:", err)
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
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
  setLocation(loc) {
    const that = this;
    console.log("setLocation:", that.data.timer);
    if (!that.data.timer) {
      that.getSDKAddress(that.data._location)
    }
  },
  getSDKAddress(_location) {
    const that = this;
    //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
    // console.log("getSDKAddress:", _location);
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: _location.latitude,
        longitude: _location.longitude
      },
      success: function (addressRes) {
        // console.log("address:", addressRes)
        var city = addressRes.result.address_component.city + ',' + addressRes.result.address_component.district;
        var address = addressRes.result.formatted_addresses.recommend;
        var _address = city + ',' + address;
        // var address = addressRes.result.address;
        let data = {
          "inter": "uploadPhoneGPS",
          "method": "POST",
          "data": {
            Phone: util.userInfo.loginInfo.PhoneNumber,
            Latitude: _location.latitude,
            Longitude: _location.longitude,
            Address: _address,
            Source: that.data.source
          }
        }
        data["fun"] = function (res) {
          let lct = {
            "address": _address,
            "date": that.data._location.date,
            "latitude": _location.latitude,
            "longitude": _location.longitude,
            "submitStatus": "success"
          }
          if (res.status > 0) {
            lct['submitStatus'] = "success";
            that.setData({
              locationList: [lct, ...that.data.locationList]
            });
          } else {
            lct['submitStatus'] = "fail";
          }
        }
        util.getData(data)
      },
      fail(err) {
        console.log("===qqmapsdk-err===", err);
      }
    })
  },
  iconClick(e) {
    const that = this;
    // console.log(e.detail.data);
    if (e.detail.data.status != 'success') {
      // that.getSDKAddress(e.detail.data)
    }
  }
})