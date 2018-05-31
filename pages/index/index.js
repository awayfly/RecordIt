var starRun = 0;
var countOne = 0;
var countTwo = 0;
var time_count = 0;
var select_time = 0.1;
var select_time_min = 0;
var oriMeters = 0.0;

function data_update(that) {



  if (starRun == 0) {
    return;
  }

  if (countOne >= 500) {
    var time = date_format(countTwo)
    that.updateTime(time)
  }
  if (countOne % 500 == 0)
    that.getLocation()

  setTimeout(function () {

    countOne += 10;
    countTwo += 10;
    select_time_min = select_time * 60 * 1000;
    if (select_time_min == countTwo - 10 && countTwo > 20) {
      starRun = 0;
      wx.showToast({
        title: '预设目标达成！！！',
        icon:'success',
      })
      return;
    }

    // console.log(countOne + countTwo + "LLLLLLLLLLLLLLL")
    data_update(that)
  }, 10)
}



function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;


  return hr + ":" + min + ":" + sec + " ";
}

function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

function getDistance(lat1, lng1, lat2, lng2) {
  var dis = 0;
  var radLat1 = toRadians(lat1);
  var radLat2 = toRadians(lat2);
  var deltaLat = radLat1 - radLat2;
  var deltaLng = toRadians(lng1) - toRadians(lng2);
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
  return dis * 6378137;

  function toRadians(d) { return d * Math.PI / 180; }
}

Page({


  data: {
    count: '0',
    array: ['0', '1', '5', '10', '20', '30', '40', '50', '60'],
    speed: 0,
    usetime: '00:00:00',
    accuracy: "未知",
    away: 0,//跑步里程
    Calories: 0,
    sportTime: '00:00',
    postion: [],//坐标位置存储数组，只存储两个数据项，计算两次的距离差值


  },


  onLoad: function (options) {//初始化化界面

    var that = this
    wx.getLocation({
      success: function (res) {
        that.setData({
          accuracy: res.accuracy
        })
      },
    })

  },

  starRun: function () {
    if (starRun == 1) {
      starRun = 0;
      data_update(this);
      return;
    }
    starRun = 1;
    data_update(this)
  },

  updateTime: function (time) {

    var that = this

    var data = this.data;
    data.time = time;
    this.data = data;
    that.setData({
      usetime: time,
    })

  },
  resetRun: function () {
    var that = this;
    starRun = 0;
    countOne = 0;
    countTwo = 0;
    data_update(this)
    that.setData({
      speed: 0.00,
      usetime: '00:00:00',
      away: 0.00,
      accuracy: 0.0
    })
  },

  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: function (res) {

        // var NewLocal = {
        //   NewLongitude : res.longitude,//经度
        //   NewLatitude : res.latitude//纬度
        // };

        // console.log(NewLocal+"NewLoCalllllLLLLLLLLLLL")

        // var LocalPostion = that.data.postion

        // if(LocalPostion.length == 0){
        //   LocalPostion.push(NewLocal)
        // }

        // if(LocalPostion.length > 2){
        //   LocalPostion.splice(0, 1)
        // }

        // console.log(LocalPostion +"经纬度存储数组")
        // var LastLocalPost = LocalPostion[LocalPostion.length - 1]


        var newCover = {
          latitude: res.latitude,
          longitude: res.longitude,
        };
        var oriCovers = that.data.postion;

        var len = oriCovers.length;
        var lastCover;
        if (len == 0) {
          oriCovers.push(newCover);
        }

        if (len >= 2) {
          oriCovers.splice(0, 1)
        }
        len = oriCovers.length;
        var lastCover = oriCovers[len - 1];

        console.log("Speed----------")
        console.log(res.speed.toFixed(2));

        var newMeters = getDistance(lastCover.latitude, lastCover.longitude, res.latitude, res.longitude) / 1000;
        oriCovers.push(newCover)

        oriMeters = oriMeters + newMeters;


        var meters = new Number(oriMeters);
        // console.log("meters----------")
        // console.log(meters);
        var showMeters = meters.toFixed(2);


        that.setData({
          speed: ((res.speed) * 3.6).toFixed(2) < 0 ? "0.00" : ((res.speed) * 3.6).toFixed(2),
          accuracy: (res.accuracy).toFixed(1),
          postion: oriCovers,
          away: showMeters
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) { },
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var i = e.detail.value;
    select_time = this.data.array[i]
    this.setData({
      count: e.detail.value
    })
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    select_time_min = select_time * 60 * 1000;
    if (select_time_min == countTwo) {
      starRun = 0;
      return;
    }
  },

})