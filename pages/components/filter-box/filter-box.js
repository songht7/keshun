// pages/components/filter-box/filter-box.js
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    filterShow: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {

    filterShow() {
      const that = this;
      this.setData({
        filterShow: !that.data.filterShow
      });
    },
    closeFilter() {
      this.setData({
        filterShow: false
      });
    },
    filterSubmit(e) {
      this.triggerEvent('filterSubmit')
    }
  }
})