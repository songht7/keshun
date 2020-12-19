// pages/driver/customer-sign/index.js
import graceChecker from "../../../common/graceChecker.js";
const app = getApp();
const util = app.globalData;
var QQMapWX = require('../../../common/qqmap-wx-jssdk.min.js');
var qqmapsdk, interval = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    receivingCode: "",
    DN_No: "",
    ISSendDCCode: 0, //0无收货码 1有收货码
    DeliveryCheckCode: "", //详细返回的收货码
    Status: 0, //6,7不能提交
    datas: {
      Images: [],
      tempImg: [],
    },
    imgCount: 0,
    orderData: {},
    source: "JK",
    location: {},
    locationList: [{
      "address": "",
      "date": ""
    }],
    latitude: "",
    longitude: "",
    address: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res);
        that.setData({
          location: res
        });
        that.getSDKAddress()
      },
      fail() {
        that.setData({
          error: "定位失败,请尝试重载界面"
        });
      }
    })
    qqmapsdk = new QQMapWX({
      key: util.config.mapkey // 必填
    });
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
  chooseImage(e) {
    const that = this
    console.log(e);
    let needCheck_DN_No = false; //是否效验交货单号
    if (that.data.DN_No == '' && needCheck_DN_No) {
      that.setData({
        error: "请先扫描交货单号"
      });
    } else {
      let key = e.currentTarget.dataset.idx;
      wx.chooseImage({
        sourceType: ['camera', 'album'],
        sizeType: ['compressed', 'original'],
        count: 1,
        success(res) {
          console.log("chooseImage:", res);
          const _tempFile = res.tempFilePaths[0];
          wx.showLoading({
            title: '上传中...',
          })
          let data = {
            "inter": "uploadImageForReceiptInMinipro",
            "filePath": _tempFile
          }
          data["fun"] = function (res) {
            console.log(res);
            wx.hideLoading()
            if (res.status > 0) {
              let qrCode = res.data.qrCode;
              let DN_No = that.data.DN_No;
              if (needCheck_DN_No) {
                if (qrCode && DN_No == qrCode) {
                  let _datas = that.data.datas;
                  _datas["tempImg"] = [..._datas["tempImg"], _tempFile];
                  _datas["Images"] = [..._datas["Images"], res.data.imgUrl];
                  that.setData({
                    ..._datas
                  });
                } else {
                  that.setData({
                    error: "请重新上传清晰二维码图"
                  });
                }
              } else {
                let _datas = that.data.datas;
                _datas["tempImg"] = [..._datas["tempImg"], _tempFile];
                _datas["Images"] = [..._datas["Images"], res.data.imgUrl];
                that.setData({
                  ..._datas
                });
              }
            } else {
              that.setData({
                error: res.msg
              });
            }
          }
          util.uploadFile(data)
        }
      })
    }
  },
  previewImage(e) {
    const that = this;
    const current = e.target.dataset.src
    const url1 = that.data.datas['Images'];
    const url2 = that.data.datas['tempImg'];
    const url = url2 ? url2 : url1;
    wx.previewImage({
      current,
      urls: url
    })
  },
  delImage(e) {
    console.log(e);
    const that = this;
    that.setData({
      imageList: []
    })
  },
  setCode(e) {
    const that = this;
    // console.log("setCode::setCode:", e.detail.orderCode);
    if (e.detail.orderCode) {
      that.setData({
        DN_No: e.detail.orderCode
      });
      that.getData(e.detail.orderCode);
    }
  },
  getData(val) {
    const that = this;
    const SCode = this.selectComponent('#SCode');
    let data = {
      "inter": "getOrderByDNNO",
      "parm": "?dn_no=" + val
    }
    wx.showLoading({
      title: '加载中...',
    })
    data["fun"] = function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.status > 0 && res.data) {
        let _Status = res.data.Status;
        if (_Status == 6 || _Status == 7) {
          SCode.reCode()
          that.setData({
            DN_No: "",
            error: "该订单已提交过"
          });
        } else {
          that.setData({
            orderData: res.data,
            ISSendDCCode: res.data.ISSendDCCode,
            Status: _Status,
            DeliveryCheckCode: res.data.DeliveryCheckCode
          });
        }
      } else {
        SCode.reCode()
        that.setData({
          DN_No: "",
          error: "暂无获取该订单信息"
        });
      }
    }
    util.getData(data)
  },
  onSubmit(e) {
    const that = this;
    if (that.data.loading) {
      return false
    }
    const _data = that.data;
    let _formData = {
      OrderId: _data.orderData.Id,
      Images: _data.datas.Images,
      DeliveryCheckCode: _data.DeliveryCheckCode,
      CreateUser: _data.orderData.CreateUser,
      LastUpdateUser: _data.orderData.LastUpdateUser,
    };
    // console.log(_formData);
    var rule = [{
      name: "OrderId",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请查看订单号是否正确"
    }, {
      name: "Images",
      checkType: "greater",
      checkRule: 0,
      errorMsg: "请上传交货单照片"
    }];
    if (_data.ISSendDCCode) {
      let r = [{
        name: "DeliveryCheckCode",
        checkType: "notnull",
        checkRule: "",
        errorMsg: "请填写收货码"
      }, {
        name: "DeliveryCheckCode",
        checkType: "same",
        checkRule: _data.DeliveryCheckCode,
        errorMsg: "请确认收货码"
      }]
      rule = [...rule, ...r]
    }
    var checkRes = graceChecker.check(_formData, rule);
    if (checkRes) {
      let data = {
        "inter": "uploadReceipt",
        "method": "POST",
        "data": _formData
      }
      that.setData({
        loading: true
      })
      data["fun"] = function (res) {
        console.log(res);
        if (res.status > 0) {
          that.uploadOrderGPS()
          wx.showToast({
            title: res.msg || "提交成功",
          });
        } else {
          that.setData({
            loading: false
          })
          that.setData({
            error: res.msg
          });
        }
      }
      util.getData(data)
    } else {
      that.setData({
        error: graceChecker.error
      });
    }
  },
  uploadOrderGPS() {
    const that = this;
    const _data = that.data;
    let data = {
      "inter": "uploadOrderGPS",
      "method": "POST",
      "data": {
        Dn_No: _data.DN_No,
        Longitude: _data.location.longitude,
        Latitude: _data.location.latitude,
        Address: _data.address,
        Source: _data.source
      }
    }
    // console.log("uploadOrderGPS：：：", data);
    data["fun"] = function (res) {
      setTimeout(() => {
        wx.navigateBack({
          delta: 0
        })
      }, 2000);
      if (res.status > 0) {} else {}
    }
    util.getData(data)
  },
  getSDKAddress() {
    const that = this;
    const date = util.formatTime(new Date(), '年月日');
    //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: that.data.location.latitude,
        longitude: that.data.location.longitude
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
      },
      fail(err) {
        wx.hideLoading();
        that.setData({
          error: "获取位置信息失败"
        });
        // console.log("===qqmapsdk-err===", err);
      }
    })
  }
})