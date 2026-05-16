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
    showHexagram: false,
    hexagram: null,
    hexagramLines: [],
    showShareModal: false,
    shareImage: null
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

    // 农历信息
    const lunarInfo = lunar.solarToLunar(year, month, day);

    // 天干地支（简化计算）
    const tiangan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const dizhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const yearOffset = (year - 1900 + 40) % 10;
    const zhiOffset = (year - 1900 + 50) % 12;
    const yearTiangan = tiangan[yearOffset];
    const yearDizhi = dizhi[zhiOffset];

    // 季节
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
    if (value.length > 2) {
      wx.showToast({ title: '最多两个字', icon: 'none' });
      return;
    }
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

    // 生成卦象
    const hexagram = yijing.generateHexagram(this.data.dateStr, this.data.chars);

    // 保存卦象到条目
    const entry = storage.getDiary(this.data.dateStr);
    if (entry) {
      entry.hexagram = hexagram;
      storage.saveDiary(this.data.dateStr, entry.chars, entry.mood, hexagram);
    }

    this.setData({
      showHexagram: true,
      hexagram: hexagram,
      hexagramLines: []
    });

    wx.vibrateShort({ success: true });

    // 逐爻显示动画
    let delay = 800;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const lines = [...this.data.hexagramLines];
        lines.push(hexagram.lines[i]);
        this.setData({ hexagramLines: lines });
      }, delay);
      delay += 600;
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