// pages/component/home-switch/home-switch.js
/*"T202011050001" "6100067363" 6100067363 "6200000124" 6100468012 "6100067681" "6100067472" */
/*"T202011050002" "6100067368"*/
/*
 * 12312312313  1 对应科顺员工(物流干事)
 * 12312312314  2  对应承运商
 * 12312312312  3 对应司机 
 * 12312312315  4  对应科顺员工(商务)
 * 13220046241  3 对应司机 带仓库
 */
const app = getApp();
const util = app.globalData;
Component({
  options: {
    virtualHost: true, //将这个自定义组件设置为“虚拟的”
  },
  externalClasses: ['class'], //接受外部传入的样式类
  properties: { // 定义 参数 属性可以拿到 对应 属性上设置的值
    style: String,
    switchType: Number,
    siteType: String
  },
  data: {
    switchBtns: [],
    pageTpe: "首页",
    btns: {
      /*首页switch-A*/
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
        tap: "linkTo",
        url: "/pages/driver/location/index"
      }, {
        label: "交货单评价",
        icon: "icon-21.png",
        sw: "100",
        tap: "linkTo",
        url: "/pages/scoring/index"
      }, {
        label: "进入后台",
        icon: "icon-3.png",
        sw: "100",
        tap: "linkTo",
        url: "/pages/login/index"
      }],
      /*司机switch-B*/
      "switch-B": [{
        label: "排队取号",
        icon: "icon-4.png",
        sw: "38",
        tap: "linkTo",
        url: "/pages/driver/sign/index"
      }, {
        label: "客户签收",
        icon: "icon-5.png",
        sw: "60",
        tap: "linkTo",
        url: "/pages/driver/customer-sign/index"
      }, {
        label: "GPS上传",
        icon: "icon-6.png",
        sw: "100",
        tap: "linkTo",
        url: "/pages/driver/gps/index"
      }, {
        label: "我的交货单",
        icon: "icon-7.png",
        sw: "60",
        tap: "linkTo",
        url: "/pages/driver/my-order/index"
      }, {
        label: "交货单转入",
        icon: "icon-8.png",
        sw: "38",
        tap: "linkTo",
        url: "/pages/driver/order-into/index"
      }],
      /*承运商switch-C*/
      "switch-C": [{
        label: "车辆/司机分配",
        icon: "icon-15.png",
        sw: "60",
        tap: "linkTo",
        url: "/pages/carrier/distribute/index"
      }, {
        label: "交货单查询",
        icon: "icon-7.png",
        sw: "38",
        tap: "linkTo",
        url: "/pages/carrier/order/index"
      }, {
        label: "司机管理",
        icon: "icon-16.png",
        sw: "100",
        tap: "linkTo",
        url: "/pages/carrier/driver/index"
      }, {
        label: "车辆管理",
        icon: "icon-17.png",
        sw: "38",
        tap: "linkTo",
        url: "/pages/carrier/car/index"
      }, {
        label: "场内排队信息",
        icon: "icon-18.png",
        sw: "60",
        tap: "linkTo",
        url: "/pages/carrier/lineup/index"
      }],
      /*科顺员工(物流干事)switch-D*/
      "switch-D": [{
        label: "承运商分配",
        icon: "icon-7.png",
        sw: "38",
        tap: "linkTo",
        url: "/pages/carrier/order-list/index"
      }, {
        label: "车辆/司机分配",
        icon: "icon-15.png",
        sw: "60",
        tap: "linkTo",
        url: "/pages/carrier/distribute/index"
      }, {
        label: "司机管理",
        icon: "icon-16.png",
        sw: "60",
        tap: "linkTo",
        url: "/pages/carrier/driver/index"
      }, {
        label: "车辆管理",
        icon: "icon-17.png",
        sw: "38",
        tap: "linkTo",
        url: "/pages/carrier/car/index"
      }],
      /*科顺员工(商务)switch-E*/
      "switch-E": [{
        label: "交货单查询",
        icon: "icon-7.png",
        sw: "100",
        tap: "linkTo",
        url: "/pages/carrier/order/index"
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
    const menus = that.properties.btns;
    const _loginInfo = util.userInfo.loginInfo || '';
    const userType = _loginInfo && _loginInfo['PostId'] ? _loginInfo['PostId'].toString() : '';
    /* PostId 对应 1是科顺员工（物流干事） 2是承运商 3是司机 4科顺员工（商务）*/
    switch (userType) {
      case "1":
        that.setData({
          pageTpe: "科顺员工(物流干事)",
          switchBtns: menus["switch-D"]
        });
        break;
      case "2":
        that.setData({
          pageTpe: "承运商",
          switchBtns: menus["switch-C"]
        });
        break;
      case "3":
        that.setData({
          pageTpe: "司机",
          switchBtns: menus["switch-B"]
        });
        break;
      case "4":
        that.setData({
          pageTpe: "科顺员工(商务)",
          switchBtns: menus["switch-E"]
        });
        break;
      default:
        // const nav = menus["switch-A"].filter((obj, key) => {
        //   return key < 2
        // });
        // that.setData({
        //   pageTpe: "首页",
        //   switchBtns: nav
        // });
        // break;
        that.setData({
          pageTpe: "首页 - 未登录",
          switchBtns: menus["switch-A"]
        });
        break;
    }
    // console.log("ready:", this.properties.switchBtns)
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