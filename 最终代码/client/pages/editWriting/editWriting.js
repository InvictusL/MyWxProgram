// pages/editWriting/editWrting.js
var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookid:0,
    page:0,
    bookinfo:[],
    iscreated: 0,
    note:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bookid:options.bookid,
      page:options.page,
      iscreated: options.iscreated
    })
    console.log(this.data.iscreated)
    if (this.data.iscreated == 1){
      console.log("dsfsdgfsag")
      this.setData({
        note:options.note
      })
    }
    var that = this;
    wx.request({
      url: 'https://yymilk0s.qcloud.la/weapp/index/getBookInfo/' + that.data.bookid,
      success:(res)=>{
        that.setData({
          bookinfo:res.data
        })
      }
    })
  },

  /**
   * 点击 保存 触发
   */
  submit: function (e) {
    console.log("iscreated " + this.data.iscreated)
    if(this.data.iscreated == 0){//如果是新写笔记
      wx.request({
        url: 'https://yymilk0s.qcloud.la/weapp/index/addWriting/' + app.globalData.userid + '/' + this.data.bookid + '/' + e.detail.value.textarea + '/' + this.data.page,
        success: (res) => {
          wx.showToast({
            title: '第一次保存成功！',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
    else {
      this.setData({
        iscreated: 0
      })
      wx.request({// 如果是修改笔记
        url: 'https://yymilk0s.qcloud.la/weapp/index/updateWriting/' + app.globalData.userid + '/' + this.data.bookid + '/' + e.detail.value.textarea + '/' + this.data.page,
        success: (res) => {
          wx.showToast({
            title: '修改保存成功！',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
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