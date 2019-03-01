// pages/userinfo/userinfo.js
var app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookid:0,
    coverurl: "",
    title: "",
    author: "",
    readnum: "",
    price:0,
    abstractContent: "",
    commentList: [],
    i:0,
  },

  /**
   * 点击 开始阅读 触发
   */
  beginRead: function () {
    wx.navigateTo({
      url: '../bookReading/bookReading?bookid='+this.data.bookid
    })
  },

  /**
   * 点击 收藏 触发
   */
  addToCollect: function(){
    wx.request({
      url: 'https://yymilk0s.qcloud.la/weapp/Book/addCollect/' + app.globalData.userid + '/'+this.data.bookid,
      success:(res)=>{
        if(res.data == 0){//如果已经收藏过了
          wx.showToast({
            title: '请勿重复收藏',
            icon:'none',
            duration: 1000
          })
        }
        else{         
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },

  /**
   * 点击 加入书架 触发
   */
  addToBookshelf:function(){
    wx.request({
      url: 'https://yymilk0s.qcloud.la/weapp/Book/addBookshelf/' + app.globalData.userid + '/' + this.data.bookid,
      success: (res) => {
        if (res.data == 0) {
          wx.showToast({
            title: '已经购买过了，快去读吧',
            icon: 'none',
            duration: 1000
          })
        }
        else {
          wx.showToast({
            title: '购买成功',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.bookid=options.bookid
    wx.request({//书籍信息
      url: 'https://yymilk0s.qcloud.la/weapp/Book/getBookInfo/'+this.data.bookid,
      success: (res) => {
       this.setData({
         coverurl:res.data[0]['picture_url'],
         title:res.data[0]['book_name'],
         author:res.data[0]['author'],
         readnum:res.data[0]['reading_num'],
         price:res.data[0]['price'],
         abstractContent:res.data[0]['summary'],
         bookid:this.data.bookid
       })
      }
    })
    wx.request({//书籍的评论信息
      url: 'https://yymilk0s.qcloud.la/weapp/Book/getBookComment/'+this.data.bookid,
      success:(res) => {
        if (res.data.commentuser){
        while (res.data.commentuser[this.data.i]) {
          var newarray = [{
            profileurl: res.data.commentuser[this.data.i][0]['avatar_url'] ,
            name: res.data.commentuser[this.data.i][0]['user_name'] ,
            content: res.data.comment[this.data.i]['comment'] 
          }];
          this.setData({
            'commentList': this.data.commentList.concat(newarray)
          })
          this.data.i++;
        }
        }
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
      return{
        title: this.data.title+' '+this.data.author,
        path: "../book/book?bookid="+this.data.bookid,
        imageUrl: this.data.coverurl
      }
  }
})