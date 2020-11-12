// pages/components/swiper/index.js
const app = getApp();
const util = app.globalData;
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
    virtualHost: true, //将这个自定义组件设置为“虚拟的”
  },
  externalClasses: ['class'], //接受外部传入的样式类
  properties: { // 定义 参数 属性可以拿到 对应 属性上设置的值
    data: Array,
    navto: {
      type: Boolean,
      value: false
    }
  },
  data: {},
  created: function () {},
  attached: function () {},
  ready: function () {
    var that = this;
  },
  methods: {
    navTo(e) {
      const that = this;
      const data = e.currentTarget.dataset;
      if (data.id && that.data.navto) {
        const temp = that.data.data.filter((obj, key) => {
          if (key == data.index && obj.Id == data.id) {
            return obj
          }
        });
        util.tempData = temp[0];
        wx.navigateTo({
          url: '/pages/news/index?id=' + data.id,
        })
      }
    }
  }
})