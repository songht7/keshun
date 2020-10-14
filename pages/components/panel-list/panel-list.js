// pages/components/panel-list/panel-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: Array,
    holder:{
      type:String,
      value:"搜索司机名称"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: Array
  },
  ready: function () {
    const that = this;
    this.setData({
      data: that.properties.list
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    search(e) {
      const that = this;
      const keyword = e.detail.value;
      if (keyword != "") {
        const arr = [];
        const _list = this.properties.list;
        console.log(keyword, _list)
        _list.filter((obj, key) => {
          if (obj['name'].match(keyword) != null) {
            arr.push(obj);
          }
        });
        that.setData({
          data: arr
        });
      } else {
        that.setData({
          data: that.properties.list
        });
      }
    }
  }
})