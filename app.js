// app.js
const storage = require('./utils/storage.js');

App({
  onLaunch() {
    // 初始化存储
    storage.initStorage();

    // 应用设置
    const settings = storage.getSettings();
    if (settings.darkMode) {
      wx.setBackgroundColor({
        backgroundColor: '#1C1C1C',
        backgroundColorTop: '#1C1C1C',
        backgroundColorBottom: '#1C1C1C'
      });
    }
  },

  globalData: {
    settings: null
  }
})