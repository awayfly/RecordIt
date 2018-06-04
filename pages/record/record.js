// pages/record/record.js
var timeTrans = require('../../utils/util.js')
Page({

  /**  
   * 页面的初始数据
   */
  data: {
    tempFilePaths: null,
    autoFilePath: 'https://xprogram.hczzz.club/sport/file/?imgId=297ebc2d63bf91ba0163c9ae1087002c',
    time: "7:00",
    foodList: [],
    food: "",
    count: 0,
    countList: "",
    viewList: 0,
    viewNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // var count = { "flag": true, "data": "{\"result\":[{\"probability\":\"0.4825\",\"has_calorie\":true,\"calorie\":\"86\",\"name\":\"番茄炒蛋\"},{\"probability\":\"0.230094\",\"has_calorie\":true,\"calorie\":\"86\",\"name\":\"西红柿炒鸡蛋\"},{\"probability\":\"0.188171\",\"has_calorie\":true,\"calorie\":\"81\",\"name\":\"西红柿炒蛋\"},{\"probability\":\"0.0578027\",\"has_calorie\":true,\"calorie\":\"195\",\"name\":\"炒鸡蛋\"}],\"log_id\":6294263209864868207,\"result_num\":5}", "id": "297ebc2d63bf91ba0163c96807e20026", "message": "上传成功~" }

    // var data1 = JSON.parse(count.data);
    // console.log(data1)
    // console.log(data1.result[0].probability);
    // var autoFilePath = this.autoFilePath

    that.setData({
      tempFilePaths: '../../image/foodBack.png',
      foodList: [],

      //"http://tmp/wx2e8ecc979a8870fe.o6zAJs_azUdkUbYjF1Hto9ih0SNs.7FAJ7DiWFO5U08c7191a180267ebb2c43a0e8d5de62a.jpg",
      // foodList: data1.result,
      count: 0,
      // countList: data1,
    })

  },


  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  /**
   * 用户选择后进行提交到服务器保存
  */

  bindsubmitTap: function (e) {
    var that = this;
    console.log(e.detail.value);
    var count = e.detail.value.num;
    console.log(count)
    if (count === "") {
      wx.showToast({
        title: '选择食物',
      })
      return;
    }
    var weight = e.detail.value.weight;
    if (weight === "" || weight < 0) {
      wx.showToast({
        title: '重量错误',
      })
      return;
    }
    var timestamp = timeTrans.AutoYMDteanstats();/**获取当前日期的时间戳，不包括时分秒*/
    var foodData = this.data.foodList[count];
    var aa = {
      data: timestamp[1], "dishs": [{ "dishName": foodData.name, "amount": foodData.weight, "calories": foodData.calorie}],"sport": {"step":"2333", "heat":"2333"
      }
}

var data11 = JSON.stringify(aa);
console.log(data11)

    wx.request({
      url: 'https://xprogram.hczzz.club/sport/info',
      data: {
        thirdSession: wx.getStorageSync("thirdSession"),
        data:data11
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: "POST",
      success: function (res) {
        console.log(res)

        if (res.data.flag === false) {
          wx.showToast({
            title: '',
          })
        }
      },
    })

  },
  /**
   * 上传图片进行识别，并显示返回值让用户选择
   * 
  */
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        that.setData({
          tempFilePaths: res.tempFilePaths,
        })
        var tempFilePath = res.tempFilePaths[0];

        console.log(tempFilePath);
        var SessionKey = wx.getStorageSync("thirdSession");
        console.log("////////////////////////////////");
        console.log(SessionKey);

        wx.showToast({
          title: '识别中…',
          icon: 'loading',
          duration: 2000
        })

        wx.uploadFile({
          url: 'https://xprogram.hczzz.club/sport/file', //接口地址
          filePath: tempFilePath,
          name: 'file',
          formData: {
            'thirdSession': SessionKey,
          },
          success: function (res) {
            console.log("IDDDDDDDDDDD=++++++++++++");
            console.log(res);
            console.log(res.data);
            console.log("statusCode的值");
            console.log(res.statusCode);

            var data0 = JSON.parse(res.data);

            if (data0.flag === false) {
              wx.showToast({
                title: '请重新选择',
                image: '../../image/error.png'
              })
              that.onLoad();
              return;
            }


            var data1 = JSON.parse(res.data).data;
            console.log("data1的数据是");
            console.log(data1);

            var results = JSON.parse(data1);
            if (results.result.length < 1) {
              wx.showToast({
                title: '请重新选择',
                image: '../../image/error.png',
              })

              that.onLoad();
              that.setData({
                count: 0,
              })
              return;
            } else {
              wx.showToast({
                title: '识别成功',
              })
            }

            that.setData({
              imageid: "https://xprogram.hczzz.club/sport/file/" + res.data.id,
              foodList: results.result,
              countList: results,
              count: 1,
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
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