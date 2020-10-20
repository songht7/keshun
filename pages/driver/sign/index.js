// pages/driver/sign/index.js
const util = require('../../../utils/util.js');
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
    signStatus: 0, //0:未签到 1:已签到
    wait: 20,
    myNO: 18
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    qrcode = new QRCode('qrcode-canvas', {
      // usingIn: this,
      text: "CKS 科顺",
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let date = util.formatTime(new Date());
    date = date + ' / ' + Date.now();
    this.tapHandler(date);
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
  mySign() {
    const that = this;
    let t = that.data.signStatus;
    t++;
    that.setData({
      signStatus: t
    });
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
    console.log(txt);
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
  }
})