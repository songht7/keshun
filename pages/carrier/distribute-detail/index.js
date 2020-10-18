// pages/carrier/distribute-detail/index.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    orderCode: "",
    list: [{
      id: 1,
      order: "ks0020020090093231",
      numb: "1000件",
      weight: "2吨",
      address: "上海中心大厦",
      name: "曹操",
      phone: "13918181818",
      deliver: "广州",
      estimate: "2020年10月30日"
    }],
    date: "/-/-/",
    timeSlot: ['5:00 ~ 6:00', '6:00 ~ 7:00', '7:00 ~ 8:00', '8:00 ~ 9:00', '9:00 ~ 10:00'],
    timeSlotIndex: 2,
    carType: 1,
    carList: ['沪AG1234', '沪BC4567', '沪CD7890'],
    carIndex: 0,
    driverList: ['曹操', '刘备', '孙权'],
    driverIndex: 0,
    pic1: [],
    pic2: [],
    pic3: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let d = util.formatTime(new Date());
    that.setData({
      date: d.split(" ")[0]
    });
    if (options.id) {
      that.setData({
        id: options.id
      });
      // that.setData({
      //   datas: _data
      // });
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
  bindPickerCar(e) { //选择车辆
    this.setData({
      carIndex: e.detail.value
    })
  },
  bindPickerDriver(e) { //选择车辆
    this.setData({
      driverIndex: e.detail.value
    })
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
  }
})