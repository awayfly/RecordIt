var starRun = 0;
var countOne = 0;
var countTwo = 0;
var time_count = 0;
var select_time = 0;
var select_time_min = 0;

function data_update(that){

  
  
  if(starRun == 0){
    return;
  }

  if(countOne>=100){
    var time = date_format(countTwo)
    that.updateTime(time)
  }

  setTimeout(function() {
    countOne += 10;
    countTwo += 10;
    select_time_min = select_time * 60 * 1000;
    if (select_time_min == countTwo) {
      starRun = 0;
      return;
    }
    console.log(countOne + countTwo + "LLLLLLLLLLLLLLL")
    data_update(that)
  },10)
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

Page({


  data: {
    count:'0',
    array:['0','1','5','10','20','30','40','50','60'],
    speed:0,
    usetime:'00:00:00',
    accuracy:"未知",
    away:0,
    Calories:0,
    sportTime: '00:00'
  
  },


  onLoad: function (options) {//初始化化界面
    this.getLocation()
    data_update(this)
    

    
  },

  starRun:function(){
    if(starRun == 1){
      starRun = 0;
      data_update(this);
      return;
      this.getLocation()
      data_update(this)
    }
    this.getLocation()
    data_update(this)
    starRun = 1;
    data_update(this)
  },

  updateTime: function (time) {
    console.log(time+"LLLLLLLLL")
    var that = this
    var data = this.data;
    data.time = time;
    this.data = data;
    that.setData({
      usetime: time,
    })

  },
  resetRun:function(){
    var that = this;
    starRun = 0;
    that.setData({
      speed: 111,
      usertime:'00:00:00',
      away:111
    })
  },

  getLocation:function(){
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: function(res) {
        console.log(res)
        wx.setStorage({
          key: 'longitude',
          data: res.longitude,
        })
        wx.setStorage({
          key: 'latitude',
          data: res.latitude,
        })
        that.setData({
          speed:res.speed,
          accuracy:res.accuracy
          
        })
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {},
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