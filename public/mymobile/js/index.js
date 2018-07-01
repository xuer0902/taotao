$(function () {
//  初始化轮播图
  mui('.mui-slider').slider({
    interval : 1000
  })
  // 区域滚动初始化
  mui('.mui-scroll-wrapper').scroll({
    indicators: false,
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });
});