// pages/sign/sign.js
const app = getApp()
const util = require('../../utils/util.js')
import graceChecker from "../../common/graceChecker.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkUser: false,
    inputFocus: false,
    btnLoading: false,
    seconds: 60,
    getCodeTxt: "获取短信验证码",
    phone: "",
    code: "",
    wxInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  Create() {
    console.log("Create")

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.showLoading({
      title: '加载中',
    });
    util.checkUser();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        if (res.data && res.data.openid) {
          that.setUserInfo(res.data)
          that.setData({
            checkUser: false
          });
        }
      },
      fail() {},
      complete() {
        wx.hideLoading()
      }
    })
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
  getCode() {
    const that = this;
    if (that.data.btnLoading) {
      return
    }
    var rule = [{
      name: "phone",
      checkType: "phoneno",
      checkRule: "",
      errorMsg: "请填写正确的手机号"
    }];
    let _formData = {
      "phone": that.data.phone
    };
    var checkRes = graceChecker.check(_formData, rule);
    if (checkRes) {
      that.setData({
        btnLoading: true
      });
      wx.showToast({
        title: '验证码已发送',
        icon: 'success',
        duration: 2000
      })
      //that.data.seconds = 10;
      var countdown = setInterval(() => {
        var s = that.data.seconds;
        s--;
        that.setData({
          seconds: s
        });
        if (that.data.seconds < 0) {
          that.setData({
            getCodeTxt: "获取短信验证码",
            seconds: 60,
            btnLoading: false
          });
          clearInterval(countdown)
          return
        }
        that.setData({
          getCodeTxt: `${that.data.seconds} 秒后重试`
        });
      }, 1000)
    } else {
      that.setData({
        error: graceChecker.error
      });
      // wx.showToast({
      //   title: graceChecker.error,
      //   // image: '/static/tip.png',
      //   icon: 'none',
      //   duration: 2000
      // })
    }
  },
  formSubmit(e) {
    const that = this;
    console.log(e.detail.value);
    let _formData = e.detail.value;
    var rule = [{
      name: "phone",
      checkType: "phoneno",
      checkRule: "",
      errorMsg: "请填写正确的手机号"
    }, {
      name: "code",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请输入验证码"
    }];
    var checkRes = graceChecker.check(_formData, rule);
    if (checkRes) {
      let data = {
        "inter": "register",
        "method": "POST",
        "data": {
          UserName: '',
          WeChatOpenId: util.userInfo.openid,
          HeadPortrait: util.userInfo.avatarUrl,
          Nickname: util.userInfo.nickName,
          WeChatID: util.userInfo.unionid,
          PhoneNumber: _formData['phone'],
          code: _formData['code']
        }
      }
      data["fun"] = function (res) {
        console.log(res);
        if (res.status > 0) {
          that.setUserInfo(res.data);
          util.setStorageUser({
            data: res.data
          });
        } else {
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
  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
  },
  onFocus(e) {
    console.log(e);
    this.setData({
      inputFocus: e.currentTarget.dataset.type
    });
  },
  onBlur(e) {
    this.setData({
      inputFocus: false
    });
  },
  getUserInfo(e) {
    const that = this;
    console.log("getUserInfo:", e)
    // 登录
    wx.login({
      success: res => {
        console.log("wx.login:", res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let data = {
          "inter": "getOpenId",
          "parm": "?code=" + res.code + '&encryptdata=' + e.detail.encryptdata + '&iv=' + e.detail.iv
        }
        data["fun"] = function (res) {
          console.log(res);
          let _data = {
            ...e.detail.userInfo,
            ...res.data
          }
          that.setUserInfo(_data);
          wx.setStorage({
            key: 'userInfo',
            data: _data,
            success() {
              util.login();
            }
          })
        }
        util.getData(data)
      }
    })
  },
  setUserInfo(data) {
    this.setData({
      wxInfo: data,
      hasUserInfo: true
    });
    util.userInfo = data;
  }
})