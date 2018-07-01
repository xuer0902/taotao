$(function () {
//  1.获取短信验证码
  $('.btn_getCode').on('tap',function () {
    var $btn = $(this);
    //防止重复提交
    if($btn.hasClass('disable')) {
      return false;
    }
  //  1.1 校验手机号
    var mobile = $.trim($('input[name="username"]').val());
    if(!mobile) {
      mui.toast('亲，请输入手机号');
      return false;
    }
    if(!/^1\d{10}$/.test(mobile)) {
      mui.toast('亲，请输入合理号码');
      return false;
    }
  //  1.2 调用后台接口
    $.ajax({
      type: 'get',
      url: '/user/vCode',
      //在发送请求前做事情
      beforeSend: function() {
        $btn.addClass('disable');
      },
      data:{
        mobile: mobile
      },
      dataType: 'json',
      success: function (data) {
        console.log(data.vCode);
        mui.toast(data.vCode,{duration:'long'});
        // 获取短信验证码
        //  倒计时60秒
        var time = 60;
        var timer = setInterval(function () {
          time --;
          $btn.html(time + '秒后获取');
          if(time == 0) {
            clearInterval(timer);
            $btn.html('获取验证码').removeClass('disable');
          }
        }, 1000);
      }
    });
  });
//  2.注册
  var loading = false;
  $('.btn_register').on('tap',function () {
    var $btn = $(this);
  //  2.1 获取表单所有数据
    if (loading) {
      return false;
    }
    var formData = $('form').serialize();
    var data = lt.serialize2Object(formData);
  //  2.2校验后台数据
    if(!data.username) {
      mui.toast('亲，请输入手机号');
      return false;
    }
    if(!/^1\d{10}$/.test(data.username)) {
      mui.toast('亲，请输入合理号码');
      return false;
    }
    if (!data.password) {
      mui.toast('亲，请输入密码');
      return false;
    }
    if(data.password.length < 6) {
      mui.toast('亲，请至少输入6位密码');
      return false;
    }
    if (!data.rePass) {
      mui.toast('亲，请输入确认密码');
      return false;
    }
    if(data.password !=data.rePass) {
      mui.toast('亲，请输入一致的密码');
      return false;
    }
    if (!data.vCode) {
      mui.toast('亲，请输入验证码');
      return false;
    }
    data.mobile = data.username;
  // 2.3验证完事之后 发送数据给后台
    $.ajax({
      type: 'post',
      url: '/user/register',
      data:data,
      dataType:'json',
      beforeSend: function () {
        loading = true;
      },
      success: function (data) {
        if(data.success == true) {
          location.href = lt.LOGINURL;
        } else {
          setTimeout(function () {
            loading = false;
            mui.toast(data.message);
          },2000)
        }
      }
    })
  })
});