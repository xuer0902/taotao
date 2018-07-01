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
        $('.t_p').html(template('teamListTemplate', data));
    });
});
// 获取列表数据
var getProductListData = function (callback) {
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
                    $('.t_p').html(template('teamListTemplate', data));
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
                        $('.t_p').append(template('teamListTemplate', data));
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
