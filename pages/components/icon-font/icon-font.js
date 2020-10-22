// pages/components/icon-font/icon-font.js
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    label: String,
    type: String,
    color: {
      type: String,
      value: "#999"
    },
    size: {
      type: Number,
      value: 32
    },
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
    iconClick(e) {
      this.triggerEvent('iconClick');
    }
  }
})