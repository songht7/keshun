// pages/components/scan-code/scan-code.js
Component({
  options: {
    virtualHost: true, //将这个自定义组件设置为“虚拟的”
  },
  externalClasses: ['class'], //接受外部传入的样式类
  properties: { // 定义 参数 属性可以拿到 对应 属性上设置的值
    style: String,
    holder:{
      type:String,
      value:"请输入交货单号"
    }
  },
  data: {
    result: ''
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
    scanCode() {
      const that = this
      wx.scanCode({
        success(res) {
          console.log(res);
          that.setData({
            result: res.result
          })
        },
        fail(err) {
          console.log(err);
        }
      })
    },
    seachCode(){
      this.triggerEvent('seachCode', this.data.result) //访问父组件事件
    }
  }
})