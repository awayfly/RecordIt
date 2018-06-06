const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function timetrans(date) {
  var date = new Date(date);//如果date为13位不需要乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());

  return Y + M + D + h + m + s;
}

function timetransYMD(date) {
  var date = new Date(date);//如果date为13位不需要乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  
  return Y + M + D;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function YMDteanstats(data) {////////////
  var strtime = data;
  let allData = [];

  var star = (Date.parse(strtime)) / 1000;

  let end = star + 6 * 24 * 3600;
  allData[0] = star;
  allData[1] = end;
  // for (let i = 0; i <= 9; i++) {
  //   let ll = time3 - i * 24 * 3600
  //   allData[i] = "\"" + ll + "\"";
  // }

  return allData;
}

function AutoYMDteanstats() {//////////////初始化时间

  var myDate = new Date();
  myDate.getFullYear();    //获取完整的年份(4位,1970-????)
  myDate.getMonth();       //获取当前月份(0-11,0代表1月)
  myDate.getDate();
  var newData = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate() + ' 00:00:00'


  var strtime = newData;
  let allData = [];

  var end = (Date.parse(strtime)) / 1000;
  let star = end - 6 * 24 * 3600;
  allData[0] = star;
  allData[1] = end;


  return allData;
}


function uploadFoodData() {

}

module.exports = {
  formatTime: formatTime,
  timetrans: timetrans,
  timetransYMD: timetransYMD,
  YMDteanstats: YMDteanstats,
  AutoYMDteanstats: AutoYMDteanstats,
  uploadFoodData: uploadFoodData
}
