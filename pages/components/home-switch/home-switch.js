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
    switchBtns: [],
    btns: {
      "switch-A": [{
        label: "交货单查询", //按钮名称
        icon: "icon-1.png", //按钮图标
        sw: "38", //按钮大小 38 60 100 50
        tap: "linkTo", //按钮点击事件 childFun parTap linkTo
        url: "/pages/driver/order/index" //按钮setdata值
      }, {
        label: "司机扫码定位",
        icon: "icon-2.png",
        sw: "60",
        tap: "parTap",
        url: "/pages/hello/index"
      }, {
        label: "进入后台",
        icon: "icon-3.png",
        sw: "100",
        tap: "linkTo",
        url: "/pages/hello/index"
      }],
      "switch-B": [{
        label: "排队取号",
        icon: "icon-4.png",
        sw: "38",
        tap: "linkTo",
        url: "/pages/hello/index"
      }, {
        label: "客户签收",
        icon: "icon-5.png",
        sw: "60",
        tap: "linkTo",
        url: "/pages/hello/index"
      }, {
        label: "GPS上传",
        icon: "icon-6.png",
        sw: "100",
        tap: "linkTo",
        url: "/pages/hello/index"
      }, {
        label: "我的交货单",
        icon: "icon-7.png",
        sw: "60",
        tap: "linkTo",
        url: "/pages/hello/index"
      }, {
        label: "交货单转入",
        icon: "icon-8.png",
        sw: "38",
        tap: "linkTo",
        url: "/pages/hello/index"
      }]
    }
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
    switch (this.properties.switchType.toString()) {
      case "1":
        that.setData({
          switchBtns: this.properties.btns["switch-A"]
        });
        break;
      case "2":
        that.setData({
          switchBtns: this.properties.btns["switch-B"]
        });
        break;

      default:
        break;
    }
    console.log("ready:", this.properties.switchBtns)
  },
  methods: {
    parTap(e) {
      var value = "parent funtion";
      this.triggerEvent('parTap', value) //访问父组件事件
    },
    childFun() {
      //访问子组件事件
      console.log("children funtion");
    },
    linkTo(event) {
      wx.navigateTo({
        url: event.currentTarget.dataset.url
      })
    }
  }
})