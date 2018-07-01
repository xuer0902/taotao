$(function () {
  // 1.点击搜索，根据输入框的关键字跳转到商品列表页，并且把关键字传递过去 同时需要记录在本地存储
  // 2.初始页面的时候，会根据当前记录的历史搜索记录 去渲染历史记录列表
  // 3.删除一条历史记录
  // 4. 再追加历史记录的时候，有相同的先删除，追加到新的到前面，最多十条数据，如果多了，去掉旧的
  // 5. 清空历史记录
  // 6. 点击之前的历史能跳转到对应的商品列表

  // 约定一个本地存储 key: lt_history   value :json字符串数组
  var ltHistoryString = localStorage.getItem('lt_history') || '[]';
  var ltHistoryList = JSON.parse(ltHistoryString);
  // 渲染数据列表
  $('.lt_history').html(template('ltHistoryTemplate', {list: ltHistoryList}));
  // 根据索引删除
  $('.lt_history').on('tap', 'li span', function () {
    var index = $(this).data('index');
    // 删除
    ltHistoryList.splice(index, 1);
    // 删除本地存储的该数据
    localStorage.setItem('lt_history', JSON.stringify(ltHistoryList));
    // 刷新页面
    $('.lt_history').html(template('ltHistoryTemplate', {list: ltHistoryList}));
  })
  // 清空历史记录
  $('.lt_history').on('tap', '.tit a', function () {
    ltHistoryList = [];
    localStorage.setItem('lt_history', '[]');
    $('.lt_history').html(template('ltHistoryTemplate', {list: ltHistoryList}));
  })
  // 绑定搜索点击事件 点击去搜索关键字 如果没有关键字，提示输入关键字
  $('.lt_search input').val('');
  $('.lt_search a').on('tap', function () {
    var key = $.trim($('.lt_search input').val());
    if (!key) {
      mui.toast('请输入关键字')
      return false;
    }
    addHistory(key);
    // 跳转到商品列表页 转码 防止特殊数据在URL哪里取下来的时候取不到
    location.href = 'searchList.html?key=' + encodeURIComponent(key);
  })

  // 页面跳转
  $('.lt_history').on('tap', 'ul a', function () {
    location.href = 'searchList.html?key=' + encodeURIComponent($(this).data('key'));
  });

  function addHistory (key) {
    //相同的先删除，追加到新的到前面，最多十条数据，如果多了，去掉旧的
    var isHaveSame = false;
    var sameIndex = null;
    $.each(ltHistoryList, function (i, item) {
      if (key == item) {
        isHaveSame = true
        sameIndex = i;
      }
    });
    if (isHaveSame) {
      ltHistoryList.splice(sameIndex, 1);
      ltHistoryList.push(key);
    } else {
      ltHistoryList.push(key);
      if (ltHistoryList.length > 10) {
        ltHistoryList.splice(0, ltHistoryList.length - 10);
      }
    }
    localStorage.setItem('lt_history', JSON.stringify(ltHistoryList))
  }
})