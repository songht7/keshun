// pages/carrier/car-detail/index.js
const util = require('../../../utils/util.js')
import graceChecker from "../../../common/graceChecker.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    id: "",
    datas: {
      Images: ''
    },
    carrier: {
      CarrierId: "",
      CarrierDesc: ""
    },
    carrierList: [],
    carrierShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if (options.id) {
      console.log("detail-id:", options.id);
      console.log("util.tempData:", util.tempData);
      that.setData({
        id: options.id,
        datas: util.tempData,
        carrier: {
          CarrierId: util.tempData.CarrierId,
          CarrierDesc: util.tempData.CarrierDesc
        },
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
    that.getCarrier();
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
  getCarrier() {
    const that = this;
    let data = {
      "inter": "dropdownList",
      "parm": "?type=CarrierNo"
    }
    data["fun"] = function (res) {
      // console.log(res);
      that.setData({
        carrierList: res.data,
        count: res.count
      });
    }
    util.getData(data)
  },
  bindInput(e) {
    const name = e.currentTarget.dataset.name;
    const _datas = this.data.datas;
    _datas[name] = e.detail.value;
    this.setData({
      datas: _datas
    });
  },
  chooseImage(e) {
    const that = this
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: 1,
      success(res) {
        let _datas = that.data.datas;
        _datas["Images"] = res.tempFilePaths[0];
        that.setData({
          ..._datas
        });
      }
    })
  },
  previewImage(e) {
    const that = this;
    const current = e.target.dataset.src
    const url = that.data.datas['Images'];
    wx.previewImage({
      current,
      urls: [url]
    })
  },
  formSubmit(e) {
    const that = this;
    const loading = that.data.loading;
    if (loading) {
      return false;
    }
    let _formData = e.detail.value;
    const Id = that.data.id;
    _formData["Images"] = that.data.datas.Images;
    _formData = {
      Id,
      ...that.data.carrier,
      ..._formData
    }
    // let _formData = this.data.datas;
    console.log(_formData);
    var rule = [{
      name: "CarrierId",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请选择承运商"
    }, {
      name: "NumberPlate",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请填写车牌号"
    }, {
      name: "DrivingIicense",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请填写行驶证"
    }, {
      name: "InsuranceCertificateNumber",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请填写保险证明单号"
    }, {
      name: "Images",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请上传车辆图片"
    }];
    var checkRes = graceChecker.check(_formData, rule);
    if (checkRes) {
      console.log("graceChecker---true");
      that.setData({
        loading: true
      });
      let data = {
        "inter": Id ? "carUpdate" : "carAdd",
        "method": "POST",
        "data": _formData
      }
      data["fun"] = function (res) {
        console.log(res);
        if (res.status > 0) {
          wx.showToast({
            title: Id ? "编辑成功！" : "添加成功！",
            icon: "success"
          })
        } else {
          that.setData({
            error: res.msg
          });
        }
        that.setData({
          loading: false
        });
      }
      util.getData(data)
    } else {
      that.setData({
        error: graceChecker.error
      });
    }
  },
  delete(e) {
    const that = this;
    // const _id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定删除该车牌？',
      content: '车牌号：' + that.data.datas.NumberPlate,
      success(res) {
        if (res.confirm) {
          let data = {
            "inter": "carDelete",
            "method": "POST",
            "data": {
              Id: that.data.id
            }
          }
          data["fun"] = function (res) {
            console.log(res);
            if (res.status) {
              wx.showToast({
                title: "删除成功！",
                icon: "success",
                complete() {
                  wx.redirectTo({
                    url: '/pages/carrier/car/index'
                  })

                }
              })
            } else {
              that.setData({
                error: res.msg
              });
            }
          }
          util.getData(data)
        } else if (res.cancel) {}
      }
    })
  },
  carrierShow(parm) { ///选择承运商
    console.log('carrierShow', parm)
    this.setData({
      carrierShow: !this.data.carrierShow
    })
  },
  pickerSelected(parm) {
    const that = this;
    const data = parm.detail;
    that.setData({
      carrier: {
        CarrierId: parseInt(data.id),
        CarrierDesc: data.val
      },
      carrierShow: false
    })
  },
  maskClose(e) {
    const that = this;
    const data = e.detail;
    that.setData({
      carrierShow: false
    })
  },
})