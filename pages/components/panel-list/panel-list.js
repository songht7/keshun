// pages/components/panel-list/panel-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
      observer: function (newVal) {
        this.setData({
          data: newVal
        });
        return newVal;
      }
    },
    holder: {
      type: String,
      value: "搜索司机名称"
    },
    storageSearch: {
      type: Boolean,
      value: true
    },
    field: {
      type: Object,
      value: {
        id: "Id",
        name: "Name"
      }
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
  },

  /**
   * 组件的方法列表
   */
  methods: {
    search(e) {
      const that = this;
      const keyword = e.detail.value;
      if (that.properties.storageSearch) {
        if (keyword != "") {
          const arr = [];
          const _list = this.properties.list;
          console.log(keyword, _list)
          _list.filter((obj, key) => {
            if (obj['name']) {
              if (obj['name'].match(keyword) != null) {
                arr.push(obj);
              }
            } else if (obj['title']) {
              if (obj['title'].match(keyword) != null) {
                arr.push(obj);
              }
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
      } else {
        this.triggerEvent('search', keyword);
      }
    },
    onTap(e) {
      this.triggerEvent('onTap', {
        id: e.currentTarget.dataset.id,
        index: e.currentTarget.dataset.index
      });
    }
  }
})