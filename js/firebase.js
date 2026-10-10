import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, sendEmailVerification, signOut } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';
// Web API keys for Firebase are public by design. Access is controlled by firestore.rules.
const config={projectId:'profound-handbook-z3skh',appId:'1:34016814266:web:30865e0746c21237d04e83',apiKey:'AIzaSyA1km1IvXjyPTkO0grVOunMorlOoARLd2w',authDomain:'profound-handbook-z3skh.firebaseapp.com',storageBucket:'profound-handbook-z3skh.firebasestorage.app',messagingSenderId:'34016814266'};
const DB_ID='ai-studio-asstudio-a4c0c11f-272a-4140-b122-5ed482a959e7';
const app=initializeApp(config);
export const auth=getAuth(app);
export const googleProvider=new GoogleAuthProvider();
export const db=getFirestore(app,DB_ID);
export async function submitInquiry(d){
  const id='web_'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
  await setDoc(doc(db,'inquiries',id),{clientName:d.clientName,businessName:d.businessName,contactChannel:d.contactChannel,scopeSummary:d.scopeSummary,source:'website_contact_form',status:'new',createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
  return id;
}
export {onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,signInWithPopup,GoogleAuthProvider,sendPasswordResetEmail,sendEmailVerification,signOut,collection,doc,getDoc,setDoc,getDocs,query,orderBy,limit,updateDoc,serverTimestamp};

