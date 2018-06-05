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
    headShow:[],
    imageid:'',
    calories:'',
    imageLink:'',

    primaryKey:"",
    food: "",
    count: 0,
    countList: "",
    viewList: 0,
    viewNum: 1,
    weight: 0,
    height: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      tempFilePaths: '../../image/foodBack.png',
      foodList: [],
      count: 0,
    })


    wx.getLocation({
      type: 'wgs84',
      success: function (res) {

        wx.setStorage({
          key: 'latitude',
          data: res.latitude,
        })

        wx.setStorage({
          key: 'longitude',
          data: res.longitude,
        })
        console.log(res.latitude + "   LLLL   " + res.longitude)
      },
    })

  },


  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  /**
   * 用户选择后进行提交到服务器保存
  */

  bindsubmitTap: function (e) {
    console.log("提交的用户记录食物信息-->>")
    console.log(e.detail.value)
    var that = this;


    var count = e.detail.value.num;
    if (count === "") {
      wx.showToast({
        title: '选择食物',
      })
      return;
    }
    var weightValue = e.detail.value.weight;
    if (weightValue === "" || weightValue < 0) {
      wx.showToast({
        title: '填写重量',
      })
      return;
    }


    var height = 0;
    var weight = 0

    /**获取用户体貌信息*/
    wx.request({
      url: 'https://xprogram.hczzz.club/sport/user', 
      data: {
        thirdSession: wx.getStorageSync("thirdSession")
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: "GET",
      success: function (res) {

        weight = res.data.info.weight == null ? 0 : res.data.info.weight;
        height = res.data.info.height == null ? 0.0 : res.data.info.height;
        if (height === 0 || weight === 0) {
          wx.showModal({
            title: '请录入个人信息',
            content: '',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../info/info',
                })
              }
            }
          })
          return;
        }
        wx.setStorage({
          key: 'weight',
          data: that.weight,
        })
      }

    })

    //
    var latitude = wx.getStorageSync("latitude") === null ? 0 : wx.getStorageSync("latitude");
    var longitude = wx.getStorageSync("longitude") === null ? 0 : wx.getStorageSync("longitude");

    var step = wx.getStorageSync("step");
    var stepLength = (height - 1559.911) / 0.262;
    var primaryKeyData = wx.getStorageSync("primaryKeyData") === "" ? { "primaryKey": "", "timestratamp": "" } : wx.getStorageSync("primaryKeyData");
    var jsonPrimaryKey = JSON.stringify(wx.getStorageSync("primaryKeyData"));
    console.log("缓存中存储的关于主键的信息0000001-->>");
    console.log(jsonPrimaryKey)

    console.log("缓存中存储的关于主键的信息-->>");
    console.log(primaryKeyData)

    var timeNew = timeTrans.AutoYMDteanstats();
    var timeNewValue = timeNew[1];
    var timestratampValue = primaryKeyData.timestratamp === "" ? "" : primaryKeyData.timestratamp;
    var primaryKeyValue ;
    
    if (timeNewValue === timestratampValue){
      primaryKeyValue = primaryKeyData.primaryKey;
      console.log("当天的主键有主键的时候-->>")
      console.log(primaryKeyValue)
    }else{
      primaryKeyValue = "";
    }
    console.log("当天的主键-->>")
    console.log(primaryKeyValue)

    var imageid = that.data.imageid;
    console.log("获取当前图片的id");
    console.log(imageid)
    console.log(that.data.imageid)
    

    var heat = step * stepLength / 10000 * weight;
    var timestamp = timeTrans.AutoYMDteanstats();/**获取当前日期的时间戳，不包括时分秒*/
    var foodData = this.data.foodList[count];
    console.log("存储在数组中的食物信息")
    console.log(foodData);
    var jsonString = {
      "date": timestamp[1], "dishs": [{ "dishName": foodData.name, "amount": weightValue, "calories": foodData.calorie, "imageid": imageid}], "sport": {
        "step": step, "heat": heat
      }, "latitude": latitude, "longitude": longitude
    }

    var data11 = JSON.stringify(jsonString);
    console.log("json化后的数据");
    console.log(data11)
    /**
     * 将当天上传信息存储在缓存中，在主页加载
     * 
    */
    var tempFilePaths = that.data.tempFilePaths;
    var headShow = {
      "timestamp": timeNewValue,
      "imageid": imageid,
      "tempFilePaths": tempFilePaths,
      "foodName": foodData.name,
      "calories": foodData.calorie,
      "weight": weightValue}
    console.log("存入缓存的食物信息用于主页");
    console.log(headShow)

      wx.setStorage({
        key: 'headShow',
        data: headShow,
      })

    wx.request({
      url: 'https://xprogram.hczzz.club/sport/info',
      data: {
        thirdSession: wx.getStorageSync("thirdSession"),
        id: primaryKeyValue,
        data: data11
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: "POST",
      success: function (res) {

        if (res.data.flag === true) {
          wx.showToast({
            title: '提交成功',
          })

          that.onLoad();
        }else{
          wx.showToast({
            title: '请重新提交',
          })
        }

        console.log("上传用户选择的食物信息后返回的信息");
        console.log(res)

        var primaryKey = res.data.id;
        var timestratampKey = timeTrans.AutoYMDteanstats();
        var timestratamp = timestratampKey[1];
        var primaryKeyData = { "primaryKey": primaryKey, "timestratamp": timestratamp}

        console.log("存储时主键的值-->>")
        console.log(primaryKeyData)
        that.setData({
          primaryKey: primaryKey,
        })
        wx.setStorage({
          key: 'primaryKeyData',
          data: primaryKeyData,
        })
        
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

        var SessionKey = wx.getStorageSync("thirdSession");

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
            "id":''
          },
          success: function (res) {

            
            

            var data0 = JSON.parse(res.data);

            console.log("上传图片的返回信息")
            console.log(res)

            console.log("上传图片的id")
            console.log(data0)
            console.log(data0.id)
            var imgid = data0.id

            that.setData({
              imageid: imgid,
            })

            console.log("在获取一次id")
            console.log(that.data.imageid)

            if (data0.flag === false) {
              wx.showToast({
                title: '请重新选择',
                image: '../../image/error.png'
              })
              that.onLoad();
              return;
            }


            var data1 = JSON.parse(res.data).data;
          

            var results = JSON.parse(data1);
            console.log("请求返回食物信息")
            console.log(results.result)
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
              imageLink: "https://xprogram.hczzz.club/sport/file/" + res.data.id,
              foodList: results.result,
              countList: results,
              count: 1,
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
        
      }
    })
  },

  getUserInfo: function () {
    var that = this;
    wx.request({
      url: 'https://xprogram.hczzz.club/sport/user', //仅为示例，并非真实的接口地址
      data: {
        thirdSession: wx.getStorageSync("thirdSession")
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: "GET",
      success: function (res) {


        that.setData(
          {
            weight: res.data.info.weight == null ? 0 : res.data.info.weight,
            height: res.data.info.height == null ? 0.0 : res.data.info.height,
          }
        )
        wx.setStorage({
          key: 'weight',
          data: that.weight,
        })
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