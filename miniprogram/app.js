App({
  onLaunch: function () {
    wx.cloud.init({
      traceUser: true
    })
  }
})
