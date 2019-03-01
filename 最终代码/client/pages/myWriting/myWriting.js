// pages/myCollection/myCollection.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mynote: [],//存储我的读书笔记信息数组
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
    wx.setNavigationBarTitle({ title: '我的读书笔记' })

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
      url: 'https://yymilk0s.qcloud.la/weapp/index/getMyNote/' + app.globalData.userid,
      success: (res) => {
        if (res.data.note) {
          this.data.i = 0;
          this.data.mynote = [];
          while (res.data.note[this.data.i]) {
            this.data.mynote[this.data.i] = {
              note: res.data.note[this.data.i]['reading_note'],
              page: res.data.note[this.data.i]['page'],
              bookid:res.data.note[this.data.i]['book_id'],
              avatar: res.data.bookpic[this.data.i][0]['picture_url'],
              bookname: res.data.bookpic[this.data.i][0]['book_name'],
            }
              this.data.ischoosecoll[this.data.i] = {
                isselect: 0,
              }
            this.data.i++
          }
          this.setData({
            mynote: this.data.mynote,
            ischoosecoll: this.data.ischoosecoll
          })
        }
        else{
          this.setData({
            mynote: [],
            ischoosecoll:[]
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
    for (; i < this.data.mynote.length; i++) {
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
    this.setData({
      ischoosecoll: this.data.ischoosecoll
    })
    // console.log(e.currentTarget.dataset.index)
  },

  /**
   * 点击 删除笔记 触发
   */
  remove: function () {
    var temp = this.data.ischoosecoll;
    var note = this.data.mynote;
    var that = this
    wx.showModal({
      title: '提示',
      content: '删除选中笔记？',
      success: function (res) {
        if (res.confirm) {
          for (var j = 0; j < temp.length; j++) {
            // console.log(temp.length)
            if (temp[j].isselect == 1) {
              // console.log(note[j]['note']);
              wx.request({
                url: 'https://yymilk0s.qcloud.la/weapp/index/deleteNote/' + note[j]['note'],
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
   * 点击 读书笔记 触发
   */
  writingDetail:function(e){
    var arr = this.data.mynote[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '../editWriting/editWriting?iscreated=1&bookid=' + arr['bookid'] + '&page=' + arr['page']+'&note='+arr['note'],//传入 iscreated=true 告诉下一个页面该笔记已经存在
    })
  }
})

