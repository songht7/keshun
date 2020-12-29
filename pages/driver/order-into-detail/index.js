// pages/driver/order-into-detail/index.js
import graceChecker from "../../../common/graceChecker.js";
const app = getApp();
const util = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dn_no: "",
    list: [],
    numberPlate: "", //车牌号
    hasNull: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const dn_no = options.code;
    that.setData({
      dn_no
    });
    that.getData();
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
  orderCardSubmit(e) {
    console.log("子组件返回值ID：", e.detail);
    const that = this;
    const user = util.userInfo.loginInfo;
    const list = that.data.list[0];
    const numberPlate = that.data.numberPlate;
    let _formData = {
      NumberPlate: numberPlate
    };
    var rule = [{
      name: "NumberPlate",
      checkType: "isCarLicens",
      checkRule: "",
      errorMsg: "请填写正确的车牌"
    }];
    // console.log(_formData, rule);
    var checkRes = graceChecker.check(_formData, rule);
    if (checkRes) {
      let data = {
        "inter": "deliveryOrderIn",
        "method": "POST",
        "data": {
          OrderId: e.detail,
          UserId: user.Id,
          UserMobile: user.PhoneNumber,
          CarrierId: list.ForwarderId,
          NumberPlate: numberPlate
        }
      }
      wx.showLoading({
        title: '加载中...',
      })
      data["fun"] = function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.status > 0) {
          wx.showToast({
            title: '转入成功',
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 0
            })
          }, 2000)
        } else {
          that.setData({
            error: res.msg || "转入失败"
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
  getData() {
    const that = this;
    let data = {
      "inter": "getOrderByDNNO",
      "parm": "?dn_no=" + that.data.dn_no
    }
    wx.showLoading({
      title: '加载中...',
    })
    data["fun"] = function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.status > 0 && res.data) {
        const list = [{
          ...res.data
        }];
        list.map(obj => {
          obj['checkBtn'] = true;
        });
        that.setData({
          list
        });
      } else {
        that.setData({
          // error: res.msg,
          hasNull: true
        });
      }
    }
    util.getData(data)
  }
})