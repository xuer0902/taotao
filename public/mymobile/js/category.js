$(function () {
  //1  分类动态展示，默认选中第一个分类，同时渲染对应的二级分类
  // 1.1 获取数据
  getFirstCateData(function (data) {
    // 1.2 一级分类渲染数据
    // console.log(data)
    $('.lt_cateLeft ul').html(template('firstTemplate', data))
    // 1.3 获取第一个一级分类的id
    var firstCateId = data.rows[0].id;
    // 1.4 获取二级分类数据
    getSecondCateData({
      id: firstCateId
    }, function (data) {
      // console.log(data);
      // 1.5 二级分类渲染数据
      $('.lt_cateRight ul').html(template('secondTemplate', data))
    });
  })
  // 2. 点击左侧的时候，右侧要动态加载
  // 使用事件委托
  $('.lt_cateLeft').on('tap', 'a', function () {
    // 2.1 根据当前的一级分类去加载二级分类
    var firstCateId = $(this).data('id');
    console.log(firstCateId)
    // 2.4 改变当前样式
    $('.lt_cateLeft li').removeClass('now');
    $(this).parent().addClass('now');
    // 2.2 获取二级分类数据
    getSecondCateData({
      id: firstCateId
    }, function (data) {
      // 2.3 二级分类渲染数据
      $('.lt_cateRight ul').html(template('secondTemplate', data))
      // onerror 图片加载失败事件 HTML元素上面可以添加这个属性 onerror = 'this.src = images/none.jpg'
      // 在没有数据的时候需要友情提示一下 判断rows的长度
    })
  })
});
var getFirstCateData = function (callback) {
  $.ajax({
    type: 'get',
    url: '/category/queryTopCategory',
    data: {},
    dataType: 'json',
    success: function (data) {
      callback && callback(data)
    }
  })
}
var getSecondCateData = function (params, callback) {
  $.ajax({
    type: 'get',
    url: '/category/querySecondCategory',
    data: params,
    dataType: 'json',
    success: function (data) {
      callback && callback(data)
    }
  })
}