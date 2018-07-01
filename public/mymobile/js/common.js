window.lt = {};
// 获取地址栏参数，返回类型是对象
lt.getParamsByUrl = function () {
  var search = location.search;
  var params = {};
  if (search) {
    search = search.substr(1);
    var searchArr = search.split('&');
    searchArr.forEach(function (item, i) {
      var itemArr = item.split('=');
      // encodeURIComponent() 转成url编码 处理特殊字符串的传递
      // decodeURIComponent() 解url码 处理成正常的字符串
      params[itemArr[0]] = decodeURIComponent(itemArr[1]);
    });
  }
  return params;
}

//拦截ajax请求未登录状态
//具备ajax请求同时做未登录的判断处理
lt.LOGINURL = '/mymobile/user/login.html';
lt.USERURL = '/mymobile/user/index.html';
lt.CARTURL = '/mymobile/user/cart.html';
lt.ajax =function (options) {
//  options 和原来的ajax传参保持一致
  $.ajax({
    type: options.type || 'get',
    url: options.url || '#',
    data: options.data || '',
    dataType: options.dataType || 'json',
    success: function (data) {
      if (data.error == 400) {
        location.href = lt.LOGINURL + '?returnUrl=' + encodeURIComponent(location.href);
      }
    //  登陆成功
      else {
        options.success && options.success(data);
      }
    },
    error: function (info) {
    //  服务端调用失败的时候 告诉用户服务器繁忙
      options.error && options.error(info);
      // mui.toast('服务器繁忙，请稍后再试');
    }
  })
}

//转换表单序列化的数据成为一个对象
lt.serialize2Object = function (serialize) {
  var obj = {};
  if (serialize) {
    var serializeArr = serialize.split('&');
    serializeArr.forEach(function (value, index) {
      var itemArr = value.split('=');
      obj[itemArr[0]] = itemArr[1];
    })
  }
  return obj;
}


//根据ID 返回数据列表中符合要求的商品
lt.getItemById = function (id, list) {
  var obj = {};
  list.forEach(function (item,i) {
    if (id == item.id) {
      obj = item;
    }
  })
  return obj;
};

/*
 * 根据数组中对象数据ID获取索引
 * */
lt.getObjectFromId = function(arr,id){
  var object = null;
  for(var i = 0 ; i < arr.length ; i++){
    var item = arr[i];
    if(item && item.id == id){
      object = item;
      break;
    }
  }
  return object;
};
