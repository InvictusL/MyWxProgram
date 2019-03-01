// pages/bookReading/bookReading.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookInfo: {},
    pages: [],
    bookid: 0,
    currentpage: -3,
    showbottom: false,
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bookid: options.bookid,
    })
    wx.request({
      url: 'https://yymilk0s.qcloud.la/weapp/index/getReadingProgress/' + this.data.bookid + '/' + app.globalData.userid,
      success: (res) => {
        if (res.data[0]) {
          this.data.currentpage = res.data[0]['reading_progress']
        }
        else {
          this.data.currentpage = 0
        }
        wx.request({
          url: 'https://yymilk0s.qcloud.la/weapp/index/getBookInfo/' + this.data.bookid,
          success: (res) => {
            if (res.data[0]) {
              var str = res.data[0]['MainBodyChapter1_1'];
              var j = 500;
              for (var i = 0, len = str.length; i < len / j; i++) {
                var a = str.slice(j * i, j * (i + 1));
                //a = a.replaceAll("\r\n", "<br>"); 
                this.data.pages.push(a);
              }
              this.setData({
                bookInfo: {
                  book_avatar: res.data[0]['picture_url'],
                  book_name: res.data[0]['book_name'],
                  author: res.data[0]['author']
                },
                pages: this.data.pages,
                currentpage: this.data.currentpage
              })
            }
            console.log(res.data)
          }
        })

        wx.request({//如果用户看的这本书已经在书架了，那么更新最后阅读时间
          url: 'https://yymilk0s.qcloud.la/weapp/book/updateLastReadingTime/' + this.data.bookid + '/' + app.globalData.userid,
        })
      }
    })
  },

  changepage: function (e) {
    this.setData({
      currentpage: e.detail.current
    })
    wx.request({
      url: 'https://yymilk0s.qcloud.la/weapp/index/changereadingprogress/' + this.data.bookid + '/' + app.globalData.userid + '/' + e.detail.current,
    })
  },

  /**
   * 点击 读书页面 触发
   */
  showbottom:function(e){
    console.log(this.data.showbottom)
    var isshow = !this.data.showbottom
      this.setData({
        showbottom: isshow
      })
  },

  /**
   * 点击 笔记 触发
   */
  toEditWriting:function(e){
    wx.navigateTo({
      url: '../editWriting/editWriting?bookid=' + this.data.bookid + '&page=' + this.data.currentpage + '&iscreated=0',//传入书名和页码
    })
  },

  /**
   * 点击 添加海报 触发
   */
  toEditPost:function(e){
    wx.navigateTo({
      url: '../editPost/editPost?bookid='+this.data.bookid,
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