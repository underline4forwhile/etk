/* ============================================================
   永恒暮初王国 · 全站公共脚本 script.js
   目录折叠：点击按钮切换，宽度动画过渡，记忆状态
   ============================================================ */
(function () {
  var btn = document.getElementById('dirToggle');
  if (!btn) return;

  // 恢复状态期间禁用过渡动画，避免页面加载时"跳一下"
  document.body.classList.add('no-anim');

  var collapsed = false;
  try { collapsed = localStorage.getItem('yongmu-dir') === '1'; } catch (e) {}
  function setState(c) {
    collapsed = c;
    document.body.classList.toggle('side-collapsed', c);
    btn.textContent = c ? '»' : '«';
    btn.setAttribute('aria-label', c ? '展开目录' : '收起目录');
    try { localStorage.setItem('yongmu-dir', c ? '1' : '0'); } catch (e) {}
  }
  btn.addEventListener('click', function () { setState(!collapsed); });
  if (location.hash === '#collapsed') { setState(true); }
  else { setState(collapsed); }

  // 目录子分类折叠：点 ▾ 切换（不触发父链接跳转），状态按栏目分别记忆
  document.querySelectorAll('.dir-item .dir-caret').forEach(function (c) {
    c.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var item = c.parentElement;
      item.classList.toggle('closed');
      var key = 'yongmu-sub-' + item.getAttribute('href');
      try { localStorage.setItem(key, item.classList.contains('closed') ? '1' : '0'); } catch (e2) {}
    });
  });
  // 切页后：每个栏目各自恢复上次的折叠状态（互不影响）
  document.querySelectorAll('.dir-item .dir-caret').forEach(function (c) {
    var item = c.parentElement;
    var key = 'yongmu-sub-' + item.getAttribute('href');
    var saved = false;
    try { saved = localStorage.getItem(key) === '1'; } catch (e) {}
    if (saved) item.classList.add('closed');
  });

  // 状态落定后，下一帧恢复过渡动画
  requestAnimationFrame(function () {
    document.body.classList.remove('no-anim');
  });
})();
