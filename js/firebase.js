import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';
const config={projectId:'profound-handbook-z3skh',appId:'1:34016814266:web:30865e0746c21237d04e83',apiKey:'AIzaSyA1kmXjyPTkO0grVOunMorlOoARLd2w',authDomain:'profound-handbook-z3skh.firebaseapp.com',storageBucket:'profound-handbook-z3skh.firebasestorage.app',messagingSenderId:'34016814266'};
const app=initializeApp(config); export const auth=getAuth(app); export const db=getFirestore(app);
export {onAuthStateChanged,signInWithEmailAndPassword,signOut,collection,addDoc,getDocs,query,orderBy,limit,serverTimestamp};
