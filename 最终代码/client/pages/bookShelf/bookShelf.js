// pages/bookShelf/bookShelf.js
var app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proList: [], //书籍数组
    isedit:0,  //0 表示正常进入书架，1表示编辑中，2 表示编写发现时添加书籍进入书架
    ischoose:[],  //保存书籍 是否被选中 和 书籍id
    category:['所有'],//自定义分类 数组
    index:0,
    hideinput:true, //控制新建分类弹窗是否显示
    input:''//存储新建分类名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // console.log(this.data.category);
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    if (app.globalData.isAddFind) {//判断是否从 添加动态 进入该页面
      this.setData({
        isedit: 2
      })
    }
    wx.setNavigationBarTitle({ title: this.data.category[this.data.index] })
    wx.request({//从数据库中获取该用户所有的分类
      url: 'https://yymilk0s.qcloud.la/weapp/Bookshelf/getMyCategory/' + app.globalData.userid,
      success: (res) => {
        console.log("kkk")
        var i = 0;
        this.data.category = ['所有']
        while (res.data[i] != null) {
          this.data.category[i+1] = res.data[i]['category_name'];//始终保持category[0]=所有
          i++;
        }
        // console.log(res.data);
        this.setData({
          category: this.data.category
        })
      }
    })

    if (this.data.index == 0) {//选择 所有
      // console.log("这是 所有");
      wx.request({
        url: 'https://yymilk0s.qcloud.la/weapp/index/getBookshelf/' + app.globalData.userid,
        success: (res) => {
          // console.log(res.data.currentbookitem);
          if (res.data.currentbookitem) {

            if (this.data.proList.length != res.data.currentbookitem.length) {
              for (var i = 0; i < res.data.currentbookitem.length; i++) {
                this.data.ischoose[i] = {
                  isselect: 0,
                  id: res.data.currentbookitem[i][0]['book_id']
                }
              }
            }
            this.setData({
              proList: res.data.currentbookitem,
              ischoose: this.data.ischoose
            })
          }
          // console.log(this.data.proList)
        }
      })
    }
    else {
      wx.request({
        url: 'https://yymilk0s.qcloud.la/weapp/Bookshelf/getBookfromCategory/' + this.data.category[this.data.index] + '/' + app.globalData.userid,
        success: (res) => {
          console.log(res.data.book);
          if (res.data.book) {
            this.setData({//因为onshow中定义了默认书籍信息，所以当选择分类时，应该先将书籍信息清空
              proList: [],
              ischoose: []
            })
            if (this.data.proList.length != res.data.book.length) {
              for (var i = 0; i < res.data.book.length; i++) {
                this.data.ischoose[i] = {
                  isselect: 0,
                  id: res.data.book[i][0]['book_id']
                }
              }
            }
            this.setData({
              proList: res.data.book,
              ischoose: this.data.ischoose
            })
          }
        }
      })
    }
  },

  /**
   * 选择分类后触发
   */
  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value//获取所选分类的索引
    })
    wx.setNavigationBarTitle({title:this.data.category[this.data.index]})//设置导航标题内容
    if (this.data.index == 0) {//选择 所有
      // console.log("这是 所有");
      wx.request({
        url: 'https://yymilk0s.qcloud.la/weapp/index/getBookshelf/' + app.globalData.userid,
        success: (res) => {
          // console.log(res.data.currentbookitem);
          if (res.data.currentbookitem) {

            if (this.data.proList.length != res.data.currentbookitem.length) {
              for (var i = 0; i < res.data.currentbookitem.length; i++) {
                this.data.ischoose[i] = {
                  isselect: 0,
                  id: res.data.currentbookitem[i][0]['book_id']
                }
              }
            }
            this.setData({
              proList: res.data.currentbookitem,
              ischoose: this.data.ischoose
            })
          }
          // console.log(this.data.proList)
        }
      })
    }
    else {
      wx.request({
        url: 'https://yymilk0s.qcloud.la/weapp/Bookshelf/getBookfromCategory/'+this.data.category[this.data.index]+'/'+app.globalData.userid,
        success: (res) => {
          console.log(res.data.book);
           if(res.data.book){
             this.setData({//因为onshow中定义了默认书籍信息，所以当选择分类时，应该先将书籍信息清空
               proList: [],
               ischoose:[]
             })
             if (this.data.proList.length != res.data.book.length) {
               for (var i = 0; i < res.data.book.length; i++) {
                 this.data.ischoose[i] = {
                   isselect: 0,
                   id: res.data.book[i][0]['book_id']
                 }
               }
             }
             this.setData({
               proList: res.data.book,
               ischoose: this.data.ischoose
             })
           }
        }
      })
    }
  },

  /**
   * 点击书籍触发
   */
  toBookReading: function (e) {
    wx.navigateTo({//进入书籍阅读界面
      url: '../bookReading/bookReading?bookid=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 点击 编辑 触发
   */
  edit: function () {
    this.setData({
      isedit: 1//进入编辑状态
    })
    wx.hideTabBar({//隐藏底部tabbar

    })
  },

  /**
   * 点击 确认 触发
   */
  confirm: function () {
    this.setData({
      isedit: 0,//返回非编辑状态
    })
    wx.showTabBar({
    })
  },

  /**
   * 选中书籍 触发
   */
  select: function (e) {//将所有选中的书籍状态变更为 相反选择状态
    this.data.ischoose[e.currentTarget.dataset.index].isselect = 1 - this.data.ischoose[e.currentTarget.dataset.index].isselect
    this.data.ischoose[e.currentTarget.dataset.index].bookid = e.currentTarget.dataset.id
    this.setData({
      ischoose: this.data.ischoose
    })
  },

  /**
   * 点击 移除书架 触发
   */
  remove: function () {
    var temp = this.data.ischoose
    var that = this
    wx.showModal({
      title: '提示',
      content: '从书架中删除选中书籍？',
      success: function (res) {
        if (res.confirm) {//如果用户点击确定
          for (var i = 0; i < temp.length; i++) {
            if (temp[i].isselect == 1) {//删除相应书籍
              wx.request({
                url: 'https://yymilk0s.qcloud.la/weapp/Bookshelf/deleteBook/' + temp[i].bookid + '/' + app.globalData.userid,
                success:(res)=>{
                  that.onShow();//刷新界面
                }
              })
              temp.splice(i, 1);
              i--;
            }
          }
        } else {
        }
      },
    })
  },

  /**
   * 在分类中点击 移出分组 触发
   */
  removeoutcate:function(){
    var temp = this.data.ischoose
    var that = this
    wx.showModal({
      title: '提示',
      content: '从该分类中删除选中书籍？',
      success: function (res) {
        if (res.confirm) {//如果用户点击确定
          for (var i = 0; i < temp.length; i++) {
            if (temp[i].isselect == 1) {//删除相应书籍
              console.log(temp[i].bookid + ' ' + app.globalData.userid + ' ' + that.data.category[that.data.index])
              wx.request({
                url: 'https://yymilk0s.qcloud.la/weapp/Bookshelf/deleteBookfromCategory/' + temp[i].bookid + '/' + app.globalData.userid + '/' + that.data.category[that.data.index],
                success: (res) => {
                  that.onShow();//刷新界面
                  console.log("删除分类中的书籍")
                }
              })
              temp.splice(i, 1);
              i--;
            }
          }
        } else {
        }
      },
    })
  },

  /**
   * 在 所有 点击 添加到 触发
   */
  addCategory:function(){
    wx.showActionSheet({
      itemList: this.data.category.concat(['新建分类']),
      success:(res) => {
        if(res.tapIndex == this.data.category.length){// 新建分类
        this.setData({
          hideinput:false//让新建分类弹窗显示
        })
      }
        else if(res.tapIndex == 0){//所有 分类，不做改变
      }
      else{//其他分类
        for (var i = 0; i < this.data.ischoose.length; i++) {
          if (this.data.ischoose[i].isselect == 1) {//将相应书籍添加到相应分类
            wx.request({
              url: 'https://yymilk0s.qcloud.la/weapp/Bookshelf/addtoCategory/' + app.globalData.userid + '/' + this.data.ischoose[i].bookid + '/' + this.data.category[res.tapIndex],
            })
            this.data.ischoose.splice(i, 1);
            i--;
          }
        }
        this.onShow();
      }
      }
    })
  },

  /**
   * 在分类中点击 删除分组 触发
   */
  delCategory:function(){
    var that = this;
    wx.request({
      url: 'https://yymilk0s.qcloud.la/weapp/Bookshelf/delCategory/' + this.data.category[this.data.index],
      success:(res)=>{
        that.setData({
          index:0
        })
        that.onShow();
        wx.showToast({
          title: '删除成功！',
          icon: "success",
          duration: 1000
        })
      }
    })
  },

  /**
   * 新建分类弹窗点击取消 触发
   */
  modalcancel: function () {
    this.setData({
      hideinput: true
    });
  },

  /**
   * 获取输入框中内容
   */
  bindinput:function(e){
    this.setData({
      input:e.detail.value
    })
  },
  
  /**
   * 新建分类弹窗点击确定 触发
   */
  modalconfirm: function (e) {
    var isexist = false;//判断该分类名是否存在
    for(var i = 0; i < this.data.category.length; i++){
      if(this.data.category[i] == this.data.input)
        isexist = true;
    }
    if(isexist){//分类名已经存在，提示警告
      wx.showToast({
        title: '分类名已存在',
        icon:'warn',
        duration:3000
      })
    }
    else{//否则新建分类，并添加相应书籍
      for (var i = 0; i < this.data.ischoose.length; i++) {
        if (this.data.ischoose[i].isselect == 1) {//将相应书籍添加到新建分类
          wx.request({
            url: 'https://yymilk0s.qcloud.la/weapp/Bookshelf/addtoCategory/' + app.globalData.userid + '/' + this.data.ischoose[i].bookid + '/' + this.data.input,
          })
          this.data.ischoose.splice(i, 1);
          i--;
        }
      }
      this.setData({
        hideinput: true//新建分类后隐藏弹窗
      })
      this.onShow();
    }
  } ,

  /**
   * 从 添加动态 添加书籍 中进入该页面点击书籍后触发
   */
  toAddBook: function (e) {
    app.globalData.isAddFind = false;
    wx.redirectTo({
      url: '../editFind/editFind?addbookid=' + e.currentTarget.dataset.id,//传回书籍id
    })
  },

  /**
   * 点击+号触发
   */
  toStore: function () {
    wx.switchTab({
      url: '../store/store',
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
  
  }
})