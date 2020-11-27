// pages/driver/customer-sign/index.js
import graceChecker from "../../../common/graceChecker.js";
const app = getApp();
const util = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receivingCode: "",
    datas: {
      Images: '',
      tempImg: '',
    },
    orderData: {},
    DeliveryCheckCode: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  chooseImage() {
    const that = this
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: 1,
      success(res) {
        console.log("chooseImage:", res);
        const _tempFile = res.tempFilePaths[0];
        let data = {
          "inter": "uploadImage",
          "filePath": _tempFile
        }
        data["fun"] = function (res) {
          console.log(res);
          if (res.status > 0) {
            let _datas = that.data.datas;
            _datas["tempImg"] = _tempFile;
            _datas["Images"] = res.msg;
            that.setData({
              ..._datas
            });
          } else {
            that.setData({
              error: res.msg
            });
          }
        }
        util.uploadFile(data)
      }
    })
  },
  previewImage(e) {
    const that = this;
    const current = e.target.dataset.src
    const url1 = that.data.datas['Images'];
    const url2 = that.data.datas['tempImg'];
    const url = url2 ? url2 : url1;
    wx.previewImage({
      current,
      urls: [url]
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
      that.getData(e.detail.orderCode);
    }
  },
  getData(val) {
    const that = this;
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
        that.setData({
          orderData: res.data,
          // DeliveryCheckCode: res.data.DeliveryCheckCode
        });
      } else {
        that.setData({
          error: "暂无获取该订单信息"
        });
      }
    }
    util.getData(data)
  },
  onSubmit(e) {
    const that = this;
    const _data = that.data;
    let _formData = {
      OrderId: _data.orderData.Id,
      Images: _data.datas.Images,
      DeliveryCheckCode: _data.DeliveryCheckCode,
      CreateUser: _data.orderData.CreateUser,
      LastUpdateUser: _data.orderData.LastUpdateUser,
    };
    console.log(_formData);
    var rule = [{
      name: "OrderId",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请查看订单号是否正确"
    }, {
      name: "Images",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请上传交货单照片"
    }];
    var checkRes = graceChecker.check(_formData, rule);
    if (checkRes) {
      _formData['Images'] = [_formData['Images']];
      let data = {
        "inter": "uploadReceipt",
        "method": "POST",
        "data": _formData
      }
      data["fun"] = function (res) {
        console.log(res);
        if (res.status > 0) {
          wx.showToast({
            title: res.msg || "提交成功",
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 0
            })
          }, 2000);
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
  }
})