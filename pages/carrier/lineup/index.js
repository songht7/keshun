// pages/carrier/lineup/index.js
// import graceChecker from "../../../common/graceChecker.js";
const app = getApp();
const util = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: util.userInfo,
    userType: util.userType,
    parm: {
      Status: 0,
      WareHouseGroupId: 0
    },
    lineupShow: false,
    lineupList: [{
        "Id": 0,
        "Value": "待入场"
      },
      {
        "Id": 1,
        "Value": "可入场"
      },
      {
        "Id": 2,
        "Value": "已入场"
      },
      {
        "Id": 3,
        "Value": "可出场"
      },
      {
        "Id": 4,
        "Value": "已出场"
      },
    ],
    lineupData: {
      id: 0,
      value: "待入场"
    },
    field: {
      id: 'Id',
      val: 'Value'
    },
    groupShow: false,
    groupList: [],
    groupData: {
      id: "",
      value: ""
    },
    field2: {
      id: 'Key',
      val: 'Value'
    },
    dataList: [],
    fieldNumber: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    let parm = that.data.parm;
    parm['WareHouseGroupId'] = util.userInfo.loginInfo.WareHouseId;
    that.setData({
      userInfo: util.userInfo,
      userType: util.userType,
      parm
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
    that.getData();
    that.getUserGroup(); //获取仓库 用户登录信息中 方式1
    // that.getGroup();//获取仓库 接口 方式2
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getData() {
    const that = this;
    const _parm = that.data.parm;
    var params = Object.keys(_parm).map(function (key) {
      return key + "=" + _parm[key];
    }).join("&");
    wx.showLoading({
      title: '加载中...',
    })
    let data = {
      "inter": "queryInfoApplets",
      "parm": "?" + params
    }
    data["fun"] = function (res) {
      console.log(res);
      wx.hideLoading({
        success: (res) => {},
      })
      if (res.status > 0) {
        let fieldNumber = [];
        res.data.map((obj, key) => {
          fieldNumber.push(obj.SortNo);
        });
        that.setData({
          fieldNumber,
          dataList: res.data
        });
      } else {
        that.setData({
          error: res.msg
        });
      }
    }
    util.getData(data)
  },
  getUserGroup() {
    const that = this;
    let group = util.userInfo.loginInfo.GroupId;
    let groupDesc = util.userInfo.loginInfo.GroupDesc;
    group = group ? group.split(',') : [];
    groupDesc = groupDesc ? groupDesc.split(',') : [];
    if (group.length) {
      let groupList = [];
      group.map((obj, k) => {
        let g = {
          Key: obj,
          Value: groupDesc[k]
        }
        groupList = [...groupList, g]
      });
      console.log(groupList);
      that.setData({
        groupList
      });
    }
  },
  getGroup() {
    const that = this;
    let data = {
      "inter": "getWarehousGroup",
      "parm": "?UserId=" + util.userInfo.loginInfo.Id
    }
    data["fun"] = function (res) {
      console.log("getGroup:", res);
      if (res.status > 0) {
        that.setData({
          groupList: res.data
        });
      }
    }
    util.getData(data)
  },
  pickerLineup(e) {
    const that = this;
    const data = e.detail;
    let parm = that.data.parm;
    parm['Status'] = parseInt(data.id);
    that.setData({
      parm,
      lineupData: {
        id: parseInt(data.id),
        value: data.val
      },
      lineupShow: false
    })
    that.getData();
  },
  lineupShow(parm) { ///选择仓库
    this.setData({
      lineupShow: !this.data.lineupShow
    })
  },
  pickerGroup(e) {
    const that = this;
    const data = e.detail;
    let parm = that.data.parm;
    parm['WareHouseGroupId'] = parseInt(data.id);
    that.setData({
      groupData: {
        id: parseInt(data.id),
        value: data.val
      },
      groupShow: false
    })
    that.getData();
  },
  groupShow(parm) { ///选择仓库
    this.setData({
      groupShow: !this.data.groupShow
    })
  },
  maskClose(e) {
    const that = this;
    const data = e.detail;
    that.setData({
      lineupShow: false,
      groupShow: false
    })
  },
})