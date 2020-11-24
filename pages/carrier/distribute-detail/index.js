// pages/carrier/distribute-detail/index.js
const app = getApp();
const util = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    orderCode: "",
    list: [],
    date: "/-/-/",
    today: "/-/-/",
    timeSlot: ['00:00 ~ 02:00', '02:00 ~ 04:00', '04:00 ~ 06:00', '06:00 ~ 08:00', '08:00 ~ 10:00', '10:00 ~ 12:00', '12:00 ~ 14:00', '14:00 ~ 16:00', '16:00 ~ 18:00', '18:00 ~ 20:00', '20:00 ~ 22:00', '22:00 ~ 00:00'],
    timeSlotIndex: 2,
    carType: 1,
    selectCar: false,
    carList: [{
      id: 1,
      name: '沪AG1234'
    }, {
      id: 2,
      name: '沪BC4567'
    }, {
      id: 3,
      name: '沪CD7890'
    }, {
      id: 4,
      name: '沪FD7895'
    }, {
      id: 5,
      name: '沪FD7899'
    }],
    carShow: false,
    carData: {
      id: "",
      value: ""
    },
    driverList: [{
      id: 1,
      name: '曹操'
    }, {
      id: 2,
      name: '刘备'
    }, {
      id: 3,
      name: '孙权'
    }],
    driverShow: false,
    driverData: {
      id: "",
      value: ""
    },
    pic1: [],
    pic2: [],
    pic3: [],
    field: {
      id: 'id',
      val: 'name'
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
      today: d.split(" ")[0]
    });
    if (options.id) {
      that.setData({
        list: [util.tempData],
        id: options.id
      });
      that.getCarrier();
    }
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
  bindDateChange(e) { //选择装货日期
    this.setData({
      date: e.detail.value
    })
  },
  bindPickerChange(e) { //选择时间段
    this.setData({
      timeSlotIndex: e.detail.value
    })
  },
  selectRadio(e) { //运输类型
    const val = e.currentTarget.dataset.val;
    this.setData({
      carType: val
    });
  },
  carShow(parm) { ///选择车辆
    console.log('carShow', parm)
    this.setData({
      carShow: !this.data.carShow
    })
  },
  driverShow(parm) { ///选择司机
    console.log('driverShow', parm)
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
    console.log(type);
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: 1,
      success(res) {
        console.log(type, res)
        switch (type.toString()) {
          case "1":
            that.setData({
              pic1: res.tempFilePaths
            })
            break;
          case "2":
            that.setData({
              pic2: res.tempFilePaths
            })
            break;
          case "3":
            that.setData({
              pic3: res.tempFilePaths
            })
            break;
          default:
            break;
        }
      }
    })
  },
  previewImage(e) {
    const that = this;
    const current = e.target.dataset.src
    const type = e.target.dataset.idx;
    const url = this.data['pic' + type];
    wx.previewImage({
      current,
      urls: url
    })
  },
  formSubmit(e) {
    console.log(e.detail.value);
    let _formData = e.detail.value;
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
  pickerSelected(e) {
    const that = this;
    const data = e.detail;
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