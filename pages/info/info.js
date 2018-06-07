// pages/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weight:0,
    height:0.0,
    age:0,
    sex:["女","男"],
    sexIndex:0,
    weightChange:false,
    heightChange:false,
    ageChange:false,
    sexChange:false,
    temp:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.request({
      url: 'https://xprogram.hczzz.club/sport/user', //仅为示例，并非真实的接口地址
      data: {
        thirdSession: wx.getStorageSync("thirdSession")
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method:"GET",
      success: function (res) {
        console.log(res.data);
        that.setData(
          {
            weight: res.data.info.weight == null ? 0 : res.data.info.weight,
            height: res.data.info.height == null ? 0.0 : res.data.info.height,
            age: res.data.info.age == null ? 0 : res.data.info.age,
            sexIndex: res.data.info.sex == null ? 0 : res.data.info.sex,
            temp:res.data.info        
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
  
  },

  submitUserInfo:function(){
    var template = "{\"sex\":" + this.data.sexIndex + ",\"height\":" + this.data.height + ",\"weight\":" + this.data.weight+",\"age\":"+this.data.age+"}";
    wx.request({
      url: 'https://xprogram.hczzz.club/sport/user', //仅为示例，并非真实的接口地址
      data: {
        info:template,
        "_method":"PUT",
        "thirdSession":wx.getStorageSync("thirdSession")
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      method: "POST",
      success: function (res) {
        console.log(res.data);
        if(res.data.flag === true){
          wx.showToast({
            title: '保存成功',
            icon:'success'
          })
        }
      }
    })
  },

  height:function(e){
    var flag=true;
    var height = this.data.temp.height == null ? 0 : this.data.temp.height;
    if(e.detail.value!=height){
      flag=true;
      this.setData({
        heightChange: flag,
        height: e.detail.value
      })
    }else{
      flag=false;
      this.setData({
        heightChange: flag,
        height: e.detail.value
      })
    }
  },

  weight: function (e) {
    var flag = true;
    var weight = this.data.temp.weight == null ? 0.0 : this.data.temp.weight;
    if (e.detail.value != weight) {
      flag = true;
      this.setData({
        weightChange: flag,
        weight: e.detail.value
      })
    } else {
      flag = false;
      this.setData({
        weightChange: flag,
        weight: e.detail.value
      })
    }
  },

  age: function (e) {
    var flag = true;
    var age = this.data.temp.age == null ? 0 : this.data.temp.age;
    
    if (e.detail.value != age) {
      flag = true;
      this.setData({
        ageChange: flag,
        age: e.detail.value
      })
    } else {
      flag = false;
      this.setData({
        ageChange: flag,
        age: e.detail.value
      })
    }
  },

  sex: function (e) {
    var flag = true;
    var sex = this.data.temp.sex == null ? 0 : this.data.temp.sex;

    if (e.detail.value != sex) {
      flag = true;
      this.setData({
        sexChange: flag,
        sexIndex: e.detail.value
      })
    } else {
      flag = false;
      this.setData({
        sexChange: flag,
        sexIndex: e.detail.value
      })
    }
  }
})