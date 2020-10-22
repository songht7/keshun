// pages/carrier/car-detail/index.js
const util = require('../../../utils/util.js')
import graceChecker from "../../../common/graceChecker.js";

const _data = {
  id: 1,
  NumberPlate: "1910255",
  DrivingIicense: "关羽",
  InsuranceCertificateNumber: 1,
  Images: [],
  Remark: "13918181818"
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    datas: {
      Images: []
    },
    Carrier: {
      CarrierId: 33,
      CarrierDesc: '江苏建伟物流股份有限公司'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if (options.id) {
      that.setData({
        id: options.id
      });
      that.setData({
        datas: _data
      });
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
    let _formData = e.detail.value;
    _formData["Images"] = that.data.datas.Images;
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
      errorMsg: "请上传车辆图片"
    }];
    var checkRes = graceChecker.check(_formData, rule);
    console.log(checkRes);
    if (checkRes) {
      console.log("graceChecker---true");
    } else {
      that.setData({
        error: graceChecker.error
      });
    }
  }
})