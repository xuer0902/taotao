$(function(){
  $('body').on('tap','.btn_updatePass',function(){

    if(window.loading) return false;

    var data = {
      oldPassword:$.trim($('[name=oldPassword]').val()),
      newPassword:$.trim($('[name=newPassword]').val()),
      reNewPassword:$.trim($('[name=reNewPassword]').val()),
      code:$.trim($('[name=code]').val())
    };
    console.log(data)

    if(!data.oldPassword){
      mui.toast('请输入原密码');
      return false;
    }

    if(!data.newPassword){
      mui.toast('请输入新密码');
      return false;
    }

    if(!data.reNewPassword){
      mui.toast('请再次输入新密码');
      return false;
    }

    if(data.newPassword != data.reNewPassword){
      mui.toast('密码需要一致');
      return false;
    }

    if(!data.code){
      mui.toast('请输入验证码');
      return false;
    }

    if(!/^\d{6}$/.test(data.code)){
      mui.toast('请输入合法验证码');
      return false;
    }

    lt.ajax({
      type:'post',
      url:'/user/updatePassword',
      data:data,
      dataType:'json',
      beforeSend:function(){
        window.loading = 1;
        $('.btn_updatePass').html('正在提交...');
      },
      success:function(data){
        window.loading = null;
        if(data.success){
          mui.toast('修改成功！');
          location.href = lt.LOGINURL;
        }
      }
    });
  }).on('tap','.btn_getCode',function(){
    var btn = $('.btn_getCode');
    if(btn.hasClass('disable')) return false;
    lt.ajax({
      type:'get',
      url:'/user/vCodeForUpdatePassword',
      data:'',
      dataType:'json',
      beforeSend:function(){
        btn.addClass('disable').html('正在发送...');
      },
      success:function(data){
        console.log(data.vCode);
        mui.toast(data.vCode,{duration:'long'});
        var time = 60;
        var timer = setInterval(function(){
          time --;
          btn.html(time+'秒后再获取');
          if(time <= 0) {
            clearInterval(timer);
            btn.removeClass('disable').html('获取认证码');
          }
        },1000);
      }
    });
  });

});