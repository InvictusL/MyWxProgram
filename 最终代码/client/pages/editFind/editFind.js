// pages/editFind/editFind.js 
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAddBook: false,//判断是否已经添加了书籍
    addbookid:0,    //添加书籍的id
    addbookitem:[]//添加书籍的信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {//选完书传回该页面
    if(options.addbookid){     
      this.setData({
        addbookid:options.addbookid,
        isAddBook:true
      })
    wx.request({
      url: 'https://yymilk0s.qcloud.la/weapp/index/getBookInfo/'+this.data.addbookid,
      success:(res)=>{
        this.setData({
          addbookitem:res.data
        })
      }
    })
    }
  },

  /**
   * 点击 添加书籍 触发
   */
  addBook:function(){
    app.globalData.isAddFind = true;
    wx.switchTab({
      url: '../bookShelf/bookShelf',//switchtab不能传参
    })
  },

  /**
   * 点击 发送动态 触发
   */
  submit:function(e){
    wx.request({
      url: 'https://yymilk0s.qcloud.la/weapp/find/addComment/' + app.globalData.userid + '/' + this.data.addbookid + '/' + e.detail.value.textarea,
      success:(res)=>{
        wx.switchTab({
          url: '../find/find',
        })
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
  
  }
})