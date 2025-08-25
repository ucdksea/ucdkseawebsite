///Users/stephanie/Desktop/ucdksea-website/tailwind.config.js
//** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./register.html"],   // 우선 이 파일만 콕 집어
  theme: { extend: {} },
  // (임시) 누락 방지. 해결되면 지워도 됨
  safelist: ["rounded-2xl","px-4","shadow-2xl","ring-1","p-6","md:p-8","grid","gap-10","space-y-4","text-white","border","border-white/15","ring-white/10","bg-white/5","inline-flex","items-center","justify-between","hidden","sm:inline","sticky","top-6","backdrop-blur","pr-10"]
};

