// pages/component/home-switch/home-switch.js
Component({
  options: {
    virtualHost: true, //将这个自定义组件设置为“虚拟的”
  },
  externalClasses: ['class'], //接受外部传入的样式类
  properties: { // 定义 参数 属性可以拿到 对应 属性上设置的值
    style: String,
    switchType: Number
  },
  data: {
  },
  created: function () {
    console.log('[my-component] created')
  },
  attached: function () {
    console.log('[my-component] attached')
  },
  ready: function () {
    console.log('[my-component] ready')
  },
  methods: {
    parTap(e) {
      var value = "parent funtion";
      this.triggerEvent('parTap', value)
    },
    test() {
      console.log("children funtion");
    },
    linkTo(event) {
      let url = event.currentTarget.dataset.page;
      switch (url) {
        case "my":
          wx.navigateTo({
            url: '/pages/hello/index',
          })
          break;
        default:
          break;
      }
    }
  }
})