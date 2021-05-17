// pages/driver/my-order/index.js


//可转出转出条件 FreightType：0分流 1直达 if (obj.FreightType <= 1 && (obj.Status == 4 || obj.Status == 5))
const app = getApp();
const util = app.globalData;

const list = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    submitLoading: false,
    parm: {
      page: 1,
      limit: 15,
      UserId: 0,
      UserMobile: "",
      // DriverId: 0, //必须 司机id
      Status: -1 //0待处理 1已派车 2已签到 3已入厂 4已出厂 5已跟踪 6已回单 7已结单 8已转出
    },
    carrier: {
      CarrierId: "",
      CarrierDesc: ""
    },
    carrierList: [],
    carrierShow: false,
    carrierVal: {
      CarrierId: "",
      CarrierDesc: ""
    },
    selectCarrierShow: false,
    orderStatus: [{
        key: 999999,
        value: "全部"
      }
      // , {
      //   key: 0,
      //   value: "待处理"
      // }
      , {
        key: 1,
        value: "已派车"
      }, {
        key: 2,
        value: "已签到"
      }, {
        key: 3,
        value: "已入厂"
      }, {
        key: 4,
        value: "已出厂"
      }, {
        key: 5,
        value: "已跟踪"
      }
      // , {
      //   key: 6,
      //   value: "已回单"
      // }, {
      //   key: 7,
      //   value: "已结单"
      // }, {
      //   key: 8,
      //   value: "已转出"
      // }
    ],
    orderStatusShow: false,
    orderStatusVal: {
      id: "",
      value: ""
    },
    list: [],
    count: 0,
    checkedAll: false,
    location: {},
    checkType: 'radio' //radio checkbox
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.getCarrier();
    util.checkLocation(); //检查小程序是否开启定位服务
    wx.getLocation({
      type: util.config.locationType,
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        console.log(res);
        that.setData({
          location: res
        });
      },
      fail() {
        that.setData({
          error: "定位失败！请检查网络、GPS是否正常"
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    const user = util.userInfo.loginInfo;
    let parm = that.data.parm;
    parm['UserId'] = user.Id ? user.Id : 0;
    parm['UserMobile'] = user.PhoneNumber ? user.PhoneNumber : 0;
    // parm['DriverId'] = user.Id ? user.Id : 0;
    that.getList()
  },

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
    const that = this;
    const parm = that.data.parm;
    parm['page'] = 1;
    that.setData({
      parm
    });
    that.getList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom");
    const that = this;
    const parm = that.data.parm;
    if (that.data.list.length >= that.data.count) {
      return false
    }
    parm['page']++;
    that.setData({
      parm
    });
    that.getList('more');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  filterSubmit() {
    const that = this;
    const parm = that.data.parm;
    parm['page'] = 1;
    console.log(parm);
    that.getList();
    const FilterBox = this.selectComponent('#FilterBox');
    FilterBox.closeFilter()
  },
  checkAll(e) {
    console.log(e.detail.value);
    const that = this;
    const list = that.data.list;
    const ck = e.detail.value[0];
    let cks = [];
    list.map((obj) => {
      if (obj.FreightType <= 1 && (obj.Status == 4 || obj.Status == 5)) {
        let c = ck == 'all' ? true : false;
        obj.checked = c;
        if (c) {
          cks.push(parseInt(obj.Id))
        } else {
          cks = [];
        }
      }
    });
    that.setData({
      list,
      cks
    });
    console.log(cks);
  },
  checkboxChange(e) {
    // console.log('checkbox发生change事件，携带value值为：', e.detail, e)
    const that = this;
    if (that.data.checkType == "radio") {
      that.setData({
        DN_NO: e.detail
      });
    } else {
      const list = that.data.list;
      const values = e.detail;
      const cks = [];
      values.map((obj, key) => {
        cks.push(parseInt(obj))
      });
      that.setData({
        cks
      });
      for (let i = 0, lenI = list.length; i < lenI; ++i) {
        list[i].checked = false;
        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (list[i]["Id"].toString() === values[j].toString()) {
            list[i].checked = true
            break
          }
        }
      };
      that.setData({
        checkedAll: false
      });
    }
  },
  onSubmit() {
    const that = this;
    if (that.data.submitLoading) {
      return
    }
    const list = that.data.list;
    const carrierVal = that.data.carrierVal;
    const cks = that.data.cks;
    console.log(cks, carrierVal);
    if (cks && cks.length > 0) {
      const user = util.userInfo.loginInfo;
      let data = {
        "inter": "batchDeliveryOrderOut",
        "method": "POST",
        "data": {
          OrderList: cks,
          UserId: user.Id,
          UserMobile: user.PhoneNumber
        }
      }
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        submitLoading: true
      });
      data["fun"] = function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.status > 0) {
          // const fL = list.filter((obj, key) => {
          //   //"该订单已经转出过, 请勿重复操作."
          //   if (!cks.includes(obj['Id'])) {
          //     console.log(obj)
          //     return obj
          //   }
          // });
          // that.setData({
          //   list: fL
          // });
          let errList = [];
          res.data.filter((obj, key) => {
            if (obj["result"].toString() != "1") {
              errList.push('[' + obj["dn_no"] + ']' + obj["result"]);
            }
          });
          if (errList.length > 0) {
            that.setData({
              errList,
              errListShow: true
            });
          }
          if (errList.length < cks.length) {
            wx.showToast({
              title: '转出成功',
            })
          }
          setTimeout(() => {
            that.setData({
              submitLoading: false
            });
            that.getList();
          }, 3000);
        } else {
          that.setData({
            submitLoading: false,
            error: res.msg
          });
        }
      }
      util.getData(data)
    } else {
      that.setData({
        error: "请选择订单"
      });
    }
  },
  onSubmit2() {
    const that = this;
    if (that.data.submitLoading) {
      return
    }
    if (that.data.DN_NO) {
      const user = util.userInfo.loginInfo;
      let data = {
        "inter": "gpsElectronicFence",
        "method": "POST",
        "data": {
          UserId: user.Id,
          DN_NO: that.data.DN_NO,
          Latitude: that.data.location.latitude,
          Longitude: that.data.location.longitude
        }
      }
      console.log(data);
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        submitLoading: true
      });
      data["fun"] = function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.status > 0) {
          wx.showToast({
            title: res.msg || '已送达',
          })
          setTimeout(() => {
            that.setData({
              submitLoading: false
            });
            that.getList();
          }, 3000);
        } else {
          that.setData({
            submitLoading: false,
            error: res.msg
          });
        }
      }
      util.getData(data)
    } else {
      that.setData({
        error: "请选择订单"
      });
    }
  },
  iconClick(e) {
    const name = e.currentTarget.dataset.name;
    let parm = this.data.parm;
    parm[name] = "";
    this.setData({
      parm
    });
  },
  bindInput(e) {
    const name = e.currentTarget.dataset.name;
    const _datas = this.data.parm;
    _datas[name] = e.detail.value;
    this.setData({
      parm: _datas
    });
  },
  getList(type) {
    const that = this;
    const _parm = that.data.parm;
    var params = Object.keys(_parm).map(function (key) {
      //return encodeURIComponent(key) + "=" + encodeURIComponent(_parm[key]);
      return key + "=" + _parm[key];
    }).join("&");
    let data = {
      "inter": "deliveryList",
      "parm": "?" + params
    }
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      loading: true
    });
    data["fun"] = function (res) {
      console.log(res);
      that.setData({
        loading: false
      });
      wx.hideLoading()
      wx.stopPullDownRefresh()
      if (res.status > 0) {
        const _list = res.data;
        /** 设置列表可选择 **/
        _list.map(obj => {
          // obj['PlanDeliveryDate'] = obj.PlanDeliveryDate.split(" ")[0];
          if (that.checkType == 'checkbox') {
            if (obj.FreightType <= 1 && (obj.Status == 4 || obj.Status == 5)) {
              obj['checked'] = false;
              obj['hasCheck'] = true;
            }
          } else {
            //hasRadio
            if (!obj.ActualArrivalDate) {
              // obj['checked'] = false;
              obj['hasRadio'] = true;
            }
          }
        });
        console.log(_list)
        /** /设置列表可选择 **/
        if (type == 'more') {
          that.setData({
            list: [...that.data.list, ..._list],
            count: res.count
          });
        } else {
          that.setData({
            list: _list,
            count: res.count
          });
        }
      }

    }
    util.getData(data)
  },
  getCarrier() {
    const that = this;
    let data = {
      "inter": "dropdownList",
      "parm": "?type=CarrierNo"
    }
    data["fun"] = function (res) {
      // console.log(res);
      that.setData({
        carrierList: [{
          key: 999999,
          value: "全部"
        }, ...res.data],
        carrierCount: res.count
      });
    }
    util.getData(data)
  },
  carrierShow(parm) { ///选择承运商
    console.log('carrierShow', parm)
    this.setData({
      carrierShow: !this.data.carrierShow
    })
  },
  pickerSelected(e) {
    const that = this;
    const data = e.detail;
    let parm = that.data.parm;
    parm['CarrierId'] = parseInt(data.id) != 999999 ? parseInt(data.id) : null;
    that.setData({
      carrier: {
        CarrierId: parseInt(data.id),
        CarrierDesc: data.val
      },
      carrierShow: false
    })
  },
  orderStatusShow(parm) { ///选择订单状态
    this.setData({
      orderStatusShow: !this.data.orderStatusShow
    })
  },
  orderStatusSelected(e) {
    const that = this;
    const data = e.detail;
    let parm = that.data.parm;
    parm['Status'] = parseInt(data.id) != 999999 ? parseInt(data.id) : -1;
    that.setData({
      orderStatusVal: {
        id: parseInt(data.id),
        value: data.val
      },
      orderStatusShow: false
    })
  },
  maskClose(e) {
    const that = this;
    const data = e.detail;
    that.setData({
      carrierShow: false
    })
  },
  selectCarrierShow(parm) { ///选择承运商
    this.setData({
      selectCarrierShow: !this.data.selectCarrierShow
    })
  },
  selectCarrier(e) { //选择承运商后提交（目前不需）
    const that = this;
    const data = e.detail;
    let parm = that.data.parm;
    parm['CarrierId'] = parseInt(data.id) != 999999 ? parseInt(data.id) : '';
    wx.showModal({
      title: '确定选择该承运商？',
      content: data.val,
      success(res) {
        if (res.confirm) {
          that.setData({
            carrierVal: {
              CarrierId: parseInt(data.id),
              CarrierDesc: data.val
            },
            selectCarrierShow: false
          })
          that.onSubmit();
        } else if (res.cancel) {}
      }
    })
  },
})