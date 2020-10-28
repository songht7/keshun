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
    title: String,
    type: String,
    show: {
      type: Boolean,
      value: true
    },
    maskClose: {
      type: Boolean,
      value: true
    },
    field: {
      type: Object,
      value: {
        id: "key",
        val: "value"
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
    // console.log("picker-search-ready:", that.properties.list);
    // this.setData({
    //   data: that.properties.list
    // });
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
        const _field = this.properties.field;
        console.log(keyword, _list, _field)
        _list.filter((obj, key) => {
          if (obj[_field.val]) {
            if (obj[_field.val].match(keyword) != null) {
              arr.push(obj);
            }
          } else if (obj[_field.type]) {
            if (obj[_field.type].match(keyword) != null) {
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