// pages/components/fixed-btns/fixed-btn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    addBtn: {
      type: Object,
      value: {
        name: "添加",
        url: "/"
      }
    }
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
    onAdd() {
      const that = this;
      const addBtn = that.properties.addBtn;
      wx.navigateTo({
        url: addBtn.url,
      })
    }
  }
})