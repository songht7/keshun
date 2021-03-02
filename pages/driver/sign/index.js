// pages/driver/sign/index.js
const app = getApp();
const util = app.globalData;
var base64 = require('../../../common/base64.js');
import graceChecker from "../../../common/graceChecker.js";
import QRCode from "../../../common/qrcode.js";
var qrcode = ""
Page({
  /**
   * 页面的初始数据
   */
  data: {
    qrCode: {
      QRCodeImg: "",
      QRSize: 240
    },
    location: {},
    signStatus: 1, //页面状态 0:未签到 1:已签到
    signInfo: 0, //接口返回 0:签到失败 1:签到成功
    wait: 20,
    myNO: 18,
    groupShow: false,
    groupList: [],
    groupData: {
      id: "",
      value: ""
    },
    field: {
      id: 'Id',
      val: 'WarehouseAddress'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.getGroup(); //获取仓库
    that.getLocation();
    that.QRCode();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // let date = util.formatTime(new Date());
    // date = date + ' / ' + Date.now();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
  QRCode(val) {
    const that = this;
    qrcode = new QRCode('qrcode-canvas', {
      // usingIn: this,
      text: val || "CKS 科顺",
      image: '/static/logo-2.png',
      padding: 5,
      width: that.data.qrCode['QRSize'],
      height: that.data.qrCode['QRSize'],
      colorDark: "#333",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
      callback: (res) => {
        // 生成二维码的临时文件
        console.log("生成二维码:")
        // that.data.qrCode['QRCodeImg'] = res.path;
      }
    });
  },
  getLocation() {
    const that = this;
    // console.log("util.config.locationType:", util.config.locationType)
    util.checkLocation(); //检查小程序是否开启定位服务
    wx.getLocation({
      type: util.config.locationType,
      success(res) {
        console.log("getLocation:", res);
        that.setData({
          location: res
        });
      },
      fail() {
        that.setData({
          error: "定位失败！请检查网络、GPS是否正常"
        });
      }
    })
  },
  getGroup() {
    const that = this;
    let openid = util.userInfo.openid ? util.userInfo.openid : '';
    // openid = base64.decode(openid);
    let data = {
      "inter": "signWHGroup",
      "method": "POST",
      "data": {
        WeChatID: openid,
        PhoneNumber: util.userInfo.loginInfo.PhoneNumber
      }
    }
    data["fun"] = function (res) {
      console.log("getGroup:", res);
      if (res.status > 0) {
        that.setData({
          groupList: res.data
        });
      }
    }
    util.getData(data)
  },
  signInfo(groupId) {
    const that = this;
    let data = {
      "inter": "signInfo",
      "method": "POST",
      "data": {
        PhoneNumber: util.userInfo.loginInfo.PhoneNumber,
        WHGroupId: groupId || that.data.groupData.id, //仓库组合ID
      }
    }
    data["fun"] = function (res) {
      // console.log("signInfo:::signInfo:::", res);
      if (res.status > 0) {
        that.tapHandler(res.data.Id);
        that.setData({
          signInfo: 1,
          signStatus: 1,
          signData: res.data
        });
      } else {
        that.setData({
          error: res.msg
        });
        that.setData({
          signInfo: 0,
          signStatus: 0
        });
      }
    }
    util.getData(data)
  },
  mySign() {
    const that = this;
    // let t = that.data.signStatus;
    // t++;
    // that.setData({
    //   signStatus: t
    // });
    const location = that.data.location;
    if (that.data.groupData.id == '') {
      that.setData({
        error: "请填选择仓库"
      });
      return false
    }
    if (location.latitude == '' || location.longitude == '') {
      that.setData({
        error: "定位失败！请返回重试"
      });
      return false
    }
    let openid = util.userInfo.openid ? util.userInfo.openid : '';
    // openid = base64.decode(openid);
    let data = {
      "inter": "sign",
      "method": "POST",
      "data": {
        PhoneNumber: util.userInfo.loginInfo.PhoneNumber,
        WeChatID: openid,
        WHGroupId: that.data.groupData.id, //仓库组合ID
        Latitude: location.latitude,
        Longitude: location.longitude
      }
    }
    data["fun"] = function (res) {
      console.log("mySignMySign:", res);
      if (res.status > 0) {
        that.tapHandler(res.data.Id);
        that.setData({
          signInfo: 1,
          signStatus: 1,
          signData: res.data
        });
        wx.showToast({
          title: "签到成功！",
          duration: 1500,
          mask: true
        });
      } else {
        that.setData({
          error: "签到失败，请重试" //res.msg
        });
      }
    }
    util.getData(data)
  },
  confirmHandler: function (e) {
    var value = e.detail.value
    qrcode.makeCode(value)
  },
  inputHandler: function (e) {
    var value = e.detail.value
    this.setData({
      text: value
    })
  },
  tapHandler: function (txt) {
    // console.log(txt);
    // 传入字符串生成qrcode
    qrcode.makeCode(txt)
  },
  // 长按保存
  save: function () {
    console.log('save')
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          qrcode.exportImage(function (path) {
            wx.saveImageToPhotosAlbum({
              filePath: path,
            })
          })
        }
      }
    })
  },
  toSign(e) { //页面点击仓库后
    const that = this;
    wx.navigateTo({
      url: '/pages/driver/sign-detail/index?id=' + e.currentTarget.dataset.id,
    })
  },
  pickerGroup(e) { //下拉点击仓库后
    const that = this;
    const data = e.detail;
    that.setData({
      groupData: {
        id: parseInt(data.id),
        value: data.val
      },
      groupShow: false
    })
    that.signInfo(parseInt(data.id));
  },
  groupShow(parm) { ///选择仓库
    this.setData({
      groupShow: !this.data.groupShow
    })
  },
  maskClose(e) {
    const that = this;
    const data = e.detail;
    that.setData({
      groupShow: false
    })
  },
})