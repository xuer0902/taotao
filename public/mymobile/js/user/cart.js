$(function () {
  //1.页面初始化 渲染购物车商品列表
  //2.页面下拉 重新渲染购物车商品列表
  //3.编辑商品 重新渲染购物车商品列表
  //4.编辑商品的尺码和数量
  //5.删除商品
  //6.选择商品的时候自动计算总金额
  //计算价格
  var setAmount = function(){
    //  1选择当前商品
    //  2获取所有选中的商品信息
    //  3根据 商品的数量和价格去计算所有商品的和
    var totalAmount = 0;
    window.cartData.forEach(function (item, i) {
      //  判断是否被选中
      if (item.isChecked == 1) {
        var productAmount = item.price * item.num;
        totalAmount += productAmount;
      }
    });
    console.log(totalAmount);
    //  显示在页面上 处理一下小数点
    totalAmount = Math.round(totalAmount * 100) / 100 ;
    $('.amount').find('span').html(totalAmount);
  }

  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      indicators:false,
      down : {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        callback :function () {
          //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          var that = this;
          // setTimeout(function () {
          //   that.endPulldownToRefresh();
          // }, 1000)
          getCateData(function (data) {
            // console.log(data)
            //渲染列表
            $('#cartList').html(template('cartListTemplate', {list:data}));
            that.endPulldownToRefresh();
          });
        }
      }
    }
  });
//  点击刷新按钮操作
  $('.fa-refresh').on('tap', function () {
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  });
//  编辑 渲染
  $('#cartList').on('tap', '.mui-btn-blue', function () {
    var li = this.parentNode.parentNode;
    // 根据数据转换成编辑框内需要的HTML
    // 缓存列表数据 根据商品ID 去列表查询 返回即可
    var productId = $(this).data('id');
    console.log(productId)
    var item = lt.getItemById(productId, window.cartData);
    console.log(item)
    var html = template('cartEditTemplate', item);
    mui.confirm(html.replace(/\n/g, ''),'编辑商品', ['取消', '确定'], function (e) {
      if(e.index == 1) {
        //数据校验
        var size = parseInt($('.cart_update .btn_size.now').html());
        if(!size) {
          mui.toast('亲，请选择尺码');
          return false;
        }
        var num = parseInt($('.cart_update input').val());
        if(!num) {
          mui.toast('亲，请选择数量');
          return false;
        }
        //  确定 去请求后台 将编辑的信息发给后台
        lt.ajax({
          type: 'post',
          url: '/cart/updateCart',
          data: {
            id: item.id,
            size: size,
            num: num
          },
          success: function (data) {
            if (data.success == true) {
            //  修改成功 关闭滑动菜单 更新页面选择的尺码数量
              mui.swipeoutClose(li);
              item.size = size;
              item.num = num;
              //根据新的数据 重新渲染列表
              $('#cartList').html(template('cartListTemplate', {list:window.cartData}));
              setAmount();
            }
          }
        })
      } else {
        //  默认取消 就关闭了
      //  关闭滑动菜单
        mui.swipeoutClose(li);
      }
    });
  }).on('tap', '.mui-btn-red', function () {
    var li = this.parentNode.parentNode;
    var productId = $(this).data('id');
    var index = $(this).data('index');
    mui.confirm('亲，你确定要删除这件商品吗？', '温馨提示', ['取消','确定'],function (e) {
      if(e.index == 1) {
        //点击确认 提交后台删除数据 提交商品ID
        lt.ajax({
          type: 'get',
          url: '/cart/deleteCart',
          data: {
            id: productId
          },
          success: function (data) {
            if (data.success == true) {
            //  后台删除成功
            //  关闭列表
              mui.swipeoutClose(li);
            //  更新数据
              window.cartData.splice(index,1);
              $('#cartList').html(template('cartListTemplate', {list:window.cartData}));
              setAmount();
            }
          }
        })
      } else {
        mui.swipeoutClose(li);
      }
    })
  }).on('change', 'input', function () {
  //  问题：编辑操作 删除操作后之前选中的失效
  //  方案：选中的 记录一下 在商品数据中增加一个属性 isChecked  1  选中   0 未选中
    var productId =$(this).data('id');
    var item = lt.getItemById(productId, window.cartData);
    // console.log(this.checked);
  //  更新数据 记录否被选中
    item.isChecked = this.checked? 1:0;
    setAmount();
  });

//  编辑商品弹框的操作
  $('body').on('tap','.cart_update .btn_size', function () {
    $('.cart_update .btn_size.now').removeClass('now');
    $(this).addClass('now');
  }).on('tap', '.cart_update .change span',function (e) {
    var type = $(this).data('type');
    var $input = $('.cart_update input');
    var currentNum = parseInt($input.val());
    var max = parseInt($input.attr('max'));
    if (type == 0) {
      if (currentNum <=0) {
        return false;
      }
      currentNum --;
      console.log(currentNum)
    } else {
      if(currentNum >=max) {
        mui.toast('亲 没有库存了');
        return false;
      }
      currentNum ++;
      console.log(currentNum)
    }
    $('.change input').val(currentNum);
  })

//  点击生成订单按钮执行的操作
  $('.trade').on('tap',function () {
    mui.toast('亲 敬请期待');
  })
});

var getCateData = function (callback) {
  lt.ajax({
    url: '/cart/queryCart',
    success: function (data) {
      setTimeout(function () {
        //缓存数据 为了后面编辑商品的时候使用
        window.cartData = data;
        callback && callback(data);
      },500)
    }
  })
}
