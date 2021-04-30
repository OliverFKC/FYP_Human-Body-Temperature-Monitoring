// app.js
App({
  onLaunch() {
    // Demonstrate local storage capabilities
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // login
    wx.login({
      success: res => {
        // Send res.code to the backend for openId, sessionKey, unionId
      }
    })
    // Obtain user information
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // Already authorized, you can directly call getUserInfo to get the avatar nickname, no pop-up box
          wx.getUserInfo({
            success: res => {
              // Able to send the res to the backend to decode the unionId
              this.globalData.userInfo = res.userInfo

              // Since getUserInfo is a network request, it may not return until after Page.onLoad
              // So a callback is added here to prevent this
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
