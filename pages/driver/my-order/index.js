// pages/driver/my-order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    }, {
      id: 2,
      order: "ks0020020090093232",
      numb: "1000件",
      weight: "2吨",
      address: "上海中心大厦",
      name: "曹操",
      phone: "13918181818",
      deliver: "广州",
      estimate: "2020年10月30日"
    }, {
      id: 3,
      order: "ks0020020090093233",
      numb: "1000件",
      weight: "2吨",
      address: "上海中心大厦",
      name: "曹操",
      phone: "13918181818",
      deliver: "广州",
      estimate: "2020年10月30日"
    }],
    checkedAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const list = that.data.list;
    list.map(obj => {
      obj['checked'] = false;
      obj['hasCheck'] = true;
    });
    that.setData({
      list
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
  filterSubmit() {
    console.log('filterSubmit');
  },
  checkAll(e) {
    console.log(e.detail.value);
    const that = this;
    const list = that.data.list;
    const ck = e.detail.value[0];
    list.map((obj) => {
      obj.checked = ck == 'all' ? true : false
    });
    that.setData({
      list
    });
  },
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail)
    const that = this;
    const list = that.data.list;
    const values = e.detail;
    for (let i = 0, lenI = list.length; i < lenI; ++i) {
      list[i].checked = false;
      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (list[i].id.toString() === values[j].toString()) {
          list[i].checked = true
          break
        }
      }
    };
    that.setData({
      checkedAll: false
    });
  },
  onSubmit() {
    const that = this;
    const list = that.data.list;
    const cks = [];
    list.map((obj, key) => {
      if (obj.checked) {
        cks.push(obj.id)
      }
    });
    console.log(cks);
    setTimeout(() => {
      const fL = list.filter((obj, key) => {
        if (!cks.includes(obj['id'])) {
          console.log(obj)
          return obj
        }
      });
      that.setData({
        list: fL
      });
    }, 1000);
  }
})