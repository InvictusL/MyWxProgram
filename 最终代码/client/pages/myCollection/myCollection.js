// pages/myCollection/myCollection.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */ 
  data: {
    mycollectlist:[],//存储我的收藏书籍信息数组
    i: 0,
    isedit:0,
    index:0,
    ischoosecoll:[]
  },
  
  /**
   * 点击 相应书籍 触发
   */
  toBook:function(e){
    wx.navigateTo({
      url: '../book/book?bookid=' + e.currentTarget.dataset.id,
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '我的收藏' })
    
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
    wx.request({
      url: 'https://yymilk0s.qcloud.la/weapp/index/getMyCollection/' + app.globalData.userid,
      success: (res) => {
        if (res.data.bookitem) {
          this.data.i = 0;
          this.data.mycollectlist = [];
          while (res.data.bookitem[this.data.i]) {
            this.data.mycollectlist = this.data.mycollectlist.concat(res.data.bookitem[this.data.i][0]),
              this.data.ischoosecoll[this.data.i] = {
                isselect: 0,
                id: res.data.bookitem[this.data.i][0]['book_id']
              }
            this.data.i++
          }
          this.setData({
            mycollectlist: this.data.mycollectlist,
            ischoosecoll: this.data.ischoosecoll
          })
        }
        else{
          this.setData({
            mycollectlist: [],
            ischoosecoll: []
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
  
  },

  /**
   * 点击 编辑 触发
   */
  edit: function () {
    this.setData({
      isedit: 1
    })
    wx.hideTabBar({

    })
  },

  /**
   * 点击 确认 触发
   */
  confirm: function () {
    var i = 0
    for (; i < this.data.mycollectlist.length; i++) {
      this.data.ischoosecoll[i].isselect = 0
    }
    this.setData({
      isedit: 0,
      ischoosecoll: this.data.ischoosecoll
    })
  },

  /**
   * 选中相应元素 触发
   */
  select: function (e) {
    this.data.ischoosecoll[e.currentTarget.dataset.index].isselect = 1 - this.data.ischoosecoll[e.currentTarget.dataset.index].isselect
    this.data.ischoosecoll[e.currentTarget.dataset.index].bookid = e.currentTarget.dataset.id
    this.setData({
      ischoosecoll: this.data.ischoosecoll
    })
  },

  /**
   * 点击 移出收藏 触发
   */
  remove: function () {
    var temp = this.data.ischoosecoll
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定从收藏中移出？',
      success: function (res) {
        if (res.confirm) {
          for (var j = 0; j < temp.length; j++) {
            console.log(temp.length)
            if (temp[j].isselect == 1) {
              wx.request({
                url: 'https://yymilk0s.qcloud.la/weapp/Bookshelf/deleteCollect/' + temp[j].bookid + '/' + app.globalData.userid,
                success:function(res){
                  that.onShow()
                }
              })
              temp.splice(j, 1);
              j--;
            }
          }
          that.setData({
            ischoosecoll: temp,
          })
          
        } else {
        }
      },

    })

  }
})