// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    speed:0,
    usetime:'00:00:00',
    accuracy:"未知",
    away:0,
    Calories:0
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var latitude
    var longitude
    var speed
    var accuracy
    var horizontalAccuracy
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        latitude = res.latitude
        longitude = res.longitude
        speed = res.speed
        accuracy = res.accuracy
        horizontalAccuracy = res.horizontalAccuracy
        that.setData({
          away: horizontalAccuracy,
          speed:speed,
          accuracy:accuracy
        })
      }
    })
  
  },
  resetOn:function(){
    wx.navigateTo({
      url: '../navigator/navigator',
    })
  },
  starRun: function () {
    if (starRun == 1) {
      return;
    }
    starRun = 1;
    count_down(this);
    this.getLocation();
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