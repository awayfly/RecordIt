// pages/recentStep/recentStep.js
var timeTrans = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recentStep: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.timeTranslate();

  },

  timeTranslate:function(){
    var recentStep = [];
    recentStep = wx.getStorageSync("recentStep")
    console.log(recentStep);
    var timestampPoint;
    for (var i = 0; i < recentStep.length; i++) {

      timestampPoint = timeTrans.timetransYMD((recentStep[i].timestamp) * 1000);
      recentStep[i].timestamp = timestampPoint;
    }
    var recentStep0 = [];
    var k = 0;
    for (var j = recentStep.length;j>0;j--){
      recentStep0[j-1] = recentStep[k];
      k++;
    }

    this.setData({
      recentStep: recentStep0,
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