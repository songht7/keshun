// pages/components/scan-code/scan-code.js
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
    virtualHost: true, //将这个自定义组件设置为“虚拟的”
  },
  externalClasses: ['class'], //接受外部传入的样式类
  properties: { // 定义 参数 属性可以拿到 对应 属性上设置的值
    style: String,
    holder: {
      type: String,
      value: "请输入交货单号"
    },
    disabled: {
      type: Boolean,
      value: false
    },
    auto: { //自动提交
      type: Boolean,
      value: false
    }
  },
  data: {
    orderCode: ''
  },
  created: function () {
    console.log('[my-component] created')
  },
  attached: function () {
    console.log('[my-component] attached')
  },
  ready: function () {
    console.log('[my-component] ready')
    var that = this;
  },
  methods: {
    setCode(code = '') {
      const that = this;
      let myCode = that.data.orderCode || code;
      if (myCode && that.data.auto) {
        let formData = {
          orderCode: myCode
        }
        this.triggerEvent('setCode', formData) //访问父组件事件
      }
    },
    scanCode() {
      const that = this;
      wx.scanCode({
        success(res) {
          console.log(res);
          let code = {
            orderCode: res.result
          }
          that.setData(code);
          that.setCode(code)
        },
        fail(err) {
          console.log(err);
          wx.showToast({
            title: "扫码失败",
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    seachCode() {
      const that = this;
      let formData = {
        orderCode: that.data.orderCode
      }
      this.triggerEvent('seachCode', formData) //访问父组件事件
    }
  }
})