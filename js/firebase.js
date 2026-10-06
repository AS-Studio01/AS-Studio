import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';
const config={projectId:'profound-handbook-z3skh',appId:'1:34016814266:web:30865e0746c21237d04e83',apiKey:'AIzaSyA1km1IvXjyPTkO0grVOunMorlOoARLd2w',authDomain:'profound-handbook-z3skh.firebaseapp.com',storageBucket:'profound-handbook-z3skh.firebasestorage.app',messagingSenderId:'34016814266',measurementId:''};
const app=initializeApp(config); export const auth=getAuth(app); export const db=getFirestore(app);
export async function saveInquiry(data){const record={...data,status:'new',source:'website_contact_form',createdAt:serverTimestamp(),updatedAt:serverTimestamp()}; try{return await addDoc(collection(db,'inquiries'),record)}catch(e){localStorage.setItem('asstudio_last_inquiry',JSON.stringify({...data,createdAt:new Date().toISOString()})); throw e}}
export async function getRecentInquiries(){const q=query(collection(db,'inquiries'),orderBy('createdAt','desc'),limit(50));const snap=await getDocs(q);return snap.docs.map(d=>({id:d.id,...d.data()}))}
