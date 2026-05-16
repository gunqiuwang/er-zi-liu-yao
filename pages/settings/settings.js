// pages/settings/settings.js
Page({
  data: {
    darkMode: false,
    soundEnabled: true,
    fontStyle: 'serif', // serif, sans-serif
    language: 'zh-CN'
  },

  onLoad() {
    // 读取设置
    const settings = wx.getStorageSync('settings') || {};
    this.setData({
      darkMode: settings.darkMode || false,
      soundEnabled: settings.soundEnabled !== false,
      fontStyle: settings.fontStyle || 'serif',
      language: settings.language || 'zh-CN'
    });
  },

  toggleDarkMode() {
    const newValue = !this.data.darkMode;
    this.setData({ darkMode: newValue });
    this.saveSettings();

    // 应用深色模式
    if (newValue) {
      wx.setBackgroundColor({ backgroundColor: '#1C1C1C', backgroundColorTop: '#1C1C1C', backgroundColorBottom: '#1C1C1C' });
    } else {
      wx.setBackgroundColor({ backgroundColor: '#F7F4EE', backgroundColorTop: '#F7F4EE', backgroundColorBottom: '#F7F4EE' });
    }
  },

  toggleSound() {
    const newValue = !this.data.soundEnabled;
    this.setData({ soundEnabled: newValue });
    this.saveSettings();
  },

  selectFont(e) {
    const font = e.currentTarget.dataset.font;
    this.setData({ fontStyle: font });
    this.saveSettings();
  },

  saveSettings() {
    wx.setStorageSync('settings', {
      darkMode: this.data.darkMode,
      soundEnabled: this.data.soundEnabled,
      fontStyle: this.data.fontStyle,
      language: this.data.language
    });
  },

  goToCalendar() {
    wx.switchTab({ url: '/pages/calendar/calendar' });
  }
});