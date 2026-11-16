// 站內換頁：先淡出再跳轉，新頁面載入時淡入
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  document.documentElement.classList.add('page-enter');
  window.addEventListener('DOMContentLoaded', function () {
    requestAnimationFrame(function () {
      document.documentElement.classList.remove('page-enter');
    });
  });

  // 從上一頁按返回時，瀏覽器可能直接還原淡出後的畫面，要清掉
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) document.documentElement.classList.remove('page-leave');
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var url = new URL(a.href, location.href);
    var samePage = url.pathname === location.pathname;
    if (url.origin !== location.origin || samePage || !/\.html$/.test(url.pathname)) return;
    e.preventDefault();
    document.documentElement.classList.add('page-leave');
    setTimeout(function () { location.href = a.href; }, 250);
  });
})();

// 作品頁：往下捲超過一個畫面後，右下角出現「回到頂端」按鈕
window.addEventListener('DOMContentLoaded', function () {
  if (!document.querySelector('main.cs')) return;
  var b = document.createElement('button');
  b.type = 'button';
  b.className = 'to-top';
  b.setAttribute('aria-label', '回到頂端');
  b.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  b.addEventListener('click', function () {
    var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  });
  document.body.appendChild(b);
  function check() { b.classList.toggle('show', window.scrollY > window.innerHeight); }
  window.addEventListener('scroll', check, { passive: true });
  check();
});
