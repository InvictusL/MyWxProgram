// pages/editPost/editPost.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myimage:"",//保存选择的图片路径
    photopath:"",//保存制作的海报路径
    canvasheight:0,//canvas宽高
    canvaswidth:0,
    bookid: 0,
    state:0,
    height:0,
    width:0,
    olddistance: 0,//上一次两个手指的距离
    newdistance: 0,//本次两手指之间的距离，两个一减咱们就知道了滑动了多少，以及放大还是缩小（正负嘛）  
    diffdistance: 0, //这个是新的比例，新的比例一定是建立在旧的比例上面的，给人一种连续的假象  
    Scale: 1,//图片放大的比例，
    baseHeight: 0,       //原始高  
    baseWidth: 0,        //原始宽  
    x: 0,
    y: 0,
    xx:0,
    yy:0
  },

  addImage:function(e){
    var that = this;
    that.data.height = 0
    that.data.width = 0
    that.data.x = 0
    that.data.y = 0
    that.data.xx = 0
    that.data.yy = 0
    that.data.canvasheight = 0
    that.data.canvaswidth = 0
    wx.chooseImage({
      count: 1,//设置只能选择一张照片
      success: function(res) {
        console.log(res.tempFilePaths[0]);
        that.setData({//获得本地图片临时地址，这里需要使用that而不是this，否则无法赋值
          myimage: res.tempFilePaths[0],
          state:1
        })
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success:(result)=>{//canvas绘制底图
              const ctx = wx.createCanvasContext('canvas1')
              var canvaswidth = result.width;
              var canvasheight = result.height;//获取图片的宽高
              console.log(result.width);
              console.log(result.height);
              if (canvasheight != 800){canvasheight = 800}
              if(canvaswidth != 750){canvaswidth = 750} 
              var str = result.width / result.height;//图片的宽高比
              if (str > 1) {//横版图片
                that.data.height = 400;//图片的显示高度为400
                that.data.width = str * that.data.height; //图片的宽度 = 宽高比 * 图片的显示高度
                that.data.xx = result.height/400*375;
                that.data.yy = result.height
              } else {//竖版图片
                that.data.width = 375;//图片的显示宽度为400
                that.data.height = that.data.width / str; //图片的高度 = 宽高比 * 图片的显示宽度
                that.data.xx = result.width
                that.data.yy = result.width/375*400
              }
              that.setData({
                canvaswidth: canvaswidth,
                canvasheight: canvasheight,
                width:that.data.width,
                height:that.data.height,
                xx:that.data.xx,
                yy:that.data.yy
              })
              console.log(canvaswidth);
              console.log(canvasheight);
              canvasheight /= 1.8;
              canvaswidth /= 1.8;//实际坐标与rpx换算比例大约为1.8
              // ctx.drawImage(result.path, 0, 0, canvaswidth, canvasheight)
              // ctx.draw()
              console.log("花完了")
          }
        })
      }
    })
  },

  bindinput:function(e){
    var that = this;
    wx.getImageInfo({
      src: that.data.myimage,
      success: (result) => {//canvas绘制底图
        const ctx = wx.createCanvasContext('canvas1')
        var canvaswidth = that.data.canvaswidth / 1.8;
        var canvasheight = that.data.canvasheight / 1.8;
        ctx.drawImage(result.path, that.data.x, that.data.y, that.data.xx, that.data.yy, 0, 0, 375, 400)
        ctx.setTextAlign('center')    // 文字居中
        ctx.setFillStyle('#ffffff')  // 文字颜色：黑色
        ctx.setFontSize(22)         // 文字字号：22px    
        var initHeight = canvasheight / 2;//绘制字体距离canvas顶部初始的高度 
        this.drawText(ctx, e.detail.value, initHeight, canvaswidth);//调用多行文本换行函数
        ctx.stroke()//绘制已定义路径
        ctx.draw()
      }
    })
  },

  /**
   * 多行文本换行函数
   */
  drawText: function (ctx, str, initHeight, canvasWidth) {
    var lineWidth = 0;//定义文字长度
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引  
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth - 50) {// 减50是为了文字居中，不贴边
        initHeight += 30;
        ctx.fillText(str.substring(lastSubStrIndex, i), canvasWidth/2, initHeight);//绘制截取部分  
        lineWidth = 0;
        lastSubStrIndex = i;
      }
      if (i == str.length - 1) {//绘制剩余部分
        initHeight += 30;
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), canvasWidth / 2, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离  
  },  

  /**
   * 点击 制作海报 触发
   */
  addPost:function(e){
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'canvas1',
      success:(res)=>{
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
            wx.request({
              url: 'https://yymilk0s.qcloud.la/weapp/index/addPost',//目前模拟器和真机显示分隔，不能互通，但都存到了数据库中
              data:{
                path: res.tempFilePath,
                userid: app.globalData.userid,
                bookid: that.data.bookid
              },
              success:(res)=>{
                wx.showToast({
                  title: '制作成功！',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
        //   }
        // })
      }
    }, this)
  },

  scroll: function (e) {
    var _this = this;
    //当e.touches.length等于1的时候，表示是单指触摸，我们要的是双指
    if (e.touches.length == 2) {//两个手指滑动的时候
      var xMove = e.touches[1].clientX - e.touches[0].clientX;//手指在x轴移动距离
      var yMove = e.touches[1].clientY - e.touches[0].clientY;//手指在y轴移动距离
      var distance = Math.sqrt(xMove * xMove + yMove * yMove);//根据勾股定理算出两手指之间的距离  
      if (_this.data.olddistance == 0) {
        _this.data.olddistance = distance; //要是第一次就给他弄上值，什么都不操作  
        // console.log("第一次");
      } else {
        _this.data.newdistance = distance; //第二次就可以计算它们的差值了  
        _this.data.diffdistance = _this.data.newdistance - _this.data.olddistance;//两次差值
        _this.data.olddistance = _this.data.newdistance; //计算之后更新比例  
        _this.data.Scale = _this.data.oldscaleA + 0.005 * _this.data.diffdistance;//这条公式是我查阅资料后找到的，按照这条公式计算出来的比例来处理图片，能给用户比较好的体验
        if (_this.data.Scale > 2.5) {//放大的最大倍数
          return;
        } else if (_this.data.Scale < 1) {//缩小不能小于当前
          return;
        }
        //刷新.wxml ，每次相乘，都是乘以图片的显示宽高
        _this.setData({
          height: _this.data.baseHeight * _this.data.Scale,
          width: _this.data.baseWidth * _this.data.Scale
        })
        _this.data.oldscaleA = _this.data.Scale;//更新比例 
      }
    }
  },

  
  getRect: function () {
    var _this = this;
    wx.createSelectorQuery().select('.img').boundingClientRect(function (rect) {
      _this.data.x = Math.abs(rect.left);//x坐标
      _this.data.y = Math.abs(rect.top);//y坐标
      if(_this.data.x == 0){
        _this.data.y = _this.data.y / 375 * _this.data.xx
      }
      else{
        _this.data.x = _this.data.x/400*_this.data.yy
      }
      console.log(rect.left + 'kkk')
    }).exec()

  },
  //手指离开屏幕
  endTou: function (e) {
    this.data.olddistance = 0;//重置
    this.getRect();
  },
  select: function () {
    var _this = this;
    const ctx_A = wx.createCanvasContext('canvas1');
    var baseWidth = _this.data.baseWidth * _this.data.Scale;//图片放大之后的宽
    var baseHeight = _this.data.baseHeight * _this.data.Scale;//图片放大之后的高
    ctx_A.drawImage(_this.data.myimage, _this.data.x, _this.data.y, _this.data.xx, _this.data.yy, 0, 0, 375, 400);//我们要在canvas中画一张和放大之后的图片宽高一样的图片
    ctx_A.draw();
    _this.setData({
      state:2
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bookid:options.bookid
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