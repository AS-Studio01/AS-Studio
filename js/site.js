(function(){
'use strict';
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(()=>document.body.classList.add('ready')));
setTimeout(()=>document.body&&document.body.classList.add('ready'),1200);
/* lightweight visitor analytics tracking */
(function trackSiteTraffic(){
  try{
    const path=location.pathname;
    const isDemo=path.includes('/demos/');
    const m=path.match(/\/demos\/([^\/]+)/);
    const payload={
      path:path,
      demo:isDemo?(m?m[1]:'demo'):'studio',
      title:(document.title||'').slice(0,200),
      referrer:(document.referrer||'direct').slice(0,300),
      createdAt:new Date().toISOString()
    };
    fetch('/api/track',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload),
      keepalive:true
    }).catch(function(){});
  }catch(_){}
})();
/* nav */
const nav=document.querySelector('.nav');
if(nav){const light=nav.classList.contains('light');let last=-1;
  const upd=()=>{const hh=document.getElementById('hero'),hs=document.querySelector('.hero-static'),scrub=hh&&getComputedStyle(hh).display!=='none';const th=scrub?hh.offsetHeight-innerHeight*0.55:(hs&&getComputedStyle(hs).display!=='none'?innerHeight*0.8:30);const s=!light&&scrollY>th;if(s!==last){last=s;nav.classList.toggle('solid',s||light)}};
  addEventListener('scroll',upd,{passive:true});upd();
  const mb=document.querySelector('.menu'),ln=document.querySelector('.links');
  if(ln){
    // Ensure "Home" option is always present in the navigation
    const hasHome=Array.from(ln.querySelectorAll('a')).some(a=>(a.textContent||'').trim().toLowerCase()==='home');
    if(!hasHome){
      const homeA=document.createElement('a');
      const prefix=(location.pathname.includes('/legal/')||location.pathname.includes('/work/'))?'../':'';
      homeA.href=prefix+'index.html';
      homeA.textContent='Home';
      if(location.pathname==='/'||location.pathname.endsWith('/index.html')){
        homeA.setAttribute('aria-current','page');
      }
      ln.insertBefore(homeA,ln.firstChild);
    }
  }
  if(mb&&ln){
    mb.addEventListener('click',e=>{
      e.stopPropagation();
      const o=ln.classList.toggle('open');
      mb.setAttribute('aria-expanded',o);
      nav.classList.add('solid');
    });
    document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>{
      ln.classList.remove('open');
      mb.setAttribute('aria-expanded','false');
    }));
    document.addEventListener('click',e=>{
      if(ln.classList.contains('open')&&!ln.contains(e.target)&&!mb.contains(e.target)){
        ln.classList.remove('open');
        mb.setAttribute('aria-expanded','false');
      }
    });
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'&&ln.classList.contains('open')){
        ln.classList.remove('open');
        mb.setAttribute('aria-expanded','false');
        mb.focus();
      }
    });
  }
}
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
/* 2-second door open and close animation */
const door=document.querySelector('.door'),dl=document.querySelector('.door-links');
if(door){let isOpen=false,isAnimating=false,timer=null;
  const setOpenState=open=>{
    if(isAnimating)return;
    isAnimating=true;
    door.classList.add('animating');
    if(open){
      isOpen=true;
      door.classList.remove('is-closed');
      door.classList.add('is-open');
      door.style.setProperty('--p','1');
      clearTimeout(timer);
      timer=setTimeout(()=>{
        isAnimating=false;
        door.classList.remove('animating');
        door.classList.add('done');
        dl&&dl.classList.add('show');
      },2000);
    }else{
      isOpen=false;
      door.classList.remove('done','is-open');
      dl&&dl.classList.remove('show');
      door.classList.add('is-closed');
      door.style.setProperty('--p','0');
      clearTimeout(timer);
      timer=setTimeout(()=>{
        isAnimating=false;
        door.classList.remove('animating','is-closed');
      },2000);
    }
  };
  const toggle=e=>{
    if(e){e.preventDefault();e.stopPropagation()}
    if(isAnimating)return;
    setOpenState(!isOpen);
  };
  if(reduce()){
    isOpen=true;
    door.classList.add('done','is-open');
    dl&&dl.classList.add('show');
    door.style.setProperty('--p','1');
  }
  door.addEventListener('click',toggle);
  door.addEventListener('contextmenu',e=>{e.preventDefault();e.stopPropagation();return false});
  door.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(e)}});
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
