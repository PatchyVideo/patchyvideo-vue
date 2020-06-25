function toGMT() {
  return function(timeStamp) {
    let upload_time = new Date(timeStamp);
    // 设置为东八区的时间
    upload_time.setTime(upload_time.getTime() + 1000 * 3600 * 8);
    let y = upload_time.getFullYear(); //getFullYear 方法以四位数字返回年份
    let M = upload_time.getMonth() + 1; // getMonth 方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
    let d = upload_time.getDate(); // getDate 方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
    let h = upload_time.getHours(); // getHours 方法返回 Date 对象的小时 (0 ~ 23)
    let m = upload_time.getMinutes(); // getMinutes 方法返回 Date 对象的分钟 (0 ~ 59)
    let s = upload_time.getSeconds(); // getSeconds 方法返回 Date 对象的秒数 (0 ~ 59)
    return (
      y +
      "-" +
      // 数字不足两位自动补零，下同
      (Array(2).join(0) + M).slice(-2) +
      "-" +
      (Array(2).join(0) + d).slice(-2) +
      " " +
      (Array(2).join(0) + h).slice(-2) +
      ":" +
      (Array(2).join(0) + m).slice(-2) +
      ":" +
      (Array(2).join(0) + s).slice(-2) +
      " GMT+8"
    );
  };
}

export { toGMT };
