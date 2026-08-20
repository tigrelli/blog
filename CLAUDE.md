# 블로그 새 글 발행 체크리스트

1. `posts/템플릿.html`을 `posts/YYYY-MM-DD-영문슬러그.html`로 복사한 뒤 `[ ]` 표시된 부분을 채운다.
   - `<head>` 최상단의 Google Tag Manager `<script>`와 `<body>` 시작 직후의 `<noscript>` 태그(GTM-T4PW649N)는 템플릿에 이미 포함되어 있으니 절대 지우지 않는다. 템플릿을 거치지 않고 새 HTML을 직접 작성하는 경우에도 이 두 스니펫을 반드시 넣는다.
2. `posts.json`에 같은 slug로 메타데이터(title, date, category, tags, summary, thumbnail, readTime)를 추가한다.
   - `category`는 `categories.json`에 있는 값 중 하나를 그대로 사용한다.
3. canonical 링크와 JSON-LD의 URL을 실제 slug에 맞게 채운다.
4. 커버/썸네일 이미지가 아직 없으면 임시 이미지(`/assets/images/blog-tigrelli.webp` 등)로 자리만 잡고, 실제 이미지가 준비되면 교체한다.
