// pages/navigator/navigator.js
var wxCharts = require('../../utils/wxcharts.js')
var timeTrans = require('../../utils/util.js')
var app = getApp();
var ringChart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepCount: 0,
    imageid: "",
    calories: 0,
    aimsStep: 0,
    headShowPoint:'',
    foodList: [],
    recordList:false,
    pushFoodName:"",
    pushFoodCalories:"",
    pushFoodImage:"",
    pushData:true
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  charts: function () {
    wx.navigateTo({
      url: '../charts/charts',
    })
  },
  record: function () {
    wx.navigateTo({
      url: '../record/record',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var aimsStep = wx.getStorageSync("aimsStep") === null || wx.getStorageSync("aimsStep") === "" ? 0 : wx.getStorageSync("aimsStep");
    
    that.setData({
      aimsStep: aimsStep,
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
      },
    })

    that.StepCountNum();
    that.headShowInfo();
    that.getReference();

  },


  touchHandler: function (e) {
    var aimsStep = wx.getStorageSync("aimsStep") === null || wx.getStorageSync("aimsStep") === "" ? 0 : wx.getStorageSync("aimsStep");
    if (aimsStep === 0 || aimsStep === NaN) {

      wx.showModal({
        title: '请设置运动目标',
        content: '',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../homepage/userInfo/userInfo',
            })
          }
        }
      })
      return;
    }

    this.onLoad();
    this.onReady();
    wx.navigateTo({
      url: '../navigator/navigator',
    })

    // var tit = ringChart.getCurrentDataIndex(e);
    wx.showToast({
      title: " 更新完成",
    })
  },
