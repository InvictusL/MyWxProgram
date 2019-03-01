// pages/myCollection/myCollection.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mypost: [],//存储我的收藏海报信息数组
    userid: 1,
    i: 0,
    isedit: 0,
    index: 0,
    ischoosecoll: []
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '我的读书海报' })

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
      url: 'https://yymilk0s.qcloud.la/weapp/index/getMyPost/' + app.globalData.userid,
      success: (res) => {
        if (res.data.post) {
          this.data.i = 0;
          this.data.mypost = [];
          while (res.data.post[this.data.i]) {
            this.data.mypost = this.data.mypost.concat(res.data.post[this.data.i]),
              this.data.ischoosecoll[this.data.i] = {
                isselect: 0,
                id: res.data.post[this.data.i]['post_id']
              }
            this.data.i++
          }
          this.setData({
            mypost: this.data.mypost,
            ischoosecoll: this.data.ischoosecoll
          })
        }
        else{
          this.setData({
            mypost: [],
            ischoosecoll: []
          })
        }
        // console.log(res.data);
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
      isedit: 1//进入编辑状态
    })
    wx.hideTabBar({

    })
    //this.onShow();
  },

  /**
   * 点击 确认 触发
   */
  confirm: function () { 
    var i = 0
    for (; i < this.data.mypost.length; i++) {
      this.data.ischoosecoll[i].isselect = 0
    }
    this.setData({
      isedit: 0,
      ischoosecoll: this.data.ischoosecoll
    })
  },

  /**
   * 选择元素后 触发
   */
  select: function (e) {
    this.data.ischoosecoll[e.currentTarget.dataset.index].isselect = 1 - this.data.ischoosecoll[e.currentTarget.dataset.index].isselect
    this.data.ischoosecoll[e.currentTarget.dataset.index].bookid = e.currentTarget.dataset.id
    this.setData({
      ischoosecoll: this.data.ischoosecoll
    })
     console.log(e.currentTarget.dataset.index)
  },

  /**
   * 点击 删除海报 触发
   */
  remove: function () {
    var temp = this.data.ischoosecoll
    var that = this
    wx.showModal({
      title: '提示',
      content: '删除选中海报？',
      success: function (res) {
        if (res.confirm) {
          for (var j = 0; j < temp.length; j++) {
            // console.log(temp.length)
            if (temp[j].isselect == 1) {
              wx.request({
                url: 'https://yymilk0s.qcloud.la/weapp/index/deletePost/' + temp[j].id,
                success:function(res){
                  that.onShow();
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

  },

  /**
   * 点击 海报 触发
   */
  postDetail:function(e){// 海报预览
    var that = this;
    var index = e.currentTarget.dataset.index;
    console.log(e.currentTarget.dataset.index);
    wx.previewImage({
      urls: [that.data.mypost[index]['picture_url']],
    })
  }
})