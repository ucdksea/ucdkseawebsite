// public/js/uploader.js
const API_ORIGIN =
  location.hostname.endsWith('ucdksea.com')
    ? 'https://api.ucdksea.com'
    : 'http://localhost:4000';

async function uploadPoster(file) {
  const fd = new FormData();
  fd.append('file', file); // ← 반드시 'file'
  const r = await fetch(`${API_ORIGIN}/api/upload`, {
    method: 'POST',
    body: fd,
    credentials: 'include',
  });
  const j = await r.json().catch(()=> ({}));
  if (!r.ok) throw new Error(j?.error || `UPLOAD_${r.status}`);
  return j.url; // ex) https://api.ucdksea.com/uploads/posts/abc.jpg
}

const uploadingRef = { current: false };

async function onPick(file) {
  if (uploadingRef.current) return null; // 🔒 중복 방지
  uploadingRef.current = true;
  try {
    const url = await uploadPoster(file);
    return url;
  } finally {
    uploadingRef.current = false;        // 🔓 해제
  }
}

// === DOM 바인딩 (id는 네 페이지의 실제 id에 맞게) ===
document.addEventListener('DOMContentLoaded', () => {
  const fileInput   = document.querySelector('#poster-file');
  const previewImg  = document.querySelector('#poster-preview');            // 미리보기 img (선택)
  const imageUrlInp = document.querySelector('input[name="imageUrl"]');     // 서버 전송용 hidden input

  fileInput?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await onPick(file);
      if (!url) return;
      if (previewImg)  previewImg.src = url;        // 미리보기
      if (imageUrlInp) imageUrlInp.value = url;     // 이후 /api/admin/posts 전송시 사용
    } catch (err) {
      console.error(err);
      alert(`업로드 실패: ${err.message || err}`);
    } finally {
      // 선택적으로 파일 입력 초기화
      // fileInput.value = '';
    }
  });
});
