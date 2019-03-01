// pages/store/store.js  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [//轮播图
      '/images/轮播图1.jpg',
      '/images/轮播图2.jpg',
      '/images/轮播图3.jpg',
      '/images/轮播图4.jpg'
    ],
    proList: [],//书籍信息数组
    i:0,
    category:['为你推荐','古典','网游','都市','玄幻','修仙','武侠'],//分类数组
    index:0,//分类索引
    isrank:false//是否按照热度排行
  },

  /**
   * 前往搜索页面
   */
  goSearchView: function () {
    wx.redirectTo({
      url: '../search/search',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    wx.request({//初次进入商城，默认显示推荐书目
      url: 'https://yymilk0s.qcloud.la/weapp/Store/getBookInfo',
      success:(res)=>{
        while(res.data[this.data.i] != null){
          var newarray = [{
            bookid: res.data[this.data.i]['book_id'],
            pic1: res.data[this.data.i]['picture_url'],
            bookname1: res.data[this.data.i]['book_name']
          }];
          this.data.proList = this.data.proList.concat(newarray);
          this.data.i++;
        }
        this.setData({
          'proList': this.data.proList,
          isrank: false
        })
      }
    })
  },

  /**
   * 选择分类后触发
   */
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,//获取点击的分类的索引
      isrank: false
    })
    if (this.data.index != 0) {//如果所选分类不为“为你推荐”，则从数据库中取出相应分类的书目
      wx.request({
        url: 'https://yymilk0s.qcloud.la/weapp/Store/getBookInfoWithCategory/' + this.data.category[this.data.index],
        success: (res) => {
          this.data.proList = []//先将书籍数组清空
          var i = 0
          while (res.data[i] != null) {
            var newarray = [{
              bookid: res.data[i]['book_id'],
              pic1: res.data[i]['picture_url'],
              bookname1: res.data[i]['book_name']
            }]
            this.data.proList = this.data.proList.concat(newarray);
            i++;
          }
          this.setData({
            'proList': this.data.proList
          })
        }
      })
    }
    else {//否则显示推荐书目
      wx.request({
        url: 'https://yymilk0s.qcloud.la/weapp/Store/getBookInfo',
        success: (res) => {
          while (res.data[this.data.i] != null) {
            var newarray = [{
              bookid: res.data[this.data.i]['book_id'],
              pic1: res.data[this.data.i]['picture_url'],
              bookname1: res.data[this.data.i]['book_name']
            }];
            this.data.proList = this.data.proList.concat(newarray);
            this.data.i++;
          }
          this.setData({
            'proList': this.data.proList,
            isrank: false
          })
        }
      })
    }
  },

  /**
   * 点击排行触发
   */
  rank: function () {
    wx.request({
      url: 'https://yymilk0s.qcloud.la/weapp/Store/getTopBookInfo',
      success: (res) => {
        this.data.proList = []//清空书籍数组
        var i = 0
        while (res.data[i] != null) {
          var newarray = [{
            bookid: res.data[i]['book_id'],
            pic1: res.data[i]['picture_url'],
            bookname1: res.data[i]['book_name'],
            collect_num: res.data[i]['collect_num'],
            reading_num: res.data[i]['reading_num']
          }]
          this.data.proList = this.data.proList.concat(newarray);
          i++;
        }
        this.setData({
          'proList': this.data.proList,
          isrank: true//显式指明当前按照热度排行
        })
      }
    })
  },

  /**
   * 点击书籍封面触发，跳转到相应Book页面
   */
  toBook: function (e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../book/book?bookid=' + e.currentTarget.dataset.id,
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
  
  }
})