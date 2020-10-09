// pages/index/index.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    silde: [],
    switchType: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.hideLoading();
    that.getMyStorage();
    that.slideShow();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
  slideShow() {
    var that = this;
    let data = {
      "inter": "slideShow",
      "parm": "?id=1"
    }
    data["fun"] = function (res) {
      console.log(res);
      that.setData({
        silde: res.list
      })
    }
    util.getData(data)
  },
  getMyStorage() {
    var that = this;
    /*****************************测试首页按钮************************************************/
    wx.getStorage({
      key: 'usrInfo',
      success(res) {
        if (res.data && res.data.id) {
          let userType = res.data.id
          that.setData({
            switchType: userType
          });
        }
      },
      fail() {},
      complete() {}
    })
    /*****************************************************************************/
  },
  /**
   *组件事件
   * **/
  parTap(e) {
    console.log(e.detail)
  }
})