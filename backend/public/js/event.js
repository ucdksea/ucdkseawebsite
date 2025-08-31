// ./js/event.js

let currentSlideIndex = 0;
let slides = [];        // 팝업의 큰 이미지들 (imageUrl 우선)
let slideTexts = [];    // 팝업 설명 (URL-encoded 원본 문자열)
let slidePosters = [];  // 포스터 원본 URL (meta.posterUrl)
let slideLinks = [];    // 링크 (formUrl > instagramUrl > linkUrl)

// ----- 유틸 -----
function debounce(fn, wait) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}
function safeGetAttr(el, name) {
  if (!el) return ""; const v = el.getAttribute(name);
  return typeof v === "string" ? v : "";
}
if (typeof window.replacePlaceholders !== "function") {
  window.replacePlaceholders = (text) => text || "";
}

// 런타임 포스터 토큰(<img-poster/>) 치환
function replaceRuntimePlaceholders(text, { posterUrl = "", link = "", alt = "event poster" } = {}) {
  text = text || "";
  if (!posterUrl) return text.replace(/<img-poster\/>/g, "");
  const src = (typeof ensureFile2 === "function") ? ensureFile2(posterUrl) : posterUrl;

  const imgHtml =
    '<span style="display:inline-block;width:auto;height:auto;box-shadow:0 0 10px rgba(0,0,0,0.5);">' +
      '<img src="' + src + '" data-original="' + posterUrl + '" alt="' + alt + '" style="width:100%;height:auto;" ' +
      'onerror="if(!this.dataset.fallback){this.dataset.fallback=1;this.src=this.getAttribute(\'data-original\');}" />' +
    '</span>';

  return text.replace(
    /<img-poster\/>/g,
    '<br>' + (link ? ('<a href="' + link + '" target="_blank" rel="noopener">' + imgHtml + '</a>') : imgHtml)
  );
}

// 현재 DOM으로부터 슬라이드 데이터 구성
function rebuildSlides() {
  slides = []; slideTexts = []; slidePosters = []; slideLinks = [];

  const grid = document.getElementById("polaroidGrid");
  const imgs = grid
    ? grid.querySelectorAll(".event-item .polaroid img")
    : document.querySelectorAll(".event-item .polaroid img");

  imgs.forEach((img) => {
    const large     = safeGetAttr(img, "data-large") || img.currentSrc || img.src || "";
    const textEnc   = safeGetAttr(img, "data-text-enc");    // ← URL-encoded 설명
    const posterUrl = safeGetAttr(img, "data-poster") || ""; // ← meta.posterUrl
    const link      = safeGetAttr(img, "data-link") || "";

    if (!large) return;
    slides.push(large);
    slideTexts.push(textEnc || "");   // 디코딩은 렌더 시점에
    slidePosters.push(posterUrl);
    slideLinks.push(link);
  });
}

function initializeGallery() {
  rebuildSlides();
  const grid = document.getElementById("polaroidGrid");
  if (grid) {
    const observer = new MutationObserver(debounce(rebuildSlides, 100));
    observer.observe(grid, { childList: true, subtree: true });
  }
}

// 팝업 열기
function expandImage(cardEl) {
  const popup = document.getElementById("imagePopup");
  const popupImage = document.getElementById("popupImage");
  const popupText = document.getElementById("popupText");
  if (!popup || !popupImage || !popupText) return;

  const img = cardEl.querySelector("img");
  if (!img) return;

  const largeUrl   = safeGetAttr(img, "data-large") || img.currentSrc || img.src || "";
  const textEnc    = safeGetAttr(img, "data-text-enc") || "";
  const posterUrl  = safeGetAttr(img, "data-poster") || "";
  const link       = safeGetAttr(img, "data-link") || "";

  // 설명 디코드 → 정적 토큰 치환 → 런타임 포스터 치환
  let text = textEnc ? decodeURIComponent(textEnc) : "";
  text = window.replacePlaceholders(text);
  text = replaceRuntimePlaceholders(text, { posterUrl, link, alt: "event poster" });

  // "$" 기준 라인 렌더
  const lines = text.split("$");
  let formatted = "";
  lines.forEach((line, i) => {
    formatted += (i === 0)
      ? `<p style="font-weight:bold;font-size:27px;">${line}</p>`
      : `<p style="font-size:13px;">${line}</p>`;
  });

  popup.style.display = "flex";
  popupImage.src = largeUrl;       // 팝업 메인 이미지는 일반 이미지(imageUrl)
  popupText.innerHTML = formatted; // 설명 + 포스터(토큰)

  // 현재 인덱스 동기화
  if (!slides.length) rebuildSlides();
  const idx = slides.indexOf(largeUrl);
  currentSlideIndex = idx >= 0 ? idx : 0;
}

// 팝업 슬라이드 이동
function changeSlide(dir) {
  if (!slides.length) return;
  currentSlideIndex += dir;
  if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
  if (currentSlideIndex < 0) currentSlideIndex = slides.length - 1;

  const popupImage = document.getElementById("popupImage");
  const popupText = document.getElementById("popupText");
  if (!popupImage || !popupText) return;

  popupImage.src = slides[currentSlideIndex];

  let text = slideTexts[currentSlideIndex] || "";
  text = text ? decodeURIComponent(text) : "";
  text = window.replacePlaceholders(text);
  text = replaceRuntimePlaceholders(text, {
    posterUrl: slidePosters[currentSlideIndex],
    link:      slideLinks[currentSlideIndex],
    alt:       "event poster",
  });

  const lines = text.split("$");
  let formatted = "";
  lines.forEach((line, i) => {
    formatted += (i === 0)
      ? `<p style="font-weight:bold;font-size:27px;">${line}</p>`
      : `<p style="font-size:13px;">${line}</p>`;
  });
  popupText.innerHTML = formatted;
}

function closeImage() {
  const popup = document.getElementById("imagePopup");
  if (popup) popup.style.display = "none";
}

document.addEventListener("DOMContentLoaded", initializeGallery);
window.expandImage = expandImage;
window.changeSlide = changeSlide;
window.closeImage = closeImage;
