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
                  console.log("sportSession值app   :  ")
                  console.log(res.data.sportSession)

                  wx.setStorage({
                    key: 'sportSession',
                    data: res.data.sportSession,
                  })
                  
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


    wx.getWeRunData({
      success: res => {
        wx.setStorage({
          key: 'encryptedData',
          data: res.encryptedData,
        })

        wx.setStorage({
          key: 'iv',
          data: res.iv,
        })



        // wx.request({
        //   url: 'https://xprogram.hczzz.club/sport/sport',
        //   data: {
        //     data: res.encryptedData,
        //     session: wx.getStorageSync("sportSession"),
        //     iv: res.iv,
        //   },
        //   header: {
        //     'content-type': 'application/x-www-form-urlencoded',
        //     'Accept': 'application/json'
        //   },
        //   method: "POST",

        //   success: function (res) {

        //     console.log("运动步数+++++++++=========：：：：：：：：：：")
        //     console.log(res)
        //     console.log("++++++++++++sportSession+++++++++++++++")
        //     console.log(wx.getStorageSync("sportSession"))
        //     console.log("++++++++++++encryptedData+++++++++++++++")
        //     console.log(wx.getStorageSync("encryptedData"))
        //     console.log("++++++++++++++IIIIIIIIIVVVVVVVV+++++++++++++")
        //     console.log(wx.getStorageSync("iv"))

        //   }
        // })
      }
    })
  },
  globalData: {
    userInfo: null
  }
})