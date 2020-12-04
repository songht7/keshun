// pages/components/order-status/order-status.js
const app = getApp();
const util = app.globalData;
Component({
  /**
   * 组件的属性列表
   */
  options: {
    virtualHost: true, //将这个自定义组件设置为“虚拟的”
  },
  properties: {
    list: Array,
    count: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgurl: util.config.imgurl
  },
  computed: {},

  /**
   * 组件的方法列表
   */
  methods: {

    previewImage(e) {
      const that = this;
      let current = e.target.dataset.src;
      console.log("previewImage:", current)
      let _urls = [];
      let img = that.data.list[0]['ReceiptImage'];
      img.map((obj, key) => {
        let src = util.config.imgurl + obj.ImageAddress;
        _urls.push(src)
      });
      // console.log("previewImage:", _urls);
      wx.previewImage({
        current: current,
        urls: _urls
      })
    },
  }
})