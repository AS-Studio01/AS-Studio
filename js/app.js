import { saveInquiry } from './firebase.js';
const $=s=>document.querySelector(s); const $$=s=>document.querySelectorAll(s);
const progress=$('.progress'); addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=(h>0?scrollY/h*100:0)+'%'});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08}); $$('.reveal').forEach(e=>io.observe(e));
$('.menu')?.addEventListener('click',()=>document.body.classList.toggle('nav-open'));
const form=$('#contact-form');form?.addEventListener('submit',async e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form));const status=$('#form-status');status.textContent='Sending…';try{await saveInquiry({clientName:data.name,businessName:data.business||'',contactChannel:data.email,scopeSummary:data.message,targetBudget:data.budget||'Flexible'});status.textContent='Thank you. Your enquiry has been received.';form.reset()}catch(err){status.textContent='Your enquiry was saved locally. Please also email asbusinessofficial01@gmail.com if the issue persists.'}});
