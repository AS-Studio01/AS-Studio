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
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('paused',document.hidden));
})();