/**
 * 用户运动目标完成量环形图，并对不同的情况进行处理
 * 
*/
  onReady: function (e) {
    var windowWidth = 320;
    var aimsStep = wx.getStorageSync("aimsStep") === null || wx.getStorageSync("aimsStep") === "" ? 0 : wx.getStorageSync("aimsStep");

    aimsStep = parseInt(aimsStep);
    var stepToday = wx.getStorageSync("step") === null || wx.getStorageSync("step") === 0 || wx.getStorageSync("step") === "" ? 1 : wx.getStorageSync("step");
    stepToday = parseInt(stepToday);

    var title = "步数完成量";


    if (aimsStep === 0) {
      aimsStep = 1;
      stepToday = 0;
      title = "点我设置目标";
    }
    if (!(aimsStep === 1) && stepToday === 0) {
      title = "点我刷新";
    }


    var amount = stepToday / aimsStep * 100;
    var remaining = aimsStep - stepToday;
    // remaining = remaining === null || remaining === undefined ?1:remaining;

    if (amount == 100) {
      wx.showToast({
        title: '完成目标',
        image: '../../image/crown.png'
      })
    }
    amount = Math.round(amount);
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    ringChart = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      extra: {
        ringWidth: 25,
        pie: {
          offsetAngle: -45
        }
      },
      title: {
        name: amount + "%",
        color: '#7cb5ec',
        fontSize: 25
      },
      subtitle: {
        name: title,
        color: '#666666',
        fontSize: 15
      },
      series: [{
        name: '目标',
        data: remaining,
        stroke: false
      }, {
        name: '完成量',
        data: stepToday,
        stroke: false
      }],
      disablePieStroke: true,
      width: windowWidth,
      height: 200,
      dataLabel: false,
      legend: false,
      background: '#f5f5f5',
      padding: 0
    });
    ringChart.addEventListener('renderComplete', () => {
    });
    setTimeout(() => {
      ringChart.stopAnimation();
    }, 500);

  },


  /**
   * 获取用户运动信息和运动量
  */

  StepCountNum: function () {
    var that = this;
    //获取运动步数
    wx.request({
      url: 'https://xprogram.hczzz.club/sport/sport',
      data: {
        data: wx.getStorageSync("encryptedData"),
        session: wx.getStorageSync("sportSession"),
        iv: wx.getStorageSync("iv"),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: "POST",

      success: function (res) {
        if (res.data === "") {
          wx.showToast({
            title: '点击脚步加载',
            icon: 'loading'
          })
          return;
        }
        console.log(res)

        wx.setStorage({
          key: 'recentStep',
          data: res.data.stepInfoList,
        })

        var stepToDay = res.data.stepInfoList[30].step == null ? 0 : res.data.stepInfoList[30].step
        wx.setStorage({
          key: 'step',
          data: stepToDay,
        })

        that.setData({
          stepCount: stepToDay
        })

      },
      fail: function () {
        wx.showToast({
          title: '检查网络连接',
          icon: 'loading'
        })
      }
    })

    //获取当日建议消耗能量
    wx.request({
      url: 'https://xprogram.hczzz.club/sport/user/suggest',
      data: {
        thirdSession: wx.getStorageSync("thirdSession")
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: "POST",

      success: function (res) {
        if (res.data === "") {
          wx.showToast({
            title: '点击火焰加载',
            icon: 'loading'
          })
          return;
        }
        console.log(res.data)
        that.setData({
          calories: res.data.suggest
        })
      },
      fail: function () {
        wx.showToast({
          title: '检查网络连接',
          icon: 'loading'
        })
      }

    })
  },
  /**
   * 点击图片刷新
   * 
  */
  stepRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    this.StepCountNum();

  },

  recentStep:function(){
    wx.navigateTo({
      url: '../recentStep/recentStep',
    })
  },
/**
 * 初始化加载用户当日记录的饮食信息
 * 
*/
headShowInfo:function(){
  var that = this;
  var headShow = wx.getStorageSync("headShow") === "" ? {
    "timestamp": "",
    "imageId": "",
    "tempFilePaths": "",
    "foodName": "",
    "calories": "",
  } : wx.getStorageSync("headShow");
  if (wx.getStorageSync("headShow") === ""){
    that.setData({
      recordList:true
    })

    return;
  }else{
    that.setData({
      recordList: false
    })
  }

 

  var timestampFood;
  var timestampNow = timeTrans.AutoYMDteanstats();
  var timestampNowValue = timestampNow[1];
  var newHeadShow = [];
  var j = 0;
  for (var i = 0; i < headShow.length; i++){
    
    if (headShow[i].timestamp === timestampNowValue){
      
      newHeadShow[j] = headShow[i];
      j++;
    }
  }

  that.setData({
    foodList: newHeadShow,
  })
  console.log("首页现实的记录信息")
  console.log(that.data.foodList)

},

  jumpRecord:function(){
    wx.navigateTo({
      url: '../record/record',
    })

  },


  getReference:function(){
   var that = this
    var latitude = wx.getStorageSync("latitude");
    var longitude = wx.getStorageSync("longitude");

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
        console.log(res.data);
        if(res.data.flag === false){
          return;
        }
      
        wx.setStorage({
          key: 'weight',
          data: res.data.info.weight,
        })

        wx.setStorage({
          key: 'height',
          data: res.data.info.height,
        })
      }

    })
    //判断如果身高体重信息未录入，就不会进行推荐
    if (wx.getStorageSync("weight") === "" || wx.getStorageSync("weight") === 0 || wx.getStorageSync("height") === "" || wx.getStorageSync("height") === 0) {
      return;
    }else{

    wx.request({
      url: 'https://xprogram.hczzz.club/sport/user/getReference',
      data: {
        thirdSession: wx.getStorageSync("thirdSession"),
        latitude: latitude,
        longitude:longitude
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: "POST",
      success:function(res){
        
        console.log("获取推荐信息")
        console.log(res)
        var refer = res.data.refer;
        if(!(refer === null)){
          that.setData({
            pushData:false,
          })
        }

        if (refer === null) {
         return;
        }
        console.log(refer)
        var con = JSON.parse(refer)
        console.log(con.dishs[0].dishName)
        that.setData({
          pushFoodName: con.dishs[0].dishName,
          pushFoodCalories: con.dishs[0].calories,
          pushFoodImage:"https://xprogram.hczzz.club/sport/file/?imgId="+ con.dishs[0].imageid
        })

      }
    })
    }
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
    this.onLoad();
    this.onReady();
    wx.stopPullDownRefresh();
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