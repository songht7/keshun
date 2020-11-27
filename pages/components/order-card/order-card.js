// pages/components/order-card/order-card.js
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
    virtualHost: true, //将这个自定义组件设置为“虚拟的”
  },
  externalClasses: ['class'], //接受外部传入的样式类,
  /**
   * 组件的属性列表
   */
  properties: {
    list: Array,
    listFull: {
      type: Boolean,
      value: false
    },
    btnLabel: {
      type: String,
      value: "确认"
    },
    showMore: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    moreBtn: false
  },
  ready: function () {
    const that = this;
    this.setData({
      moreBtn: that.properties.showMore
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkboxChange(e) {
      const that = this;
      //console.log(e.detail.value);
      this.triggerEvent('checkboxChange', e.detail.value) //访问父组件事件
    },
    orderCardSubmit(e) {
      const that = this;
      const id = that.data.list[0]["Id"];
      this.triggerEvent('orderCardSubmit', id) //访问父组件事件
    },
    navDetail(e) {
      const that = this;
      const id = e.currentTarget.dataset.id;
      this.triggerEvent('navDetail', id) //访问父组件事件
    },
    showMore() {
      const that = this;
      this.setData({
        showMore: !that.properties.showMore
      });
    }
  }
})