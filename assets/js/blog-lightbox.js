// 본문 이미지 크게 보기 (전체 화면 레이어)
// 사용법: <a href="큰 이미지" data-lightbox><img ...></a>
// 같은 페이지의 data-lightbox 링크를 한 묶음으로 보고 이전/다음으로 넘길 수 있다.
// 설명은 링크가 속한 <figure>의 <figcaption>을 쓰고, 없으면 img의 alt를 쓴다.
(function () {
  let links = [];
  let index = 0;
  let overlay, img, caption, counter, closeBtn, lastFocus;

  function captionOf(link) {
    const fig = link.closest("figure");
    const cap = fig && fig.querySelector("figcaption");
    if (cap) return cap.textContent.trim();
    const thumb = link.querySelector("img");
    return thumb ? thumb.alt : "";
  }

  function build() {
    overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "이미지 크게 보기");
    overlay.hidden = true;
    overlay.innerHTML = `
      <button type="button" class="lightbox-close" aria-label="닫기">&times;</button>
      <button type="button" class="lightbox-nav lightbox-prev" aria-label="이전 이미지">&#8249;</button>
      <figure class="lightbox-figure">
        <img class="lightbox-img" alt="">
        <figcaption class="lightbox-caption"><span class="lightbox-text"></span><span class="lightbox-counter"></span></figcaption>
      </figure>
      <button type="button" class="lightbox-nav lightbox-next" aria-label="다음 이미지">&#8250;</button>`;
    document.body.appendChild(overlay);

    img = overlay.querySelector(".lightbox-img");
    caption = overlay.querySelector(".lightbox-text");
    counter = overlay.querySelector(".lightbox-counter");
    closeBtn = overlay.querySelector(".lightbox-close");

    closeBtn.addEventListener("click", close);
    overlay.querySelector(".lightbox-prev").addEventListener("click", () => show(index - 1));
    overlay.querySelector(".lightbox-next").addEventListener("click", () => show(index + 1));
    // 이미지·버튼 바깥(어두운 배경)을 누르면 닫는다.
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.classList.contains("lightbox-figure")) close();
    });

    // 모바일 좌우 스와이프
    let startX = null;
    overlay.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    overlay.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  function show(i) {
    index = (i + links.length) % links.length;
    const link = links[index];
    const thumb = link.querySelector("img");
    img.src = link.href;
    img.alt = thumb ? thumb.alt : "";
    caption.textContent = captionOf(link);
    counter.textContent = links.length > 1 ? `${index + 1} / ${links.length}` : "";
    overlay.classList.toggle("lightbox-single", links.length < 2);
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    overlay.hidden = false;
    document.documentElement.classList.add("lightbox-open");
    document.addEventListener("keydown", onKey);
    closeBtn.focus();
  }

  function close() {
    overlay.hidden = true;
    img.removeAttribute("src");
    document.documentElement.classList.remove("lightbox-open");
    document.removeEventListener("keydown", onKey);
    if (lastFocus) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(index - 1);
    else if (e.key === "ArrowRight") show(index + 1);
    else if (e.key === "Tab") {
      // 레이어 안에서만 포커스가 돌도록 한다.
      const items = [...overlay.querySelectorAll("button")].filter((b) => b.offsetParent !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    links = [...document.querySelectorAll("a[data-lightbox]")];
    if (!links.length) return;
    build();
    links.forEach((link, i) => {
      link.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return; // 새 탭으로 열기는 그대로 둔다.
        e.preventDefault();
        open(i);
      });
    });
  });
})();
