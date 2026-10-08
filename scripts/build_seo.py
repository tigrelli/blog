#!/usr/bin/env python3
"""posts.json을 기준으로 크롤러용 정적 산출물을 갱신한다.

- sitemap.xml 생성
- index.html(최신 글 4개) / list.html(전체 글)에 글 카드를 정적 HTML로 미리 렌더링
  (JS가 로드되면 같은 마크업으로 다시 그리므로 화면은 동일하다)
- 각 글의 og:url / og:image 메타 태그를 posts.json 값에 맞춘다

새 글을 posts.json에 추가한 뒤 저장소 루트에서 `python3 scripts/build_seo.py`를 실행한다.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "https://blog.tigrelli.com"


def esc(value):
    return html.escape(str(value), quote=True)


def render_post_card(post):
    # assets/js/blog-posts.js의 renderPostCard와 같은 마크업을 유지한다.
    thumb = (
        f'<div class="post-card-thumb"><img src="{esc(post["thumbnail"])}" alt="{esc(post["title"])}" loading="lazy"></div>'
        if post.get("thumbnail") else ""
    )
    read_time = (
        f'<span class="post-card-readtime">{esc(post["readTime"])}</span>'
        if post.get("readTime") else ""
    )
    return (
        f'<a class="post-card" href="/posts/{esc(post["slug"])}.html" data-category="{esc(post["category"])}">'
        f'{thumb}<div class="post-card-body"><div class="post-card-meta">'
        f'<span class="post-category">{esc(post["category"])}</span>{read_time}</div>'
        f'<h3 class="post-card-title">{esc(post["title"])}</h3>'
        f'<p class="post-card-excerpt">{esc(post["summary"])}</p>'
        f'<span class="post-card-date">{esc(post["date"])}</span></div></a>'
    )


def fill_container(path, container_id, posts):
    """<div ... id="container_id">...</div> 안을 정적 카드로 채운다."""
    text = path.read_text(encoding="utf-8")
    pattern = re.compile(rf'(<div class="post-grid" id="{container_id}">).*?(</div>\n)', re.S)
    cards = "\n".join(render_post_card(p) for p in posts)
    new_text, count = pattern.subn(lambda m: f"{m.group(1)}\n{cards}\n{m.group(2)}", text, count=1)
    if count != 1:
        raise SystemExit(f"{path.name}: #{container_id} 컨테이너를 찾지 못했습니다.")
    path.write_text(new_text, encoding="utf-8")


def set_meta(text, prop, content):
    tag = f'<meta property="{prop}" content="{esc(content)}">'
    pattern = re.compile(rf'<meta property="{re.escape(prop)}" content="[^"]*">')
    if pattern.search(text):
        return pattern.sub(lambda _: tag, text, count=1)
    return text.replace('<meta property="og:type" content="article">',
                        f'<meta property="og:type" content="article">\n{tag}', 1)


def update_post_meta(post):
    path = ROOT / "posts" / f"{post['slug']}.html"
    if not path.exists():
        raise SystemExit(f"posts.json의 slug에 해당하는 파일이 없습니다: {path.name}")
    text = path.read_text(encoding="utf-8")
    url = f"{BASE_URL}/posts/{post['slug']}.html"
    image = BASE_URL + (post.get("thumbnail") or "/assets/images/blog-tigrelli.webp")
    text = set_meta(text, "og:url", url)
    text = set_meta(text, "og:image", image)
    path.write_text(text, encoding="utf-8")
    # 템플릿 placeholder가 남아 있는 등 날짜 형식이 아니면 posts.json의 date를 쓴다.
    modified = re.search(r'"dateModified":\s*"(\d{4}-\d{2}-\d{2})"', text)
    return url, modified.group(1) if modified else post["date"]


def main():
    posts = json.loads((ROOT / "posts.json").read_text(encoding="utf-8"))
    posts.sort(key=lambda p: p["date"], reverse=True)

    entries = [(f"{BASE_URL}/", posts[0]["date"] if posts else None),
               (f"{BASE_URL}/list.html", posts[0]["date"] if posts else None)]
    entries += [update_post_meta(p) for p in posts]

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, lastmod in entries:
        lines.append(f"  <url><loc>{esc(loc)}</loc>" + (f"<lastmod>{lastmod}</lastmod>" if lastmod else "") + "</url>")
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")

    fill_container(ROOT / "index.html", "latest-posts", posts[:4])
    fill_container(ROOT / "list.html", "post-grid", posts)

    print(f"sitemap.xml: URL {len(entries)}개, 글 {len(posts)}개 반영 완료")


if __name__ == "__main__":
    main()
