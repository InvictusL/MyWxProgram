//index.js 
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    userInfo: {},//用户信息
    currentbooklist:[],//最近阅读书籍数组
  },

  onLoad:function(){  /*全局变量赋值在这里进行*/ 
    this.setData({
      userInfo: app.globalData.userInfo
    })
    wx.setNavigationBarTitle({title:'首页'});//设置导航标题
  },

  onShow: function(){//每次页面显示时调用
    wx.request({//先进行用户验证
      url: 'https://yymilk0s.qcloud.la/weapp/index/getUserid/' + app.globalData.userInfo.nickName,
      success: (res) => {
        if (res.data[0]) {//如果该用户已经存在，则将该用户id放入全局变量userid中
          app.globalData.userid = res.data[0]['user_id'];
          wx.request({//获得当前用户的所有最近阅读书籍
            url: 'https://yymilk0s.qcloud.la/weapp/index/getCurrentBook/' + app.globalData.userid,
            success: (res) => {
              if (res.data.currentbook) {
                var i = 0;
                this.data.currentbooklist.splice(0, this.data.currentbooklist.length);
                while (res.data.currentbook[i]) {
                  var array = [
                    {
                      book_id: res.data.currentbook[i]['book_id'],
                      book_name: res.data.currentbookitem[i][0]['book_name'],
                      picture_url: res.data.currentbookitem[i][0]['picture_url'],
                      last_readingtime: res.data.currentbook[i]['last_readingtime']
                    }
                  ]
                  this.data.currentbooklist = this.data.currentbooklist.concat(array);
                  i++;
                }
                this.setData({
                  currentbooklist: this.data.currentbooklist,
                })
              }
            }
          })
        } else {//如果该用户第一次登录，则将其信息插入User表中
          wx.request({
            data:{
              avatar: app.globalData.userInfo.avatarUrl
            },
            url: 'https://yymilk0s.qcloud.la/weapp/index/register/' + app.globalData.userInfo.nickName,
            success: (res) => {
              util.showSuccess("欢迎");
              app.globalData.userid = res.data[0]['user_id'];
            }
          })
        }
      }
    })
  },

  goMyCollection: function () {//跳转到我的收藏
    wx.navigateTo({
      url: '../myCollection/myCollection',
    })
  },

  goMyWriting: function () {//跳转到我的读书笔记
    wx.navigateTo({
      url: '../myWriting/myWriting',
    })
  },

  goMyPost: function () {//跳转到我的读书海报
    wx.navigateTo({
      url: '../myPost/myPost',
    })
  }


  //wx.navigateTo能返回，最多五层，且可通过navigateback显式返回，wx.redirectTo直接打开新页面

  // // 上传图片接口
  // doUpload: function () {
  //     var that = this

  //     // 选择图片
  //     wx.chooseImage({
  //         count: 1,
  //         sizeType: ['compressed'],
  //         sourceType: ['album', 'camera'],
  //         success: function(res){
  //             util.showBusy('正在上传')
  //             var filePath = res.tempFilePaths[0]

  //             // 上传图片
  //             wx.uploadFile({
  //                 url: config.service.uploadUrl,
  //                 filePath: filePath,
  //                 name: 'file',

  //                 success: function(res){
  //                     util.showSuccess('上传图片成功')
  //                     console.log(res)
  //                     res = JSON.parse(res.data)
  //                     console.log(res)
  //                     that.setData({
  //                         imgUrl: res.data.imgUrl
  //                     })
  //                 },

  //                 fail: function(e) {
  //                     util.showModel('上传图片失败')
  //                 }
  //             })

  //         },
  //         fail: function(e) {
  //             console.error(e)
  //         }
  //     })
  // },

  // // 预览图片
  // previewImg: function () {
  //     wx.previewImage({
  //         current: this.data.imgUrl,
  //         urls: [this.data.imgUrl]
  //     })
  // },

  // // 切换信道的按钮
  // switchChange: function (e) {
  //     var checked = e.detail.value

  //     if (checked) {
  //         this.openTunnel()
  //     } else {
  //         this.closeTunnel()
  //     }
  // },

  // openTunnel: function () {
  //     util.showBusy('信道连接中...')
  //     // 创建信道，需要给定后台服务地址
  //     var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

  //     // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
  //     tunnel.on('connect', () => {
  //         util.showSuccess('信道已连接')
  //         console.log('WebSocket 信道已连接')
  //         this.setData({ tunnelStatus: 'connected' })
  //     })

  //     tunnel.on('close', () => {
  //         util.showSuccess('信道已断开')
  //         console.log('WebSocket 信道已断开')
  //         this.setData({ tunnelStatus: 'closed' })
  //     })

  //     tunnel.on('reconnecting', () => {
  //         console.log('WebSocket 信道正在重连...')
  //         util.showBusy('正在重连')
  //     })

  //     tunnel.on('reconnect', () => {
  //         console.log('WebSocket 信道重连成功')
  //         util.showSuccess('重连成功')
  //     })

  //     tunnel.on('error', error => {
  //         util.showModel('信道发生错误', error)
  //         console.error('信道发生错误：', error)
  //     })

  //     // 监听自定义消息（服务器进行推送）
  //     tunnel.on('speak', speak => {
  //         util.showModel('信道消息', speak)
  //         console.log('收到说话消息：', speak)
  //     })

  //     // 打开信道
  //     tunnel.open()

  //     this.setData({ tunnelStatus: 'connecting' })
  // },

  // /**
  //  * 点击「发送消息」按钮，测试使用信道发送消息
  //  */
  // sendMessage() {
  //     if (!this.data.tunnelStatus || !this.data.tunnelStatus === 'connected') return
  //     // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
  //     if (this.tunnel && this.tunnel.isActive()) {
  //         // 使用信道给服务器推送「speak」消息
  //         this.tunnel.emit('speak', {
  //             'word': 'I say something at ' + new Date(),
  //         });
  //     }
  // },

  // /**
  //  * 点击「关闭信道」按钮，关闭已经打开的信道
  //  */
  // closeTunnel() {
  //     if (this.tunnel) {
  //         this.tunnel.close();
  //     }
  //     util.showBusy('信道连接中...')
  //     this.setData({ tunnelStatus: 'closed' })
  // },

  
})
