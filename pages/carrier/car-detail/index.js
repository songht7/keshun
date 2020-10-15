// pages/carrier/car-detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    datas: {
      id: 1,
      NO: "1910255",
      name: "关羽",
      gender: 1,
      phone: "13918181818",
      logistics: "东顺物流",
      idCard: "31011020",
      empNO: "JK09090",
      driverLicense: "556677"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      id: options.id || ""
    });
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
  bindInput(e) {
    const name = e.currentTarget.dataset.name;
    const _datas = this.data.datas;
    _datas[name] = e.detail.value;
    this.setData({
      datas: _datas
    });
  },
  formSubmit(e) {
    // let _formData = e.detail.value;
    let _formData = this.data.datas;
    console.log(_formData);
    var rule = [{
      name: "phone",
      checkType: "phoneno",
      checkRule: "",
      errorMsg: "请填写正确的手机号"
    }];
    var checkRes = graceChecker.check(_formData, rule);
    if (checkRes) {} else {}
  }
})