import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  onSnapshot 
} from 'firebase/firestore';

// ---------------------------------------------------------------------------
// 1. FIREBASE INITIALIZATION & CONFIGURATION SETUP
// ---------------------------------------------------------------------------
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : {
      apiKey: "AIzaSyDemoKey-HokkaidoPixelPlanner",
      authDomain: "hokkaido-pixel-quest.firebaseapp.com",
      projectId: "hokkaido-pixel-quest",
      storageBucket: "hokkaido-pixel-quest.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:hokkaido-pixel-quest"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'hokkaido-pixel-quest-v1';

// ---------------------------------------------------------------------------
// 2. SVG MINECRAFT ICONS (Pixel Art Style)
// ---------------------------------------------------------------------------
const MinecraftIcons = {
  Creeper: () => (
    <svg width="24" height="24" viewBox="0 0 16 16" className="inline-block fill-current">
      <rect x="0" y="0" width="16" height="16" fill="#55aa55" />
      <rect x="2" y="3" width="4" height="4" fill="#000" />
      <rect x="10" y="3" width="4" height="4" fill="#000" />
      <rect x="6" y="7" width="4" height="5" fill="#000" />
      <rect x="4" y="9" width="2" height="5" fill="#000" />
      <rect x="10" y="9" width="2" height="5" fill="#000" />
    </svg>
  ),
  Sword: () => (
    <svg width="20" height="20" viewBox="0 0 16 16" className="inline-block">
      <path d="M13 1h2v2h-2zM11 3h2v2h-2zM9 5h2v2H9zM7 7h2v2H7zM5 9h2v2H5z" fill="#55ffff" />
      <path d="M14 2h1v1h-1zM12 4h1v1h-1zM10 6h1v1h-1zM8 8h1v1h-1zM6 10h1v1h-1z" fill="#ffffff" />
      <path d="M3 11h2v2H3zM2 13h2v2H2z" fill="#aa5500" />
      <path d="M4 10h1v1H4zM2 12h1v1H2z" fill="#552200" />
      <path d="M5 12h2v1H5zM2 10h1v2H2zM12 2h1v2h-1zM10 4h1v2h-1zM8 6h1v2H8zM6 8h1v2H6z" fill="#00aaaa" />
    </svg>
  ),
  Pickaxe: () => (
    <svg width="20" height="20" viewBox="0 0 16 16" className="inline-block">
      <path d="M10 1h5v2h-5zM13 3h2v3h-2z" fill="#55ffff" />
      <path d="M11 2h3v1h-3zM14 3h1v2h-1z" fill="#ffffff" />
      <path d="M9 2h2v2H9zM12 5h2v2h-2z" fill="#00aaaa" />
      <path d="M8 5h2v2H8zM6 7h2v2H6zM4 9h2v2H4zM2 11h2v2H2zM0 13h2v2H0z" fill="#7d5233" />
      <path d="M1 14h1v1H1zM3 12h1v1H3zM5 10h1v1H5zM7 8h1v1H7zM9 6h1v1H9z" fill="#4d321e" />
    </svg>
  ),
  Chest: () => (
    <svg width="20" height="20" viewBox="0 0 16 16" className="inline-block">
      <rect x="1" y="2" width="14" height="12" fill="#865225" />
      <rect x="0" y="2" width="16" height="12" fill="none" stroke="#2a1608" strokeWidth="1" />
      <rect x="2" y="3" width="12" height="1" fill="#b8773d" />
      <rect x="1" y="6" width="14" height="1" fill="#2a1608" />
      <rect x="7" y="5" width="2" height="3" fill="#dddddd" stroke="#000" strokeWidth="0.5" />
    </svg>
  ),
  Emerald: () => (
    <svg width="18" height="18" viewBox="0 0 16 16" className="inline-block">
      <polygon points="5,1 11,1 15,5 15,11 11,15 5,15 1,11 1,5" fill="#55ff55" />
      <polygon points="6,3 10,3 13,6 13,10 10,13 6,13 3,10 3,6" fill="#00aa00" />
      <rect x="6" y="5" width="3" height="3" fill="#ffffff" />
    </svg>
  ),
  Porkchop: () => (
    <svg width="18" height="18" viewBox="0 0 16 16" className="inline-block">
      <path d="M3 4c2-2 6-3 9-1s4 6 2 9-5 4-8 2S1 6 3 4z" fill="#ff7777" />
      <circle cx="6" cy="7" r="1.5" fill="#ffffff" />
      <path d="M2 13l2-2" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Bed: () => (
    <svg width="20" height="20" viewBox="0 0 16 16" className="inline-block">
      <rect x="1" y="7" width="14" height="4" fill="#cc2222" />
      <rect x="1" y="5" width="4" height="4" fill="#ffffff" />
      <rect x="1" y="11" width="2" height="3" fill="#553311" />
      <rect x="13" y="11" width="2" height="3" fill="#553311" />
    </svg>
  ),
  Minecart: () => (
    <svg width="20" height="20" viewBox="0 0 16 16" className="inline-block">
      <path d="M2 5h12l-1 7H3L2 5z" fill="#888888" stroke="#333" strokeWidth="1" />
      <circle cx="5" cy="13" r="1.5" fill="#333" />
      <circle cx="11" cy="13" r="1.5" fill="#333" />
    </svg>
  )
};

// ---------------------------------------------------------------------------
// 3. MEMBER & ITINERARY DATA
// ---------------------------------------------------------------------------
const MEMBERS = [
  { id: 'ginny', name: 'Ginny', role: '隊長 / 魔法師 (Mage)', class: 'Spellcaster', hp: '100/100', status: 'ONLINE', isPresent: true, avatar: '🧙‍♀️', armor: 'Enchanted Silk Robe' },
  { id: 'henry', name: 'Henry (H)', role: '先鋒 / 攻擊手 (Attacker / DPS)', class: 'Berserker', hp: '120/120', status: 'ONLINE', isPresent: true, avatar: '⚔️', armor: 'Netherite Armor' },
  { id:
