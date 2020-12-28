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
      value: "搜索..."
    },
    topSearch: { //列表头部搜索
      type: Boolean,
      value: true
    },
    storageSearch: { //是否本地遍历
      type: Boolean,
      value: true
    },
    field: {
      type: Object,
      value: {
        id: "Id",
        name: "Name",
        title: "Title",
        subTitle: "SubTitle"
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