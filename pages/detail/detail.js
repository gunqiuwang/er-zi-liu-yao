// pages/detail/detail.js
const lunar = require('../../utils/lunar.js');
const yijing = require('../../utils/yijing.js');

Page({
  data: {
    dateStr: '',
    lunarDateStr: '',
    entry: null,
    hexagram: null
  },

  onLoad(options) {
    const dateStr = options.date || '';
    this.setData({ dateStr });
    this.loadEntry(dateStr);
  },

  loadEntry(dateStr) {
    if (!dateStr) return;

    const diaryData = wx.getStorageSync('diaryData') || {};
    const entry = diaryData[dateStr] || null;

    // 解析日期
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const day = parseInt(parts[2]);
      const lunarInfo = lunar.solarToLunar(year, month, day);
      this.setData({
        lunarDateStr: `${lunarInfo.monthName}${lunarInfo.dayName}`
      });
    }

    // 如果有条目，生成卦象
    if (entry && entry.chars) {
      const hexagram = yijing.generateHexagram(dateStr, entry.chars);
      entry.hexagram = hexagram;
    }

    this.setData({ entry });
  },

  onDelete() {
    if (!this.data.dateStr) return;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除今日记录吗？',
      success: (res) => {
        if (res.confirm) {
          const diaryData = wx.getStorageSync('diaryData') || {};
          delete diaryData[this.data.dateStr];
          wx.setStorageSync('diaryData', diaryData);

          wx.showToast({ title: '已删除', icon: 'success' });
          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
        }
      }
    });
  },

  goToCalendar() {
    wx.switchTab({ url: '/pages/calendar/calendar' });
  },

  goToSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  }
});