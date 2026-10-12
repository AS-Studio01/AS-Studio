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
  if(mb&&ln){
    mb.addEventListener('click',e=>{e.stopPropagation();const o=ln.classList.toggle('open');mb.setAttribute('aria-expanded',o);nav.classList.add('solid')});
    document.addEventListener('click',e=>{if(ln.classList.contains('open')&&!ln.contains(e.target)&&e.target!==mb){ln.classList.remove('open');mb.setAttribute('aria-expanded','false')}});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ln.classList.contains('open')){ln.classList.remove('open');mb.setAttribute('aria-expanded','false')}});
    document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>{ln.classList.remove('open');mb.setAttribute('aria-expanded','false')}));
  }
}
/* lightweight site traffic analytics */
(function trackSiteTraffic(){
  try{
    const payload={
      demo:'studio-main',
      path:location.pathname,
      title:document.title,
      referrer:document.referrer||'direct',
      device:window.innerWidth<=768?'mobile':(window.innerWidth<=1024?'tablet':'desktop'),
      width:window.innerWidth,
      ts:Date.now()
    };
    const KEY='as_site_traffic';
    const raw=localStorage.getItem(KEY);
    const data=raw?JSON.parse(raw):{total:0,byPath:{},lastVisit:null};
    data.total=(data.total||0)+1;
    data.byPath[location.pathname]=(data.byPath[location.pathname]||0)+1;
    data.lastVisit=payload;
    localStorage.setItem(KEY,JSON.stringify(data));
    if(navigator.sendBeacon){
      navigator.sendBeacon('/api/track',JSON.stringify(payload));
    }else{
      fetch('/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true}).catch(()=>{});
    }
  }catch(_){}
})();
/* private workspace: tap the wordmark (or the (c) line in the footer) five times quickly */
(function(){var n=0,t=null;function tap(e,el){n++;clearTimeout(t);t=setTimeout(function(){n=0},1800);if(n>=5){n=0;e.preventDefault();var h=(document.querySelector('[data-admin]')||{}).getAttribute&&document.querySelector('[data-admin]').getAttribute('data-admin')||'/x7q2m9r4v8k1p6z3/';if(h){if(!h.startsWith('/'))h='/'+h;location.href=h}}}
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
/* hold or tap to open the door */
const door=document.querySelector('.door'),dl=document.querySelector('.door-links');
if(door){let p=0,holding=false,raf=null,done=false,last=0,pressStart=0;
  const apply=()=>{door.style.setProperty('--p',p.toFixed(3))};
  const finish=()=>{done=true;holding=false;door.classList.add('done');dl&&dl.classList.add('show');p=1;apply()};
  const step=t=>{const dt=Math.min(64,t-(last||t));last=t;
    if(holding)p=Math.min(1,p+dt/850);else if(!done)p=Math.max(0,p-dt/500);
    apply();if(p>=1&&!done){finish();raf=null;return}
    if((holding&&p<1)||(!holding&&p>0&&!done)){raf=requestAnimationFrame(step)}else{raf=null;last=0}};
  const start=e=>{if(done)return;if(e.button&&e.button!==0)return;e.preventDefault();
    try{door.setPointerCapture(e.pointerId)}catch(_){}
    holding=true;pressStart=Date.now();if(raf===null){last=0;raf=requestAnimationFrame(step)}};
  const stop=e=>{if(e&&e.pointerId){try{door.releasePointerCapture(e.pointerId)}catch(_){}}
    const elapsed=Date.now()-pressStart;holding=false;
    if(!done&&elapsed<300&&elapsed>0){finish();return}
    if(!done&&raf===null&&p>0){last=0;raf=requestAnimationFrame(step)}};
  if(reduce()){finish();p=1;apply()}
  door.oncontextmenu=e=>{e.preventDefault();e.stopPropagation();return false};
  door.addEventListener('pointerdown',start);
  door.addEventListener('pointerup',stop);
  door.addEventListener('pointercancel',stop);
  door.addEventListener('contextmenu',e=>{e.preventDefault();e.stopPropagation();return false});
  window.addEventListener('contextmenu',e=>{if(door&&(e.target===door||door.contains(e.target))){e.preventDefault();e.stopPropagation()}},{capture:true});
  door.addEventListener('touchstart',e=>{if(!done)e.preventDefault()},{passive:false});
  door.addEventListener('touchend',e=>{if(!done)e.preventDefault()},{passive:false});
  door.addEventListener('touchmove',e=>{if(!done)e.preventDefault()},{passive:false});
  door.addEventListener('click',e=>{e.preventDefault();if(!done)finish()});
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
