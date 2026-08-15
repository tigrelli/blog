const BLOG_NAV = [
  { href: "/blog/", label: "블로그 홈" },
  { href: "/blog/list.html", label: "글 목록" },
];

function isCurrentBlogPage(href) {
  const path = window.location.pathname;
  if (href === "/blog/") return path === "/blog/" || path === "/blog/index.html";
  return path === href;
}

function renderBlogHeader() {
  const nav = BLOG_NAV.map((item) => {
    const current = isCurrentBlogPage(item.href);
    const cls = current ? "nav-link nav-link-current" : "nav-link";
    const aria = current ? ' aria-current="page"' : "";
    return `<a href="${item.href}" class="${cls}"${aria}>${item.label}</a>`;
  }).join("");
  return `<header class="site-header"><div class="site-header-inner"><div class="site-header-left"><a href="/blog/" class="wordmark" aria-label="정태희 블로그"><span class="wordmark-badge">TH</span><span class="wordmark-text">Blog</span></a><nav class="site-nav">${nav}</nav></div><a href="/" class="blog-home-link">Portfolio ↗</a></div></header>`;
}

function renderBlogFooter() {
  const year = new Date().getFullYear();
  return `<footer class="site-footer"><div class="site-footer-inner"><p class="footer-contact">tigrelli의 개인 블로그 &middot; <a href="/">Portfolio ↗</a></p><p class="footer-copyright">&copy; ${year} tigrelli. All rights reserved.</p></div></footer>`;
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
