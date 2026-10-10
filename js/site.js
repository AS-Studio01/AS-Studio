(function(){
'use strict';
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(()=>document.body.classList.add('ready')));
setTimeout(()=>document.body&&document.body.classList.add('ready'),1200);
/* nav */
const nav=document.querySelector('.nav');
if(nav){const light=nav.classList.contains('light');let last=-1;
  const upd=()=>{const s=!light&&scrollY>(document.getElementById('hero')?innerHeight*6.5:30);if(s!==last){last=s;nav.classList.toggle('solid',s||light)}};
  addEventListener('scroll',upd,{passive:true});upd();
  const mb=document.querySelector('.menu'),ln=document.querySelector('.links');
  if(mb)mb.addEventListener('click',()=>{const o=ln.classList.toggle('open');mb.setAttribute('aria-expanded',o);nav.classList.add('solid')});
  document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>ln.classList.remove('open')));
}
/* private workspace: tap the wordmark (or the (c) line in the footer) five times quickly */
(function(){var n=0,t=null;function tap(e,el){n++;clearTimeout(t);t=setTimeout(function(){n=0},1800);if(n>=5){n=0;e.preventDefault();var h=(document.querySelector('[data-admin]')||{}).getAttribute&&document.querySelector('[data-admin]').getAttribute('data-admin');if(h)location.href=h}}
  var logo=document.querySelector('.logo');
  if(logo)logo.addEventListener('click',function(e){var same=new URL(logo.href,location.href).pathname.replace(/index\.html$/,'')===location.pathname.replace(/index\.html$/,'');
    if(same){e.preventDefault();if(n===0&&scrollY>40)scrollTo({top:0,behavior:'smooth'})}tap(e,logo)});
  var f=document.querySelector('.fsecret');if(f)f.addEventListener('click',function(e){tap(e,f)})})();
/* reveals */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
/* self-drawing arch */
const arch=document.querySelector('.arch-draw');
if(arch){const paths=[...arch.querySelectorAll('path[data-draw]')],glow=arch.querySelector('.fillglow');let lp=-1;
  const set=p=>{paths.forEach(pt=>{pt.style.strokeDashoffset=String(1-p)});if(glow)glow.style.opacity=(Math.max(0,p-.7)*1.1).toFixed(2)};
  paths.forEach(p=>p.setAttribute('pathLength','1'));
  const upd=()=>{if(reduce()){set(1);return}const r=arch.getBoundingClientRect();const p=Math.round(clamp01((innerHeight*0.85-r.top)/(innerHeight*0.6))*100)/100;if(p!==lp){lp=p;set(p)}};
  function clamp01(v){return Math.min(1,Math.max(0,v))}
  addEventListener('scroll',upd,{passive:true});upd();
}
/* hold to open the door */
const door=document.querySelector('.door'),dl=document.querySelector('.door-links');
if(door){let p=0,holding=false,raf=null,done=false,last=0;
  const apply=()=>{door.style.setProperty('--p',p.toFixed(3))};
  const finish=()=>{done=true;door.classList.add('done');dl&&dl.classList.add('show');p=1;apply()};
  const step=t=>{const dt=Math.min(64,t-(last||t));last=t;
    if(holding)p=Math.min(1,p+dt/1400);else if(!done)p=Math.max(0,p-dt/700);
    apply();if(p>=1&&!done){finish();raf=null;return}
    if((holding&&p<1)||(!holding&&p>0&&!done)){raf=requestAnimationFrame(step)}else{raf=null;last=0}};
  const start=e=>{if(done)return;e.preventDefault();holding=true;if(raf===null){last=0;raf=requestAnimationFrame(step)}};
  const stop=()=>{holding=false;if(!done&&raf===null&&p>0){last=0;raf=requestAnimationFrame(step)}};
  if(reduce()){finish();p=1;apply()}
  door.addEventListener('pointerdown',start);addEventListener('pointerup',stop);addEventListener('pointercancel',stop);
  door.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();finish()}});
}
/* process line fills as the section scrolls */
const steps=document.querySelector('.steps'),sl=document.querySelector('.stepline');
if(steps&&sl){const items=[...steps.children];let lastP=-1;
  const upd=()=>{if(reduce()){items.forEach(i=>i.classList.add('on'));sl.style.setProperty('--sp',1);return}
    const r=steps.getBoundingClientRect();const p=Math.round(Math.min(1,Math.max(0,(innerHeight*0.8-r.top)/(r.height+innerHeight*0.3)))*100)/100;
    if(p!==lastP){lastP=p;sl.style.setProperty('--sp',p);items.forEach((it,i)=>it.classList.toggle('on',p>=(i+0.4)/items.length*0.95))}};
  addEventListener('scroll',upd,{passive:true});upd()}
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('paused',document.hidden));
})();
