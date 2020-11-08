// pages/components/location-list/location-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    locationList: Array
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
      let data = {
        data: e.currentTarget.dataset
      }
      this.triggerEvent("iconClick", data);
    }
  }
})