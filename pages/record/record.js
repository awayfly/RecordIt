// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: "",
    time: "7:00",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },


  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },










  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
        var tempFilePath = res.tempFilePaths[0];

        var SessionKey = wx.getStorageSync("thirdSession");
        console.log("////////////////////////////////")
        console.log(SessionKey)


        // wx.uploadFile({
        //   url: 'https://xprogram.hczzz.club/sport/file', //接口地址
        //   filePath: tempFilePath,
        //   name: 'file',
        //   formData: {
        //     'thirdSession': SessionKey
        //   },
        //   success: function (res) {
        //     var data = res.data
        //     console.log(res.data+"IDDDDDDDDDDD")
        //     that.setData({
        //       imageid:"https://xprogram.hczzz.club/sport/file/"+res.data.id
        //     })
        //     //do something
        //   },
        //   fail: function (res) {
        //     console.log(res)
        //   }
        // })
        console.log("res__MSG:")
        console.log(res)
      }
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