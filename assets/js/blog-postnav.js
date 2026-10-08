function currentPostSlug() {
  // /posts/slug.html 과 확장자 없는 /posts/slug 둘 다 처리한다.
  const match = window.location.pathname.match(/\/posts\/([^/]+?)(?:\.html)?$/);
  return match ? match[1] : null;
}

async function renderBlogPrevNext() {
  const posts = await fetchPosts();
  const slug = currentPostSlug();
  const index = posts.findIndex((p) => p.slug === slug);

  const prev = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null;
  const next = index > 0 ? posts[index - 1] : null;

  const prevHtml = prev ? `<a href="/posts/${prev.slug}.html">&larr; 이전 글</a>` : "<span></span>";
  const nextHtml = next ? `<a href="/posts/${next.slug}.html">다음 글 &rarr;</a>` : "<span></span>";

  return `<div class="detail-prevnext">${prevHtml}<a href="/list.html">목록으로</a>${nextHtml}</div>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const el = document.getElementById("detail-prevnext");
  if (el) el.outerHTML = await renderBlogPrevNext();
});
