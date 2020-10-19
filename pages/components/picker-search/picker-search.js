// pages/components/picker-search/picker-search.js
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    list: Array,
    title: String,
    type: String,
    show: {
      type: Boolean,
      value: true
    },
    maskClose: {
      type: Boolean,
      value: true
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
    },
    maskClose(e) {
      const that = this;
      const type = that.properties.type;
      console.log('maskClose', type)
      if (that.properties.maskClose) {
        that.setData({
          show: false
        });
        that.triggerEvent('maskClose', {
          type
        });
      }
    },
    pickerSelected(e) {
      const type = e.currentTarget.dataset.type;
      const id = e.currentTarget.dataset.id;
      const val = e.currentTarget.dataset.val;
      this.triggerEvent('pickerSelected', {
        type,
        id,
        val
      });
    }
  }
})