const BLOG_NAV = [
  { href: "/list.html", label: "글 목록" },
  { href: "https://tigrelli.com/about.html", label: "소개" },
];

function isCurrentBlogPage(href) {
  const path = window.location.pathname;
  if (href === "/") return path === "/" || path === "/index.html";
  return path === href;
}

function renderBlogHeader() {
  const nav = BLOG_NAV.map((item) => {
    const current = isCurrentBlogPage(item.href);
    const cls = current ? "nav-link nav-link-current" : "nav-link";
    const aria = current ? ' aria-current="page"' : "";
    return `<a href="${item.href}" class="${cls}"${aria}>${item.label}</a>`;
  }).join('<span class="site-nav-sep" aria-hidden="true">·</span>');
  return `<header class="site-header"><div class="site-header-inner"><a href="/" class="wordmark"><img class="wordmark-icon" src="/assets/images/tigrelli-icon.webp" alt="" width="32" height="32"><span class="wordmark-text">Tigrelli Blog</span></a><nav class="site-nav" aria-label="블로그 메뉴">${nav}</nav></div></header>`;
}

function renderBlogFooter() {
  const year = new Date().getFullYear();
  return `<footer class="site-footer"><div class="site-footer-inner"><p class="footer-contact">Tigrelli의 개인 블로그 &middot; <a href="https://tigrelli.com/">Portfolio ↗</a></p><p class="footer-copyright">&copy; ${year} Tigrelli. All rights reserved.</p></div></footer>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");
  if (headerEl) headerEl.outerHTML = renderBlogHeader();
  if (footerEl) footerEl.outerHTML = renderBlogFooter();

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".post-share-btn");
    if (!btn) return;
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        const original = btn.textContent;
        btn.textContent = "링크 복사됨";
        setTimeout(() => {
          btn.textContent = original;
        }, 1500);
      });
    }
  });
});
