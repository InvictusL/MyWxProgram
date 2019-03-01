// pages/find/find.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo:{},
    commentList: [],//动态列表
    i:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.userInfo)
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    wx.setNavigationBarTitle({ title: '发现' })
  },

  /**
   * 点击 添加动态 触发
   */
  toEditFind:function(){
    wx.navigateTo({
      url: '../editFind/editFind',
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
    var that = this;
    wx.request({//获取所有动态
      url: 'https://yymilk0s.qcloud.la/weapp/find/getUserComment',
      success: (res) => {
        if (res.data.comment) {
          var i = 0;
          this.data.commentList = []
          while (res.data.comment[i] != null) {
            var newarray = [{
              profileurl: res.data.commentuser[i][0]['avatar_url'],
              name: res.data.commentuser[i][0]['user_name'],
              content: res.data.comment[i]['comment'],
              coverurl: res.data.commentbook[i][0]['picture_url'],
              bookname: res.data.commentbook[i][0]['book_name'],
              author: res.data.commentbook[i][0]['author'],
              commenttime: res.data.comment[i]['comment_time']
            }];
            this.data.commentList = this.data.commentList.concat(newarray);
            i++;
          }
          that.setData({
            commentList: this.data.commentList
          })
        }
      }
    })
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
   this.onShow();
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