/**
 * 日期工具类
 * 提供常用的日期操作方法
 */
class DateUtils {
  /**
   * 格式化日期
   * @param {Date|number|string} date 日期对象、时间戳或日期字符串
   * @param {string} format 格式模板，例如 'YYYY-MM-DD HH:mm:ss'
   * @returns {string} 格式化后的日期字符串
   */
  static format(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date');
    }

    const map = {
      YYYY: d.getFullYear(),
      MM: String(d.getMonth() + 1).padStart(2, '0'),
      DD: String(d.getDate()).padStart(2, '0'),
      HH: String(d.getHours()).padStart(2, '0'),
      mm: String(d.getMinutes()).padStart(2, '0'),
      ss: String(d.getSeconds()).padStart(2, '0'),
      SSS: String(d.getMilliseconds()).padStart(3, '0')
    };

    return format.replace(/YYYY|MM|DD|HH|mm|ss|SSS/g, matched => map[matched]);
  }

  /**
   * 获取相对时间描述
   * @param {Date|number|string} date 日期对象、时间戳或日期字符串
   * @returns {string} 相对时间描述
   */
  static fromNow(date) {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
  }

  /**
   * 获取日期范围
   * @param {string} range 范围类型：'today'|'week'|'month'|'year'
   * @returns {[Date, Date]} 起止时间
   */
  static getDateRange(range) {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        const day = start.getDay() || 7;
        start.setDate(start.getDate() - day + 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() + (7 - day));
        end.setHours(23, 59, 59, 999);
        break;
      case 'month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'year':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11, 31);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        throw new Error('Invalid range type');
    }

    return [start, end];
  }

  /**
   * 计算两个日期之间的差值
   * @param {Date|number|string} date1 日期1
   * @param {Date|number|string} date2 日期2
   * @param {string} unit 单位：'years'|'months'|'days'|'hours'|'minutes'|'seconds'
   * @returns {number} 差值
   */
  static diff(date1, date2, unit = 'days') {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = d2 - d1;

    const units = {
      years: 1000 * 60 * 60 * 24 * 365,
      months: 1000 * 60 * 60 * 24 * 30,
      days: 1000 * 60 * 60 * 24,
      hours: 1000 * 60 * 60,
      minutes: 1000 * 60,
      seconds: 1000
    };

    return Math.floor(diff / units[unit]);
  }

  /**
   * 添加时间
   * @param {Date|number|string} date 原始日期
   * @param {number} amount 添加的数量
   * @param {string} unit 单位：'years'|'months'|'days'|'hours'|'minutes'|'seconds'
   * @returns {Date} 新的日期对象
   */
  static add(date, amount, unit = 'days') {
    const d = new Date(date);
    
    switch (unit) {
      case 'years':
        d.setFullYear(d.getFullYear() + amount);
        break;
      case 'months':
        d.setMonth(d.getMonth() + amount);
        break;
      case 'days':
        d.setDate(d.getDate() + amount);
        break;
      case 'hours':
        d.setHours(d.getHours() + amount);
        break;
      case 'minutes':
        d.setMinutes(d.getMinutes() + amount);
        break;
      case 'seconds':
        d.setSeconds(d.getSeconds() + amount);
        break;
      default:
        throw new Error('Invalid unit');
    }

    return d;
  }

  /**
   * 判断是否为工作日
   * @param {Date|number|string} date 日期
   * @returns {boolean} 是否为工作日
   */
  static isWeekday(date) {
    const d = new Date(date);
    const day = d.getDay();
    return day !== 0 && day !== 6;
  }

  /**
   * 获取月份的天数
   * @param {number} year 年份
   * @param {number} month 月份（1-12）
   * @returns {number} 天数
   */
  static getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  /**
   * 判断是否为闰年
   * @param {number} year 年份
   * @returns {boolean} 是否为闰年
   */
  static isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /**
   * 获取季度的起止时间
   * @param {Date|number|string} date 日期
   * @returns {[Date, Date]} 季度的起止时间
   */
  static getQuarterRange(date) {
    const d = new Date(date);
    const quarter = Math.floor(d.getMonth() / 3);
    
    const start = new Date(d.getFullYear(), quarter * 3, 1);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(d.getFullYear(), (quarter + 1) * 3, 0);
    end.setHours(23, 59, 59, 999);
    
    return [start, end];
  }
}
