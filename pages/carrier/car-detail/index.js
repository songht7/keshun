// pages/carrier/car-detail/index.js
import graceChecker from "../../../common/graceChecker.js";
const app = getApp();
const util = app.globalData;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: util.userInfo,
    userType: util.userType,
    loading: false,
    id: "",
    datas: {
      Images: '',
      tempImg: '',
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
    console.log("imgurl::", util.config.imgurl)
    that.setData({
      userInfo: util.userInfo,
      userType: util.userType,
      imgurl: util.config.imgurl
    });
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
      let cList = res.data;
      that.setData({
        carrierList: cList,
        count: res.count
      });
      if (that.data.userType == 1) { //物流干事 承运商id：1 自提 
        let userType1 = cList.filter(obj => obj.key == "1");
        // console.log("userType1:", userType1);
        that.setData({
          carrier: {
            CarrierId: parseInt(userType1[0].key),
            CarrierDesc: userType1[0].value
          }
        });
      }
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
    const url = url2 ? url2 : (that.data.imgurl + url1);
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
    const Id = parseInt(that.data.id);
    _formData["Images"] = that.data.datas.Images;
    _formData = {
      Id,
      ...that.data.carrier,
      ..._formData
    }
    // let _formData = this.data.datas;
    console.log(_formData);
    var rule = [{
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
      errorMsg: "请上传行驶证图片"
    }];
    if (that.data.userType != 2) {
      let r = [{
        name: "CarrierId",
        checkType: "notnull",
        checkRule: "",
        errorMsg: "请选择承运商"
      }]
      rule = [...r, ...rule];
    }
    if (that.data.userType == 2) {
      const user = that.data.userInfo.loginInfo;
      _formData["CarrierId"] = user.ForwarderId;
      _formData["CarrierDesc"] = user.ForwarderName;
    }
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