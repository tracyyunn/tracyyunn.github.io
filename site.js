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

// 選單：目前所在頁面的項目變藍色；Resume 一次下載中英兩個版本
window.addEventListener('DOMContentLoaded', function () {
  var page = location.pathname.split('/').pop() || 'index.html';
  var nav = document.querySelector('.nav ul');
  if (!nav) return;
  nav.querySelectorAll('a:not(.lang):not(.resume)').forEach(function (a) {
    var t = a.getAttribute('href') || '';
    var isAbout = /about\.html$/.test(t);
    var isWork = /index\.html#work$/.test(t);
    if ((isAbout && page === 'about.html') || (isWork && page !== 'about.html')) a.setAttribute('aria-current', 'page');
  });
  var r = nav.querySelector('a.resume');
  if (!r) return;
  var base = /\/en\//.test(location.pathname) ? '../resume/' : 'resume/';
  r.addEventListener('click', function (e) {
    e.preventDefault();
    ['tracy-wang-resume-zh.pdf', 'tracy-wang-resume-en.pdf'].forEach(function (name, i) {
      setTimeout(function () {
        var a = document.createElement('a');
        a.href = base + name; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
      }, i * 400);
    });
  });
});

// 手機整頁選單：點了選單裡的連結就關掉
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('.nav ul a');
  if (!a) return;
  var nav = a.closest('.nav');
  if (!nav.classList.contains('open')) return;
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
  var b = nav.querySelector('.menu-btn'); if (b) b.setAttribute('aria-expanded', 'false');
});

// 選單捲動效果：捲動後毛玻璃＋變矮；往下捲收起、往上捲出現（電腦版）
(function () {
  var last = 0;
  function onScroll() {
    var y = window.scrollY, nav = document.querySelector('.nav');
    if (!nav) return;
    nav.classList.toggle('scrolled', y > 12);
    nav.classList.toggle('hide', y > last && y > 160 && !nav.classList.contains('open'));
    last = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('DOMContentLoaded', onScroll);
  window.addEventListener('load', onScroll);
})();
