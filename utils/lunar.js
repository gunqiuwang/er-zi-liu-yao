// utils/lunar.js
// 农历转换工具 - 基于公开算法

const LunarMonth = [
  '正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'
];

const LunarDay = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

// 农历月份天数表（每个月份是否为30天，0=小月29天，1=大月30天）
// 从1900年开始，每年编码为4字节：高12位存放闰月信息，低12位存放每月天数
const lunarCalendarCode = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d0,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14576, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0,
  0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, 0x095b0,
  0x049b0, 0x0a974, 0x0a4b0, 0x0b270, 0x06850, 0x06e60, 0x0f2b5, 0x0ea50, 0x06b58, 0x055d0,
  0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, 0x0d520
];

// 1900年到2100年的农历数据偏移量
const lunarInfo = [
  0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13,
  15, 16, 17, 18, 20, 21, 22, 24, 25, 26, 28, 29,
  30, 32, 33, 35, 36, 37, 39, 40, 41, 43, 44, 45,
  47, 48, 49, 50, 52, 53, 55, 56, 57, 59, 60, 61,
  63, 64, 65, 66, 68, 69, 70, 72, 73, 74, 76, 77,
  78, 79, 81, 82, 83, 85, 86, 87, 89, 90, 91, 92,
  94, 95, 96, 97, 99, 100, 101, 102, 104, 105, 106, 108,
  109, 110, 111, 113, 114, 115, 116, 118, 119, 120, 122, 123,
  124, 125, 127, 128, 129, 130, 132, 133, 134, 136, 137, 138,
  140, 141, 142, 144, 145, 146, 147, 149, 150, 151, 152, 154,
  155, 156, 158, 159, 160, 162, 163, 164, 165, 167, 168, 169,
  171, 172, 173, 175, 176, 177, 178, 180, 181, 182, 183, 185,
  187, 188, 189, 191, 192, 193, 195, 196, 197, 199, 200, 201,
  203, 204, 205, 206, 208, 209, 210, 212, 213, 214, 216, 217,
  218, 220, 221, 222, 223, 225, 226, 227, 228, 230, 231, 232,
  234, 235, 237, 238, 239, 241, 242, 243, 244, 246, 247, 248,
  250, 251, 252, 253, 255, 256, 257, 259, 260, 261, 263, 264,
  265, 266, 268, 269, 270, 272, 273, 274, 276, 277, 278, 280,
  281, 282, 283, 285, 286, 287, 289, 290, 291, 292, 294, 295,
  296, 298, 299, 300, 302, 303, 304, 306, 307, 308, 310, 311,
  312, 313, 315, 316, 317, 319, 320, 321, 323, 324, 325, 327,
  328, 329, 331, 332, 333, 334, 336, 337, 338, 340, 341, 342,
  344, 345, 346, 347, 349, 350, 351, 353, 354, 355, 357, 358
];

// 计算指定年份到1900年的天数
function getDaysSince1900(year) {
  let days = 0;
  for (let y = 1900; y < year; y++) {
    days += 365 + (isLeapYear(y) ? 1 : 0);
  }
  return days;
}

// 判断是否为闰年
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// 获取农历年信息
function getLunarYearInfo(year) {
  const code = lunarCalendarCode[year - 1900];
  const leapMonth = code & 0xf;
  const monthDays = [];

  let mask = 0x8000;
  for (let i = 0; i < 12; i++) {
    monthDays.push((code & mask) ? 30 : 29);
    mask >>= 1;
  }

  return {
    leapMonth: leapMonth,
    monthDays: monthDays
  };
}

// 将公历日期转换为农历日期
function solarToLunar(year, month, day) {
  // 计算从1900年1月1日到指定日期的总天数
  let offset = getDaysSince1900(year);

  // 加上当年的天数
  const monthDaysNormal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isLeapYear(year)) {
    monthDaysNormal[1] = 29;
  }

  for (let m = 0; m < month - 1; m++) {
    offset += monthDaysNormal[m];
  }
  offset += day;

  // 减去1900年1月1日（农历1900年正月初一）
  offset -= 1;

  // 计算农历年
  let lunarYear = 1900;
  let lunarInfoIndex = 0;

  while (lunarYear < 2100 && offset > 0) {
    const yearInfo = getLunarYearInfo(lunarYear);
    const yearDays = yearInfo.monthDays.reduce((a, b) => a + b, 0);
    const leapDays = yearInfo.leapMonth > 0 ? yearInfo.monthDays[yearInfo.leapMonth - 1] : 0;

    offset -= (yearDays + leapDays);
    lunarYear++;
  }

  if (offset <= 0) {
    lunarYear--;
    offset += getLunarYearInfo(lunarYear).monthDays.reduce((a, b) => a + b, 0) +
              (getLunarYearInfo(lunarYear).leapMonth > 0 ? getLunarYearInfo(lunarYear).monthDays[getLunarYearInfo(lunarYear).leapMonth - 1] : 0);
  }

  // 计算农历月和日
  const yearInfo = getLunarYearInfo(lunarYear);
  let lunarMonth = 1;
  let lunarDay = 0;
  let isLeap = false;

  if (yearInfo.leapMonth > 0) {
    for (let m = 1; m <= 12 && offset > 0; m++) {
      const monthLen = yearInfo.monthDays[m - 1];
      if (isLeap) {
        // 闰月
        if (offset <= monthLen) {
          lunarDay = offset;
          break;
        }
        offset -= monthLen;
        isLeap = false;
        m--;
      } else {
        if (offset <= monthLen) {
          lunarMonth = m;
          lunarDay = offset;
          break;
        }
        offset -= monthLen;

        if (m === yearInfo.leapMonth) {
          isLeap = true;
        }
      }
    }
  } else {
    for (let m = 1; m <= 12 && offset > 0; m++) {
      const monthLen = yearInfo.monthDays[m - 1];
      if (offset <= monthLen) {
        lunarMonth = m;
        lunarDay = offset;
        break;
      }
      offset -= monthLen;
    }
  }

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    monthName: lunarInfoIndex >= 0 && lunarInfoIndex < LunarMonth.length ? LunarMonth[lunarMonth - 1] : LunarMonth[lunarMonth - 1],
    dayName: lunarInfoIndex >= 0 && lunarDay - 1 < LunarDay.length ? LunarDay[lunarDay - 1] : LunarDay[lunarDay - 1],
    isLeap: isLeap
  };
}

// 获取农历月份名称
function getMonthName(month) {
  return LunarMonth[month - 1] || '';
}

// 获取农历日名称
function getDayName(day) {
  return LunarDay[day - 1] || '';
}

module.exports = {
  solarToLunar,
  getMonthName,
  getDayName
};