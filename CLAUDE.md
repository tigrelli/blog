# 블로그 새 글 발행 체크리스트

1. `posts/템플릿.html`을 `posts/YYYY-MM-DD-영문슬러그.html`로 복사한 뒤 `[ ]` 표시된 부분을 채운다.
   - `<head>` 최상단의 Google Tag Manager `<script>`와 `<body>` 시작 직후의 `<noscript>` 태그(GTM-T4PW649N)는 템플릿에 이미 포함되어 있으니 절대 지우지 않는다. 템플릿을 거치지 않고 새 HTML을 직접 작성하는 경우에도 이 두 스니펫을 반드시 넣는다.
2. `posts.json`에 같은 slug로 메타데이터(title, date, category, tags, summary, thumbnail, readTime)를 추가한다.
   - `category`는 `categories.json`에 있는 값 중 하나를 그대로 사용한다.
3. canonical 링크, og:url, og:image, JSON-LD의 URL을 실제 slug에 맞게 채운다.
4. 커버/썸네일 이미지가 아직 없으면 임시 이미지(`/assets/images/blog-tigrelli.webp` 등)로 자리만 잡고, 실제 이미지가 준비되면 교체한다.
5. `scripts/build_seo.py`는 커밋 시 pre-commit hook(`.githooks/pre-commit`)이 자동 실행하므로 따로 실행하지 않아도 된다.
   - posts.json, posts/, scripts/build_seo.py 중 하나라도 커밋에 포함되면 hook이 돌고, 갱신된 파일을 같은 커밋에 넣는다.
   - hook은 이 PC에서만 설정되어 있다(`git config core.hooksPath .githooks`). 새로 clone했거나 hook 없이 커밋한 경우 `python3 scripts/build_seo.py`를 직접 실행한다.
   - `sitemap.xml` 재생성, `index.html`/`list.html`의 정적 글 카드 갱신, 각 글의 og:url/og:image를 posts.json 기준으로 맞춘다.
   - 홈/목록의 카드는 JS로 그려지기 때문에, 이 단계를 빠뜨리면 JS를 실행하지 않는 크롤러와 AI 웹 도구가 새 글 링크를 찾지 못한다.
   - 카드 마크업을 바꿀 때는 `assets/js/blog-posts.js`의 `renderPostCard`와 스크립트의 `render_post_card`를 함께 수정한다.
