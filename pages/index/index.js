// pages/index/index.js
const lunar = require('../../utils/lunar.js');
const yijing = require('../../utils/yijing.js');
const storage = require('../../utils/storage.js');

Page({
  data: {
    dateStr: '',
    lunarYearStr: '',
    lunarSeasonStr: '',
    lunarDayStr: '',
    isToday: true,
    chars: '',
    showInput: false,
    inputChars: '',
    coinTouched: false,
    showHexagram: false,
    hexagram: null,
    hexagramLines: [],
    showShareModal: false
  },

  onLoad() {
    this.initToday();
  },

  onShow() {
    this.loadTodayData();
  },

  initToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    this.setData({
      dateStr: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    });

    const lunarInfo = lunar.solarToLunar(year, month, day);

    const tiangan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const dizhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const yearOffset = (year - 1900 + 40) % 10;
    const zhiOffset = (year - 1900 + 50) % 12;
    const yearTiangan = tiangan[yearOffset];
    const yearDizhi = dizhi[zhiOffset];

    const seasons = ['孟春', '仲春', '暮春', '孟夏', '仲夏', '暮夏', '孟秋', '仲秋', '暮秋', '孟冬', '仲冬', '暮冬'];
    const monthSeason = seasons[(lunarInfo.month - 1) * 3 + Math.floor((lunarInfo.day - 1) / 10)];

    this.setData({
      lunarYearStr: `${yearTiangan}${yearDizhi}年`,
      lunarSeasonStr: monthSeason,
      lunarDayStr: lunarInfo.dayName,
      isToday: true
    });
  },

  loadTodayData() {
    const today = this.data.dateStr;
    const entry = storage.getDiary(today);
    this.setData({
      chars: entry ? entry.chars : ''
    });
  },

  onCharsTap() {
    if (!this.data.chars) {
      this.setData({ showInput: true });
    }
  },

  onInputClose() {
    this.setData({ showInput: false, inputChars: '' });
  },

  onInputChange(e) {
    const value = e.detail.value;
    if (value.length > 2) return;
    this.setData({ inputChars: value });
  },

  onSaveChars() {
    const chars = this.data.inputChars.trim();
    if (!chars) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }

    const dateStr = this.data.dateStr;
    storage.saveDiary(dateStr, chars, '思', null);

    this.setData({
      chars: chars,
      showInput: false,
      inputChars: ''
    });

    wx.vibrateShort({ success: true });
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  onCoinTap() {
    if (!this.data.chars) {
      wx.showToast({ title: '请先输入二字', icon: 'none' });
      return;
    }

    const hexagram = yijing.generateHexagram(this.data.dateStr, this.data.chars);

    const entry = storage.getDiary(this.data.dateStr);
    if (entry) {
      entry.hexagram = hexagram;
      storage.saveDiary(this.data.dateStr, entry.chars, entry.mood, hexagram);
    }

    this.setData({
      coinTouched: true,
      showHexagram: true,
      hexagram: hexagram,
      hexagramLines: []
    });

    wx.vibrateShort({ success: true });

    setTimeout(() => {
      this.setData({ coinTouched: false });
    }, 500);

    let delay = 600;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const lines = [...this.data.hexagramLines];
        lines.push(hexagram.lines[i]);
        this.setData({ hexagramLines: lines });
      }, delay);
      delay += 500;
    }
  },

  onCloseHexagram() {
    this.setData({
      showHexagram: false,
      hexagramLines: [],
      hexagram: null
    });
  },

  onShareTap() {
    if (!this.data.chars) {
      wx.showToast({ title: '请先输入内容', icon: 'none' });
      return;
    }

    if (!this.data.hexagram) {
      const hexagram = yijing.generateHexagram(this.data.dateStr, this.data.chars);
      this.setData({ hexagram: hexagram });
    }

    this.setData({ showShareModal: true });
  },

  onCloseShare() {
    this.setData({ showShareModal: false });
  },

  saveToAlbum() {
    wx.showToast({ title: '分享功能开发中', icon: 'none' });
    this.onCloseShare();
  },

  goToCalendar() {
    wx.switchTab({ url: '/pages/calendar/calendar' });
  },

  goToSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  }
});