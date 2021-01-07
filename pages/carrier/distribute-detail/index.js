// pages/carrier/distribute-detail/index.js
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
    orderCode: "",
    list: [],
    date: "/-/-/",
    today: "/-/-/",
    timeSlot: ['00:00 ~ 02:00', '02:00 ~ 04:00', '04:00 ~ 06:00', '06:00 ~ 08:00', '08:00 ~ 10:00', '10:00 ~ 12:00', '12:00 ~ 14:00', '14:00 ~ 16:00', '16:00 ~ 18:00', '18:00 ~ 20:00', '20:00 ~ 22:00', '22:00 ~ 00:00'],
    timeSlotIndex: 2,
    PlanArriveDate2: "",
    carType: "0",
    selectCar: false,
    carList: [],
    carShow: false,
    carData: {
      id: "",
      value: ""
    },
    driverList: [],
    driverShow: false,
    driverData: {
      id: "",
      value: ""
    },
    pic1: "",
    pic2: "",
    pic3: "",
    field: {
      id: 'key',
      val: 'value'
    },
    carrier: {
      CarrierId: "",
      CarrierDesc: ""
    },
    carrierList: [],
    carrierShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let d = util.formatTime(new Date());
    that.setData({
      date: d.split(" ")[0],
      today: d.split(" ")[0],
      imgurl: util.config.imgurl
    });
    if (options.id) {
      const _temp = util.tempData;
      console.log("_temp::_temp::_temp::", _temp)
      let car = {
        id: _temp.CarId || "",
        value: _temp.CarNo || ""
      };
      let dVal = _temp.DriverName + (_temp.DriverPhone ? '-' + _temp.DriverPhone : "")
      let driver = {
        id: _temp.DriverId || "",
        value: dVal
      };
      that.setData({
        id: options.id,
        list: [_temp],
        temp: _temp,
        date: _temp.PlanArriveDate1 ? _temp['PlanArriveDate1'].split(" ")[0] : d.split(" ")[0],
        PlanArriveDate2: _temp.PlanArriveDate2 ? _temp.PlanArriveDate2 : "",
        carType: _temp.FreightType ? _temp.FreightType : 0,
        carData: car,
        driverData: driver,
        pic1: _temp.EntrustImage ? _temp.EntrustImage : (_temp.FrontImage ? _temp.FrontImage : ''),
        pic2: _temp.MiddleImage || "",
        pic3: _temp.AfterImage || "",
      });
      let term = util.userInfo.loginInfo.ForwarderId ? util.userInfo.loginInfo.ForwarderId : 1;
      that.getImgs(options.id);
      that.getCarDriver('CarNo', term);
      that.getCarDriver('DriverPhone', term);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
    console.log("util.config.imgurl:::", util.config.imgurl)
    that.getCarrier();
    that.setData({
      userInfo: util.userInfo,
      userType: util.userType
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
  bindDateChange(e) { //选择装货日期
    this.setData({
      date: e.detail.value
    })
  },
  bindPickerChange(e) { //选择时间段
    this.setData({
      timeSlotIndex: e.detail.value,
      PlanArriveDate2: ""
    })
  },
  selectRadio(e) { //运输类型
    const val = e.currentTarget.dataset.val;
    this.setData({
      carType: val
    });
  },
  carShow(parm) { ///选择车辆
    // console.log('carShow', parm)
    this.setData({
      carShow: !this.data.carShow
    })
  },
  driverShow(parm) { ///选择司机
    // console.log('driverShow', parm)
    this.setData({
      driverShow: !this.data.driverShow
    })
  },
  maskClose(e) {
    const that = this;
    const data = e.detail;
    switch (data.type) {
      case 'carShow':
        that.setData({
          carShow: false
        })
        break;
      case 'carrierShow':
        that.setData({
          carrierShow: false
        })
        break;
      case 'driverShow':
        that.setData({
          driverShow: false
        })
        break;
      default:
        break;
    }
  },
  pickerSelected(parm) {
    const that = this;
    const data = parm.detail;
    switch (data.type) {
      case 'carShow':
        that.setData({
          carData: {
            id: data.id,
            value: data.val
          },
          carShow: false
        })
        break;
      case 'carrierShow':
        that.setData({
          carrier: {
            CarrierId: parseInt(data.id),
            CarrierDesc: data.val
          },
          carrierShow: false
        })
        break;
      case 'driverShow':
        that.setData({
          driverData: {
            id: data.id,
            value: data.val
          },
          driverShow: false
        })
        break;
      default:
        break;
    }
  },
  chooseImage(e) {
    const that = this
    const type = e.target.dataset.idx;
    // console.log(type);
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: 1,
      success(ress) {
        // console.log(type, ress)
        const _tempFile = ress.tempFilePaths[0];
        let data = {
          "inter": "uploadImage",
          "filePath": _tempFile
        }
        data["fun"] = function (res) {
          // console.log(res);
          if (res.status > 0) {
            switch (type.toString()) {
              case "1":
                that.setData({
                  tempImg1: _tempFile,
                  pic1: res.msg
                })
                break;
              case "2":
                that.setData({
                  tempImg2: _tempFile,
                  pic2: res.msg
                })
                break;
              case "3":
                that.setData({
                  tempImg3: _tempFile,
                  pic3: res.msg
                })
                break;
              default:
                break;
            }
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
    const type = e.target.dataset.idx;
    const url = this.data['tempImg' + type] || this.data['pic' + type];
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
    const _data = that.data;
    const order = _data.list[0];
    let _formData = {
      Id: parseInt(_data.id),
      CarId: parseInt(_data.carData['id']),
      CarNo: _data.carData['value'],
      DriverId: parseInt(_data.driverData['id']),
      DriverName: _data.driverData['value'],
      FreightType: parseInt(_data.carType),
      PlanArriveDate1: _data.date,
      PlanArriveDate2: _data.PlanArriveDate2 ? _data.PlanArriveDate2 : _data.timeSlot[_data.timeSlotIndex],
      CreateUser: _data.userInfo.loginInfo.CreateUser
    };
    var rule = [{
      name: "CarId",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请填写车辆"
    }, {
      name: "DriverId",
      checkType: "notnull",
      checkRule: "",
      errorMsg: "请填写司机"
    }];
    switch (order.ShippingTypeNo) {
      case '001': //001 自提 上传委托书
        _formData['EntrustImage'] = _data.pic1;
        let r = [{
          name: "EntrustImage",
          checkType: "notnull",
          checkRule: "",
          errorMsg: "请上传委托书"
        }]
        rule = [...rule, ...r];
        break;
      case '002': //002 公司合同物流 车头车身车尾
        _formData['FrontImage'] = _data.pic1;
        _formData['MiddleImage'] = _data.pic2;
        _formData['AfterImage'] = _data.pic3;
        let rr = [{
          name: "FrontImage",
          checkType: "notnull",
          checkRule: "",
          errorMsg: "请上传车辆车头照片"
        }, {
          name: "MiddleImage",
          checkType: "notnull",
          checkRule: "",
          errorMsg: "请上传车辆车身照片"
        }, {
          name: "AfterImage",
          checkType: "notnull",
          checkRule: "",
          errorMsg: "请上传车辆车尾照片"
        }]
        rule = [...rule, ...rr];
        break;

      default:
        break;
    }
    console.log("_formData:", _formData);
    var checkRes = graceChecker.check(_formData, rule);
    if (checkRes) {
      that.setData({
        loading: true
      });
      wx.showLoading({
        title: '正在提交',
      })
      let data = {
        "inter": "addCarAndDriver",
        "method": "POST",
        "data": _formData
      }
      data["fun"] = function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.status > 0) {
          wx.showToast({
            title: res.msg,
            icon: "success"
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 0
            })
          }, 2000)
        } else {
          that.setData({
            loading: false,
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
  getImgs(orderId) {
    const that = this;
    let data = {
      "inter": "imageList",
      "parm": "?OrderID=" + orderId
    }
    data["fun"] = function (res) {
      console.log("getImgs：：：", res);
      if (res.status > 0) {
        if (res.data.length > 0) {
          const _data = res.data[0];
          that.setData({
            pic1: _data.EntrustBookImage ? _data.EntrustBookImage : (_data.FrontImage ? _data.FrontImage : ""),
            pic2: _data.MiddleImage || "",
            pic3: _data.AfterImage || "",
          });
        }
      }
    }
    util.getData(data)
  },
  getCarDriver(type, term) {
    const that = this;
    let data = {
      "inter": "dropdownList",
      "parm": "?type=" + type + "&term=" + term
    }
    data["fun"] = function (res) {
      console.log("getCarDriver--", type, ":", res);
      switch (type) {
        case 'CarNo':
          that.setData({
            carList: res.data
          });
          break;
        case 'DriverPhone':
          that.setData({
            driverList: res.data
          });
          break;
        default:
          break;
      }
    }
    util.getData(data)
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
        carrierList: [...res.data],
        count: res.count
      });
    }
    util.getData(data)
  },
  carrierShow(parm) { ///选择承运商
    console.log('carrierShow', parm)
    this.setData({
      carrierShow: !this.data.carrierShow
    })
  },
})