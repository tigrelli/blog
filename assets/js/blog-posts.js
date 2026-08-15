function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function fetchPosts() {
  const res = await fetch("/blog/posts.json", { cache: "no-store" });
  const posts = await res.json();
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function fetchCategories() {
  const res = await fetch("/blog/categories.json", { cache: "no-store" });
  return res.json();
}

function renderPostCard(post) {
  const thumb = post.thumbnail
    ? `<div class="post-card-thumb"><img src="${escapeHtml(post.thumbnail)}" alt="${escapeHtml(post.title)}" loading="lazy"></div>`
    : "";
  const readTime = post.readTime
    ? `<span class="post-card-readtime">${escapeHtml(post.readTime)}</span>`
    : "";
  return `<a class="post-card" href="/blog/posts/${escapeHtml(post.slug)}.html" data-category="${escapeHtml(post.category)}">${thumb}<div class="post-card-body"><div class="post-card-meta"><span class="post-category">${escapeHtml(post.category)}</span>${readTime}</div><h3 class="post-card-title">${escapeHtml(post.title)}</h3><p class="post-card-excerpt">${escapeHtml(post.summary)}</p><span class="post-card-date">${escapeHtml(post.date)}</span></div></a>`;
}
