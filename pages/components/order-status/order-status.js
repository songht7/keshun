// pages/components/order-status/order-status.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    virtualHost: true, //将这个自定义组件设置为“虚拟的”
  },
  properties: {
    list: Array
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    previewImage(e) {
      const current = e.target.dataset.src;
      console.log("previewImage:", current)
      wx.previewImage({
        urls: [current]
      })
    },
  }
})