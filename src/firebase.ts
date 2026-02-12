// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXisXolT6AuKyXPf3KQHLuGROTaVRi67E",
    authDomain: "website-ead5f.firebaseapp.com",
    projectId: "website-ead5f",
    storageBucket: "website-ead5f.firebasestorage.app",
    messagingSenderId: "841133823692",
    appId: "1:841133823692:web:063d78f31533e17e5b5469"
  };

// 1. 앱 초기화 (시동 걸기)
const app = initializeApp(firebaseConfig);

// 2. 기능별로 내보내기 (다른 파일에서 가져다 쓰기 위해)
export const auth = getAuth(app);       // 로그인 담당
export const storage = getStorage(app); // 파일 업로드 담당
export const db = getFirestore(app);    // 데이터 저장 담당 (게시글 등)