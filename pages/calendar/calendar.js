// pages/calendar/calendar.js
const lunar = require('../../utils/lunar.js');
const yijing = require('../../utils/yijing.js');

Page({
  data: {
    currentYear: new Date().getFullYear(),
    currentMonth: 0, // 0 = 全年视图
    monthStr: '',
    yearMonths: [],
    selectedDate: null,
    selectedEntry: null
  },

  onLoad() {
    this.generateYearView();
    this.loadYearData();
  },

  onShow() {
    this.loadYearData();
  },

  generateYearView() {
    const year = this.data.currentYear;
    const months = [];

    for (let m = 1; m <= 12; m++) {
      const firstDay = new Date(year, m - 1, 1);
      const startWeekday = firstDay.getDay();
      const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        monthDays[1] = 29;
      }
      const daysInMonth = monthDays[m - 1];

      const days = [];
      // 填充空白
      for (let i = 0; i < startWeekday; i++) {
        days.push({ empty: true });
      }
      // 填充日期
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const lunarInfo = lunar.solarToLunar(year, m, d);
        const isToday = this.isToday(year, m, d);
        days.push({
          day: d,
          dateStr: dateStr,
          lunarDay: lunarInfo.dayName,
          lunarMonth: lunarInfo.monthName,
          isToday: isToday,
          hasEntry: false,
          entry: null
        });
      }

      months.push({
        month: m,
        monthName: `${m}月`,
        days: days
      });
    }

    this.setData({
      monthStr: `${year}年`,
      yearMonths: months
    });
  },

  isToday(year, month, day) {
    const today = new Date();
    return today.getFullYear() === year &&
           today.getMonth() + 1 === month &&
           today.getDate() === day;
  },

  loadYearData() {
    const diaryData = wx.getStorageSync('diaryData') || {};
    const year = this.data.currentYear;

    const yearMonths = this.data.yearMonths.map(month => {
      const monthDays = month.days.map(day => {
        if (day.empty || !day.dateStr) return day;
        const entry = diaryData[day.dateStr];
        return {
          ...day,
          hasEntry: !!entry,
          entry: entry || null
        };
      });
      return { ...month, days: monthDays };
    });

    this.setData({ yearMonths });
  },

  onDayTap(e) {
    const dateStr = e.currentTarget.dataset.date;
    const entry = e.currentTarget.dataset.entry;

    if (!dateStr || dateStr === 'undefined') return;

    // 如果没有条目，生成一个临时的（用于预览）
    if (!entry) {
      const hexagram = yijing.generateHexagram(dateStr, '预览');
      this.setData({
        selectedDate: dateStr,
        selectedEntry: { chars: '留白', hexagram: hexagram }
      });
    } else {
      // 如果有条目但没有卦象，生成一个
      let hexagram = entry.hexagram;
      if (!hexagram && entry.chars) {
        hexagram = yijing.generateHexagram(dateStr, entry.chars);
        entry.hexagram = hexagram;
      }
      this.setData({
        selectedDate: dateStr,
        selectedEntry: entry
      });
    }
  },

  onCloseDetail() {
    this.setData({
      selectedDate: null,
      selectedEntry: null
    });
  },

  goToWrite() {
    if (this.data.selectedDate) {
      wx.navigateTo({
        url: `/pages/index/index?date=${this.data.selectedDate}`
      });
    }
    this.onCloseDetail();
  }
});