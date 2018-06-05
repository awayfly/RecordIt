// pages/homepage/userInfo/userInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aimsStep: 0,
    disabled:false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var aimsStep = wx.getStorageSync("aimsStep") === 0 || wx.getStorageSync("aimsStep") === null ? 0 : wx.getStorageSync("aimsStep");

    that.setData({
      aimsStep: aimsStep,
    });

  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value.aimsStep);
    var stepS = e.detail.value.aimsStep;


    wx.setStorage({
      key: 'aimsStep',
      data: stepS === 0 || stepS === "" ? 0 : stepS,
    })
    if (stepS === "0"  || stepS === "") {
      wx.showToast({
        title: '请输入步数',
        image: '../../../image/error.png'
      })

      return;
    } else {
      wx.showToast({
        title: '设置成功',
      })
    }

  },


  disabled:function(e){
    var num = e.detail.value
    var stepnum = wx.getStorageSync("aimsStep") === 0 ? 0 : wx.getStorageSync("aimsStep");

    if(num === stepnum || num === "0" || num === ""){
      this.setData({
        disabled:false,
      })
    }else{
      this.setData({
        disabled: true,
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