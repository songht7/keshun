// pages/carrier/driver-detail/index.js
import graceChecker from "../../../common/graceChecker.js";
const app = getApp();
const util = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    id: "",
    datas: {},
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
  selectGender(e) {
    const val = e.currentTarget.dataset.val;
    const _datas = this.data.datas;
    _datas['gender'] = val;
    this.setData({
      datas: _datas
    });
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
  formSubmit(e) {
    const that = this;
    const loading = that.data.loading;
    if (loading) {
      return false;
    }
    let _formData = e.detail.value;
    const Id = that.data.id;
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
      name: "DriverName",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请填写司机姓名"
    }, {
      name: "DriverLicense",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请填写驾驶证"
    }, {
      name: "ContactPhone",
      checkType: "phoneno",
      checkRule: "",
      errorMsg: "请填写正确的联系电话"
    }];
    var checkRes = graceChecker.check(_formData, rule);
    if (checkRes) {
      console.log("graceChecker---true");
      that.setData({
        loading: true
      });
      let data = {
        "inter": Id ? "driverUpdate" : "driverAdd",
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
          setTimeout(() => {
            wx.navigateBack({
              delta: 0,
            })
          }, 2000)
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
      title: '确定删除该司机？',
      content: '司机：' + that.data.datas.DriverName,
      success(res) {
        if (res.confirm) {
          let data = {
            "inter": "driverDelete",
            "method": "POST",
            "data": {
              Id: parseInt(that.data.id)
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
                    url: '/pages/carrier/driver/index'
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