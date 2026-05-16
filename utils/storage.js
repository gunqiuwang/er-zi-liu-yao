// utils/storage.js
// 数据存储工具

// 默认数据
const defaultData = {
  diaryData: {},
  settings: {
    darkMode: false,
    soundEnabled: true,
    fontStyle: 'serif',
    language: 'zh-CN'
  }
};

// 初始化存储
function initStorage() {
  const diaryData = wx.getStorageSync('diaryData');
  if (!diaryData) {
    wx.setStorageSync('diaryData', {});
  }

  const settings = wx.getStorageSync('settings');
  if (!settings) {
    wx.setStorageSync('settings', defaultData.settings);
  }
}

// 获取日记数据
function getDiaryData() {
  return wx.getStorageSync('diaryData') || {};
}

// 保存日记
function saveDiary(dateStr, chars, mood, hexagram) {
  const diaryData = getDiaryData();
  diaryData[dateStr] = {
    chars: chars,
    mood: mood || '思',
    hexagram: hexagram || null,
    createTime: Date.now(),
    updateTime: Date.now()
  };
  wx.setStorageSync('diaryData', diaryData);
  return diaryData[dateStr];
}

// 获取单日日记
function getDiary(dateStr) {
  const diaryData = getDiaryData();
  return diaryData[dateStr] || null;
}

// 删除日记
function deleteDiary(dateStr) {
  const diaryData = getDiaryData();
  if (diaryData[dateStr]) {
    delete diaryData[dateStr];
    wx.setStorageSync('diaryData', diaryData);
    return true;
  }
  return false;
}

// 获取设置
function getSettings() {
  return wx.getStorageSync('settings') || defaultData.settings;
}

// 保存设置
function saveSettings(settings) {
  wx.setStorageSync('settings', { ...defaultData.settings, ...settings });
}

// 获取月份数据
function getMonthData(year, month) {
  const diaryData = getDiaryData();
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const result = [];

  for (let day = 1; day <= 31; day++) {
    const dateStr = `${prefix}-${String(day).padStart(2, '0')}`;
    if (diaryData[dateStr]) {
      result.push({
        date: dateStr,
        ...diaryData[dateStr]
      });
    }
  }

  return result;
}

module.exports = {
  initStorage,
  getDiaryData,
  saveDiary,
  getDiary,
  deleteDiary,
  getSettings,
  saveSettings,
  getMonthData
};