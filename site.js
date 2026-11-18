// 站內換頁：用瀏覽器的 View Transitions 交叉淡入（CSS @view-transition），選單固定不動、不會閃白
// Work / About 切換：先讓白色滑塊滑過去，再換頁
window.addEventListener('DOMContentLoaded', function () {
  var seg = document.querySelector('.nav-seg');
  if (!seg) return;
  var links = seg.querySelectorAll('a');
  var page = location.pathname.split('/').pop() || 'index.html';
  seg.setAttribute('data-active', page === 'about.html' ? 'about' : 'work');
  seg.classList.add('ready');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || window.innerWidth < 810) return;
      var to = /about\.html$/.test(a.getAttribute('href')) ? 'about' : 'work';
      if (to === seg.getAttribute('data-active')) { if (to === 'about') e.preventDefault(); return; }
      e.preventDefault();
      seg.setAttribute('data-active', to);
      links.forEach(function (x) { x.removeAttribute('aria-current'); });
      a.setAttribute('aria-current', 'page');
      setTimeout(function () { location.href = a.href; }, reduce ? 0 : 280);
    });
  });
});

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
    var isWork = /index\.html(#work)?$/.test(t);
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
// 用 requestAnimationFrame 每一格檢查捲動位置，比只聽 scroll 事件穩定
(function () {
  var last = -1, ticking = false;
  function update() {
    ticking = false;
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (y === last) return;
    nav.classList.toggle('scrolled', y > 12);
    nav.classList.toggle('hide', last >= 0 && y > last && y > 160 && !nav.classList.contains('open'));
    last = y;
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', req, { passive: true });
  document.addEventListener('scroll', req, { passive: true, capture: true });
  window.addEventListener('resize', req);
  window.addEventListener('DOMContentLoaded', req);
  window.addEventListener('load', req);
  setInterval(update, 200);
})();
