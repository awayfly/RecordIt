// pages/charts/charts.js
var wxCharts = require('../../utils/wxcharts.js')
var timeTrans = require('../../utils/util.js')
var app = getApp();
var lineChart = null;
var date = new Date();
Page({
  data: {
    intake: [],//摄入量/天
    consumption: [],//运动量/天
    RecAmount: [],//推荐量/天
    Alltimes: [],//时间戳
    allSpoetData: [],
    allData: [],
    dataYMDStar: null,
    dataYMDEnd: ""
  },
  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  createSimulationData: function () {
    var that = this;
    var AlltimesAAA = that.data.Alltimes;
    var categories = [];
    var data = [];
    for (var i = 0; i < AlltimesAAA.length; i++) {
      categories.push(AlltimesAAA[i]);
      data.push(Math.random() * (20 - 10) + 10);

    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },
  updateData: function () {
    if (this.data.dataYMDStar == null) {
      wx.showToast({
        title: '请选择起始日期',
      })
      return;
    }
    this.DrawCharts(2);/*更新参数*/

  },

  /*页面初始化
  */
  onLoad: function (e) {
    this.RequestEnergy(1);

  },
  /**
   * 用户选择起始时间
   * 
  */
  bindDateChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dataYMDStar: e.detail.value,
    })
  },
  bindDateChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dataYMDEnd: e.detail.value
    })
  },
  /**
   * 请求服务器参数，格式化后存入数组中
   * 
  */
  RequestEnergy: function (num) {
    var that = this;
    var starData;
    var endData;

    var allDate;


    if (num == 1) {
      allDate = timeTrans.AutoYMDteanstats();
      starData = allDate[0];
      endData = allDate[1];
    } else if (num == 2) {
      allDate = timeTrans.YMDteanstats(that.data.dataYMDStar + " 00:00:00");
      starData = allDate[0];
      endData = allDate[1];
    } else {
      console.log("请求类型错误")
      return;
    }
    console.log("allDate:+++++" + allDate)

    wx.request({/*请求获取图表信息 运动量 摄入量 时间戳*/
      url: 'https://xprogram.hczzz.club/sport/info',
      data: {
        thirdSession: wx.getStorageSync("thirdSession"),
        starttime: starData,
        endtime: endData
        //times: "[1510329600]"// allDate
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: "GET",
      success: function (res) {
        if (res.data.flag === false) {
          wx.showToast({
            title: '加载失败',
            image: '../../image/error.png.svg'
          })
          return;
        }
        var startTime = allDate[0];//
        var endTime = allDate[1];
        var timeAdd = 24 * 60 * 60;
        var AllTime = [];
        var allSpoetData = [];
        for (var j = 0; j < 7; j++) {
          if (j === 0) {
            AllTime[j] = allDate[0];
            break;
          }
          if (j === 6) {
            AllTime[j] = allDate[1]
          }
          AllTime[j] = startTime + timeAdd;
          timeAdd = timeAdd * j;
        }

        var dataList = res.data.data;
        console.log("dataList>>>>>>>>>>>>>>>")
        console.log(dataList)


        var timeIn;
        var l = 0;
        for (var k = allDate[0]; k <= endTime;) {
          timeIn = timeTrans.timetransYMD(k * 1000);
          if (dataList[k] === null) {

            allSpoetData[l] = { "data": timeIn, "FoodAllcalories": 1, "StepCalories": 1 };
          }
          if (!(dataList[k] === null)) {
            var stri = dataList[k];
            stri = JSON.stringify(stri)
            stri = JSON.parse(stri);

            var weight = stri.user.weight
            stri = JSON.parse(stri.info);
            var step = stri.sport.step;
            console.log(stri)
            console.log(stri.dishs)

            var FoodAllcalories = 0;
            for (var m = 0; m < stri.dishs.length; m++) {
              console.log("stri.dishs[m].amount的值")
              console.log(stri.dishs[m].amount)
              var FoodAmount;
              FoodAmount = stri.dishs[m].amount === null || stri.dishs[m].amount === undefined ? 100 : stri.dishs[m].amount;
              FoodAmount = parseInt(FoodAmount)
              FoodAmount = FoodAmount.toFixed(1);
              console.log(FoodAmount)
              FoodAllcalories = FoodAllcalories + stri.dishs[m].calories * FoodAmount / 100;
              FoodAllcalories = FoodAllcalories.toFixed(1);
              console.log(FoodAllcalories)
            }
            var StepCalories;

            var stepLength = 65;
            StepCalories = 65 * step / 100000 * weight * 0.8214;


            allSpoetData[l] = { "data": timeIn, "FoodAllcalories": FoodAllcalories, "StepCalories": StepCalories };
          }
          l++;
          k = k + timeAdd;
        }

        var intake = [];//摄入量/天
        var consumption = [];//运动量/天
        var AlltimesAAA = [];//时间戳

        for (var n = 0; n < allSpoetData.length; n++) {

          intake[n] = allSpoetData[n].FoodAllcalories;
          consumption[n] = allSpoetData[n].StepCalories;
          AlltimesAAA[n] = allSpoetData[n].data;

        }

        console.log("过滤后的用户数据")
        console.log(allSpoetData);

        that.setData({
          allSpoetData: allSpoetData,
          consumption: consumption,//运动量/天
          intake: intake,//摄入量
          Alltimes: AlltimesAAA//时间戳
        })

        for (var v = 0; v < 1; v++) {
          if (num === 1) {
            that.DrawCharts(1);
          }
        }
      }

    })


  },
  /**
   * 图表加载选择配置
  */
  DrawCharts: function (num) {
    var that = this;
    if (num == 1) {
      // this.RequestEnergy(num);/*默认加载日期的数据*/
    } else if (num == 2) {
      this.RequestEnergy(num);/*默认加载日期的数据*/
    } else {
      console.log("图表加载选项错误")
      return;
    }


    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationData();
    var con = that.data.consumption;
    var intt = that.data.intake;
    console.log(con + " 图表更新数据 " + intt)
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',  
      series: [{
        name: '摄入量',
        data: intt,//simulationData.data,//that.data.intake,//
        format: function (val, name) {
          return val.toFixed(2) + '千卡';
        }
      }, {
        name: '运动量',
        data: con,//[2, 30, 0, 3, null, 4, 0, 0, 2, 0],//that.data.consumption,//
        format: function (val, name) {
          return val.toFixed(2) + '千卡';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '能量 (千卡)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  }
});