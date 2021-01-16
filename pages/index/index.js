// pages/index/index.js
const app = getApp();
const util = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    user: util.userInfo || {},
    typeT: false,
    buttons: [{
        type: 'default',
        className: '',
        text: '辅助操作',
        value: 0
      },
      {
        type: 'primary',
        className: '',
        text: '主操作',
        value: 1
      }
    ],
    silde: [],
    switchType: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    this.setData({
      imgurl: util.config.imgurl
    });
    that.getData({
      inter: '',
      method: "POST"
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log('onReady', util.userInfo)
    const that = this;
    this.setData({
      user: util.userInfo,
      siteType: util.config.siteType
    });
    if (util.userInfo.loginInfo && util.userInfo.loginInfo.PostId) {
      util.subscribeMessage();
    }
    // if (util.userInfo.loginInfo && util.userInfo.loginInfo.PostId) {
    //   util.subscribeMessage();
    //   that.getData({
    //     inter: "notice",
    //     parm: "?page=1&limit=5"
    //   });
    // } else {
    //   that.setData({
    //     silde: [{
    //       TitleImage: '/static/default/cks1.jpg'
    //     }, {
    //       TitleImage: '/static/default/cks2.jpg'
    //     }]
    //   });
    // }
    that.setData({
      silde: [{
        TitleImage: '/static/default/cks1.jpg'
      }, {
        TitleImage: '/static/default/cks2.jpg'
      }]
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
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
  getData(parm) {
    const that = this;
    if (!parm.inter) {
      return false
    }
    let data = {
      "inter": parm.inter,
      "method": parm.method ? parm.method : "GET",
      "parm": parm.parm ? parm.parm : ""
    }
    data["fun"] = function (res) {
      console.log(res);
      if (res.status > 0) {
        switch (parm.inter) {
          case 'notice':
            that.setData({
              silde: res.data
            });
            break;

          default:
            break;
        }
      }
    }
    util.getData(data)
  },
  reSetDialog() {
    /* 取消订阅消息框 */
    wx.getStorage({
      key: 'usrInfo',
      success(res) {
        if (res.data && !res.data.subscribe) {
          const _data = res.data;
          _data["subscribe"] = true;
          wx.setStorage({
            key: 'usrInfo',
            data: _data
          })
        }
      }
    })
  },
  /**
   *组件事件
   * **/
  parTap(e) {
    console.log(e.detail)
  },
  openTypeT: function () {
    this.setData({
      typeT: true
    })
  },
  closeDialog() {
    this.setData({
      typeT: false
    })
    this.reSetDialog()
  },
  buttontap(e) {
    console.log(e.detail)
  },
  logout() {
    wx.showModal({
      title: '确认登出？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          util.logout()
        } else if (res.cancel) {}
      }
    });
  }
})