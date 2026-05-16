// pages/history/history.js
const lunar = require('../../utils/lunar.js');

Page({
  data: {
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    monthStr: '',
    calendarDays: [],
    hasContentDays: []
  },

  onLoad() {
    this.updateMonthStr();
    this.generateCalendar();
    this.loadHasContentDays();
  },

  onShow() {
    this.loadHasContentDays();
  },

  updateMonthStr() {
    const months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
    this.setData({
      monthStr: `${this.data.currentYear}年${months[this.data.currentMonth - 1]}月`
    });
  },

  prevMonth() {
    let { currentYear, currentMonth } = this.data;
    if (currentMonth === 1) {
      currentMonth = 12;
      currentYear--;
    } else {
      currentMonth--;
    }
    this.setData({ currentYear, currentMonth });
    this.updateMonthStr();
    this.generateCalendar();
  },

  nextMonth() {
    let { currentYear, currentMonth } = this.data;
    if (currentMonth === 12) {
      currentMonth = 1;
      currentYear++;
    } else {
      currentMonth++;
    }
    this.setData({ currentYear, currentMonth });
    this.updateMonthStr();
    this.generateCalendar();
  },

  generateCalendar() {
    const { currentYear, currentMonth } = this.data;

    // 获取当月第一天是星期几
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const startWeekday = firstDay.getDay();

    // 获取当月总天数
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ((currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0) {
      monthDays[1] = 29;
    }
    const daysInMonth = monthDays[currentMonth - 1];

    // 生成日历数据
    const days = [];

    // 填充空白
    for (let i = 0; i < startWeekday; i++) {
      days.push({ day: '', empty: true });
    }

    // 填充日期
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const lunarInfo = lunar.solarToLunar(currentYear, currentMonth, d);
      days.push({
        day: d,
        dateStr: dateStr,
        lunarDay: lunarInfo.dayName,
        hasContent: false,
        isToday: this.isToday(currentYear, currentMonth, d)
      });
    }

    this.setData({ calendarDays: days });
  },

  isToday(year, month, day) {
    const today = new Date();
    return today.getFullYear() === year &&
           today.getMonth() + 1 === month &&
           today.getDate() === day;
  },

  loadHasContentDays() {
    const diaryData = wx.getStorageSync('diaryData') || {};
    const days = Object.keys(diaryData).filter(date => date.startsWith(`${this.data.currentYear}-${String(this.data.currentMonth).padStart(2, '0')}`));

    const calendarDays = this.data.calendarDays.map(item => {
      if (item.dateStr && days.includes(item.dateStr)) {
        return { ...item, hasContent: true };
      }
      return item;
    });

    this.setData({ calendarDays });
  },

  onDayTap(e) {
    const dateStr = e.currentTarget.dataset.date;
    if (dateStr) {
      wx.navigateTo({
        url: `/pages/detail/detail?date=${dateStr}`
      });
    }
  }
});