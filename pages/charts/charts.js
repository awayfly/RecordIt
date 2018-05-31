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
    timesstamps: [],//时间戳
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
    var categories = [];
    var data = [];
    for (var i = 0; i < 1; i++) {
      for (var j = 0; j < 10; j++) {
        categories.push('2018-' + (i + 1) + "-" + (j + 1));
        data.push(Math.random() * (20 - 10) + 10);
      }
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

    this.DrawCharts(1);
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
        var consumptionK = [];//
        var intakeK = [];
        var timesstampsK = [];

        

          for (let i = 0; i < 7; i++) {
            if (res.data.data[i] == null)
              break;
            let count = 0;
            for (let j = 0; j < 3; j++) {
              
              count += res.data.data[i].dishs[j].amount * res.data[i].dishs[j].calories;
            }
            intakeK[i] = count;
            consumptionK[i] = res.data[i].sport.heat;
            timesstampsK[i] = timeTrans.timetransYMD(res.data[i].date);//将时间戳转化为YMD格式
          }

        console.log(res)
        that.setData({
          consumption: consumptionK,//运动量/天
          intake: intakeK,//摄入量
          timesstamps: timesstampsK//时间戳
        })
      }

    })

    wx.request({/*请求推荐运动量*/
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
        console.log(res.data.message + "KKKKKKK")
        console.log(res.data.suggest + "请求推荐运动量")
        var RecAmountK = [];
        for (let i = 0; i < 10; i++) {
          RecAmountK = res.data.suggest
        }
        that.setData({
          RecAmount: RecAmountK
        })
      }
    })
  },
  /**
   * 图表加载选择配置
  */
  DrawCharts: function (num) {
    if (num == 1) {
      this.RequestEnergy(num);/*默认加载日期的数据*/
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
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '摄入量',
        data: simulationData.data,//this.data.intake,//
        format: function (val, name) {
          return val.toFixed(2) + '千卡';
        }
      }, {
        name: '运动量',
        data: [2, 30, 0, 3, null, 4, 0, 0, 2, 0],//this.data.consumption,//
        format: function (val, name) {
          return val.toFixed(2) + '千卡';
        }
      },
      {
        name: '推荐量',
        data: this.data.RecAmount,//[2, 1, 2, 3, 4, 4, 0, 0, 2, 0],//
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