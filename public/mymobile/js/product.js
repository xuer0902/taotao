$(function () {
  window.productId = lt.getParamsByUrl().productId;
//  1.初始化下拉加载效果
  mui.init({
    pullRefresh: {
      container: '.mui-scroll-wrapper',
      down: {
        auto: true,
        callback: function () {
          var that = this;
          setTimeout(function () {
            that.endPulldownToRefresh()
          }, 1000);
        }
      }
    }
  });
//  2.根据商品ID渲染页面
  getProductDetailData(function (data) {
    $('.mui-scroll').html(template('productDetailTemplate', data));
  //  初始化轮播图
    mui('.mui-slider').slider();
  })
//  3.页面交互功能-选择尺码
  $('.mui-scroll').on('tap', '.btn_size', function () {
    $('.btn_size').removeClass('now')
    $(this).addClass('now')
  })
//  4.页面交互功能-选择数量
  var numValue = 1;
  $('.mui-scroll').on('tap', '.change span', function () {
    var type = $(this).data('type');
    if (type == 0) {
      if(numValue <= 0) {
        mui.toast('亲，不能再少了');
        return false;
      }
      numValue --;
    } else {
      if(numValue >= $('.change input').attr('max')) {
        mui.toast('亲，没有库存了');
        return false;
      }
      numValue ++;
    }
    $('.change input').val(numValue);
  })
//  5.页面交互功能-加入购物车
  var loading = false;
  $('.addCart').on('tap', function () {
    if (loading) {
      return false;
    }
  //  调用接口 （首先需要登录）
  //  判断当前用户登录状态
  //  获取商品ID 尺码 数量 发给后台
    var productId = window.productId;
    var size = $('.btn_size.now').html();
    var num = $('.change input').val();
  //  校验
    // 看是否存在商品ID
    if (!productId) {
      mui.toast('亲，请刷新页面');
      return false;
    }
    if (!size) {
      mui.toast('亲，请选择商品尺码');
      return false;
    }
    if (!num) {
      mui.toast('亲，请选择商品数量');
      return false;
    }
  //  加入购物车请求
    loading = true;
    lt.ajax({
      type: 'post',
      url: '/cart/addCart',
      data: {
        productId: productId,
        size: size,
        num: num
      },
      dataType: 'json',
      success: function (data) {
        if (data.success == true) {
          //添加购物车成功
        //  给出温馨提示
          mui.confirm('添加成功，去购物车看看？','温馨提示', ['取消', '确定'], function (e) {
            if(e.index == 1) {
            //  确定
              location.href = lt.CARTURL;
            } else {
            //  默认取消 就关闭了
            }
            loading = false;
          })
        }
      }
    })

  })

//  点击立即购买按钮操作
  $('.buy').on('tap', function () {
    mui.toast('亲，敬请期待');
  })
});

var getProductDetailData = function (callback) {
  $.ajax({
    type: 'get',
    url: '/product/queryProductDetail',
    data: {
      id: window.productId
    },
    dataType: 'json',
    success: function (data) {
      callback && callback(data)
    }
  })
}