//app.js
var sessionKey;
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    var that = this
    wx.setStorageSync('logs', logs)
    //获取运动步数
    wx.getWeRunData({

      success: res => {
        //console.log("encryptedData值：      ")
        //console.log(res.encryptedData)
        console.log("iv值app   :  " + res.iv)
      }
    })
  
        // 登录
        wx.login({
          success: logincode => {
            if (logincode.code) {
              //发起网络请求
              wx.request({
                url: 'https://xprogram.hczzz.club/sport/user/judge',//
                //url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx2e8ecc979a8870fe&secret=4d0d917f7363fc9441e219200c930776&js_code=' + logincode.code + '&grant_type=authorization_code',
                data: {
                  js_code: logincode.code,
                  session: wx.getStorageSync("sessionKey")
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Accept': 'application/json'
                },
                method: "POST",
                success: function (res) {
                  console.log(res)
                  console.log("code值app   :  " + logincode.code)
                  // console.log("data值app   :  " + res.data.message)
                  // console.log("sessionKey值app   :  " + res.data.sessionKey)
                  // console.log("thirdSession值app   :  " + res.data.thirdSessionId)
                  
                  //存储登录状态
                  wx.setStorage({
                    key: 'Loginmessage',
                    data: res.data.message,
                  })
                  //存储sessionKey到缓存中
                  wx.setStorage({
                    key: 'sessionKey',
                    data: res.data.sessionKey,
                  })
                  //存储thirdSession到缓存中
                  wx.setStorage({
                    key: 'thirdSession',
                    data: res.data.thirdSessionId,
                  })
                  if (that.userSessionReadyCallback) {
                    that.userSessionReadyCallback(res)
                  }
                }
              })
            } else {
              console.log('登录失败！' + logincode.errMsg)
            }
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
          }
        })
    

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
        
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})