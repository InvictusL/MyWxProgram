//index.js
var WxSearch = require('../../searchView/searchView.js');

Page({
  data: {
    result:[]//搜索结果
  },

  // 搜索栏
  onLoad: function (option) {
    var that = this;
    wx.request({//获得所有书目信息
      url: 'https://yymilk0s.qcloud.la/weapp/Store/getBookInfo',
      success: (res) => {
        var i = 0;
        while (res.data[i] != null) {
          var newarr = [{
            'bookname': res.data[i]['book_name'],
            'bookid' : res.data[i]['book_id']
            }]
          this.data.result = this.data.result.concat(newarr);
          i++;
        }
        this.setData({
          result:this.data.result
        })
        WxSearch.init(//将初始化函数写在成功回调函数中，保证书籍信息成功返回后再初始化
          that,  // 本页面一个引用
          ['我的王者心', '圣墟', "水浒传", "牧神记", '全职高手'], // 热点搜索推荐，[]表示不使用
          that.data.result,// 搜索匹配，[]表示不使用
          that.mySearchFunction, // 提供一个搜索回调函数
          that.myGobackFunction //提供一个返回回调函数
        );
      }
    })
  },

  // 转发函数,固定部分
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

  // 搜索回调函数  
  mySearchFunction: function (value) {
    // do your job here
    // 跳转
    if(value != '无搜索结果！'){
      for(var i = 0; i < this.data.result.length;i++){
        if(this.data.result[i]['bookname'] == value){
          wx.navigateTo({
            url: '../bookReading/bookReading?bookid='+this.data.result[i]['bookid'],
          })
        }
      }
    }
  },

  // 返回回调函数
  myGobackFunction: function () {
    // do your job here
    // 跳转
      wx.switchTab({
        url: '../store/store',
      })
  },
})
