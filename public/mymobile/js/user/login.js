$(function () {
//  到登录页的不同情况
//  1.当遇见需要登录的时候操作跳转到登录页 登陆成功后跳转到原页面
//  2.直接访问的就是登录页  登陆成功后跳到个人中心页面
  $('.mui-btn-primary').on('tap', function () {
  //  需求：获取一个表单内的所有数据
  //  方案：使用表单序列化
  //  注意：不管同步提交还是表单序列化都有要求，必须要有数据名称
    var formData = $('form').serialize();
    var obj = lt.serialize2Object(formData);
    console.log(obj)
    if(!obj.username) {
      mui.toast('请输入用户名');
      return false;
    }
    if (!obj.password) {
      mui.toast('请输入密码');
      return false;
    }
    $.ajax({
      type: 'post',
      url: '/user/login',
      //对象 序列化格式数据（键值对字符串，数组格式）
      data:formData,
      dataType: 'json',
      success: function (data) {
        if (data.success == true) {
        //  通过地址栏来源地址是否存在，判断来源
          var returnUrl = lt.getParamsByUrl().returnUrl;
          if (returnUrl) {
          //  来源于登陆的页面
            location.href = returnUrl;
          } else {
          //  登录页面
            location.href = lt.USERURL;
          }
        } else {
        //  登录信息不成功
          mui.toast(data.message);
        }
      },
      error: function () {
        mui.toast('网络繁忙');
      }
    })
  });
  $('.mui-btn-danger').on('tap', function () {
    $('#username').val('');
    $('#password').val('');
  })
});