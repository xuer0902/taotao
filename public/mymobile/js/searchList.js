$(function () {

  // 问题：下拉刷新的时候，根据的是当前输入框的内容查询的
  // 需求： 点击过搜索之后才是我们的关键字， 没点搜索还是使用之前的关键字搜索
  // 方案：记录之前的关键字，点击搜索之后更新记录的关键字
  window.key = lt.getParamsByUrl().key;
  window.page = 1;

  // 需求：点击搜索查询商品
  // 方案：绑定搜索点击事件，触发的时候去根据输入框的内容刷新列表，主动触发一次下拉刷新
  $('.lt_search').on('tap', 'a', function () {
    var key = $.trim($('.lt_search input').val());
    if (!key) {
      mui.toast('请输入关键字');
      return false;
    }
    // 更新全局对象中的key
    window.key = key;

    // 重置排序功能
    window.order = {};
    $allOrder.removeClass('now');
    //改变箭头
    $allOrder.find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');

    // 触发下拉刷新
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  });

  // 区域滚动
  mui('.mui-scroll-wrapper').scroll();
  // 页面初始化的时候
  // 关键字放到搜索框，页面根据关键字进行渲染商品列表
  $('.lt_search input').val(lt.getParamsByUrl().key);
  // 配置了自动加载就不需要下面代码了
  getProductListData(function (data) {
    $('.lt_product').html(template('productListTemplate', data));
  });
});
// 获取列表数据
var getProductListData = function (callback) {
  // var params = {
  //   proName: $('.lt_search input').val(),
  //   page: window.page,
  //   pageSize: 4
  // };
  // if (window.price) {
  //   params.price = window.price;
  // }
  $.ajax({
    type: 'get',
    url: '/product/queryProduct',
    data: $.extend({
      proName: window.key,
      page: window.page,
      pageSize: 4
    },window.order),
    dataType: 'json',
    success: function (data) {
      setTimeout(function () {
        callback && callback(data)
      }, 500)
    }
  })
}
//下拉刷新 上拉加载
mui.init({
  pullRefresh : {
    container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
    down : {
      auto: true,//可选,默认false.首次加载自动下拉刷新一次
      contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
      contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
      contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
      callback :function () {
        //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        // setTimeout(function () {
        //   mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
        // }, 2000)
        var that = this
        window.page = 1;
        getProductListData(function (data) {
          $('.lt_product').html(template('productListTemplate', data));
          that.endPulldownToRefresh();
          that.refresh(true);
        })
      }
    },
    up : {
      contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
      contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
      callback :function () {
        var that = this;
        //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      //  改变当前页面，加载下一页内容
        window.page ++;
        getProductListData(function (data) {
          if (data.data && data.data.length) {
            $('.lt_product').append(template('productListTemplate', data));
            that.endPullupToRefresh();
          } else {
            //  当没有数据的时候，禁止使用上拉加载功能
            //  当返回的data是空的时候，禁用
            that.endPullupToRefresh(true);
          }
        })
      }
    }
  }
});


// 排序 点击排序按钮
// 如果之前没有选中，选中，并且按照向下的箭头去排序 降序
// 如果已经选中，箭头换一个方向，按照当前的方向去排序
// 只能按照一种方式去排序：点击排序的其他排序状态重置

// 记录排序的对象 ajax使用
window.order = {};
var $allOrder = $('.lt_order a');
$('.lt_order').on('tap', function (e) {
  var $currentOrder = $(e.target);
  if ($currentOrder.hasClass('now')) {
  //  换箭头
    var $angle = $currentOrder.find('.fa');
    if ($angle.hasClass('fa-angle.up')) {
      $angle.removeClass('fa-angle-up').addClass('fa-angle-down');
    } else {
      $angle.removeClass('fa-angle-down').addClass('fa-angle-up');
    }
  } else {
    //去除其他的样式
    $allOrder.removeClass('now');
    //改变箭头
    $allOrder.find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
    //选中当前的
    $currentOrder.addClass('now');
  }

  //根据当前排序重新渲染商品列表
//  价格： price 1 升序  2 降序
//  库存： num  1 升序  2 降序
//  主动触发下拉刷新 getProductListData 想办法把参数给这个方法使用
//  获取排序的方式  给ajax 的参数加上排序方式
  var orderType = $currentOrder.data('type');
  var orderValue = $currentOrder.find('.fa').hasClass('fa-angle-down') ? 2 : 1 ;
  window.order = {};
  window.order[orderType] = orderValue;
  // 触发刷新
  mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
});