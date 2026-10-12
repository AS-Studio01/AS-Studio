/* AS Studio scroll hero: scrubbed video, paced caption bands, live static-hero gates */
(function(){
'use strict';
const hero=document.getElementById('hero');
if(!hero) return;
const stage=hero.querySelector('.stage'),video=document.getElementById('heroVideo'),posterEl=hero.querySelector('.poster'),ring=hero.querySelector('.ring');
const bands=[...hero.querySelectorAll('.band')].map(el=>({el,a:+el.dataset.a,b:+el.dataset.b,ramp:el.dataset.ramp?+el.dataset.ramp:0,first:el.dataset.first==='1',last:el.dataset.last==='1',op:-1,k:-1,ks:-1,kb:-1}));
const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
const smooth=(p,e0,e1)=>{const t=clamp((p-e0)/(e1-e0),0,1);return t*t*(3-2*t)};
const VIDEO_URL='/assets/video/hero-scrub.mp4',POSTER_URL='/assets/video/hero-poster.webp';

/* split headline text once, seeded so offsets are identical every load */
function rng(seed){let s=seed>>>0;return()=>(s=(s*1664525+1013904223)>>>0)/4294967296}
bands.forEach((bd,bi)=>{
  const t=bd.el.querySelector('.split'); if(!t) return;
  const text=t.textContent.trim(),r=rng(77+bi*131);
  const words=text.split(/\s+/);
  t.setAttribute('aria-hidden','true');
  const sr=document.createElement('span');sr.className='sr';sr.textContent=text;t.before(sr);
  t.textContent='';
  let ci=0;const total=text.replace(/\s/g,'').length;
  words.forEach((w,wi)=>{
    const ws=document.createElement('span');ws.className='w';
    ws.style.setProperty('--th',(wi/words.length*0.5).toFixed(3));
    [...w].forEach(ch=>{const cs=document.createElement('span');cs.className='c';cs.textContent=ch;
      cs.style.setProperty('--th',(r()*0.55).toFixed(3));cs.style.setProperty('--jx',((r()-.5)*90).toFixed(0)+'px');
      cs.style.setProperty('--jy',((r()-.5)*70).toFixed(0)+'px');cs.style.setProperty('--jr',((r()-.5)*40).toFixed(0)+'deg');ws.appendChild(cs);ci++});
    t.appendChild(ws);if(wi<words.length-1)t.appendChild(document.createTextNode(' '));
  });
});

function heroProgress(){const range=hero.offsetHeight-innerHeight;return range>0?clamp((scrollY-hero.offsetTop)/range,0,1):0}

/* captions: delta-gated writes */
let loadK=0,loadStart=0;
function updateCaptions(p){
  const now=performance.now();
  if(loadK<1){loadK=clamp((now-loadStart)/1100,0,1);loadK=loadK*loadK*(3-2*loadK)}
  bands.forEach((bd,i)=>{
    const {a,b}=bd;const f=Math.min(0.02,(b-a)/3);
    let op=smooth(p,a,a+f)*(1-smooth(p,b-f,b));
    if(bd.first)op=1-smooth(p,b-f,b);
    if(bd.last)op=smooth(p,a,a+f);
    op=Math.round(op*100)/100;
    const ramp=bd.ramp||Math.min(0.025,(b-a)*0.35);
    let k=clamp((p-a)/ramp,0,1);
    if(bd.first)k=Math.max(k,loadK);
    k=Math.round(k*125)/125;
    if(op!==bd.op){bd.op=op;bd.el.style.opacity=op;bd.el.classList.toggle('on',op>0.5)}
    if(k!==bd.k){bd.k=k;bd.el.style.setProperty('--k',k)}
    if(bd.last){
      const ks=Math.round(clamp((p-a-0.05)/0.04,0,1)*50)/50,kb=Math.round(clamp((p-a-0.075)/0.04,0,1)*50)/50;
      if(ks!==bd.ks){bd.ks=ks;bd.el.style.setProperty('--ks',ks)}
      if(kb!==bd.kb){bd.kb=kb;bd.el.style.setProperty('--kb',kb)}
    }
  });
}

/* seek gate */
let seekBusy=false,pendingTime=null;
function requestSeek(t){
  if(!video.duration)return;
  if(seekBusy){pendingTime=t;return}
  seekBusy=true;video.currentTime=t;
}
video.addEventListener('seeked',()=>{seekBusy=false;if(pendingTime!==null){const t=pendingTime;pendingTime=null;requestSeek(t)}});
video.addEventListener('error',()=>{seekBusy=false;pendingTime=null;failVideo()});

/* lerp loop that rests */
let target=0,shown=0,rafId=null,lastTick=0,heroOnScreen=true;
function tick(now){
  const dt=Math.min(100,now-(lastTick||now));lastTick=now;
  shown+=(target-shown)*(1-Math.pow(1-0.16,dt/16.667));
  if(Math.abs(target-shown)<0.0005){shown=target;rafId=null;lastTick=0}else{rafId=requestAnimationFrame(tick)}
  requestSeek(shown*video.duration);
  updateCaptions(shown);
}
function onScroll(){target=heroProgress();if(rafId===null&&heroOnScreen)rafId=requestAnimationFrame(tick)}
new IntersectionObserver(es=>{heroOnScreen=es[0].isIntersecting;if(heroOnScreen&&scrubOn)onScroll()}).observe(hero);

/* poster first, then blob */
let started=false;
function initHeroOnce(){
  if(started)return;started=true;
  posterEl.style.backgroundImage="url('"+POSTER_URL+"')";
  const im=new Image();let go=false;
  const run=()=>{if(go)return;go=true;loadBlob().catch(failVideo)};
  im.onload=run;im.onerror=run;im.src=POSTER_URL;setTimeout(run,4000);
}
async function loadBlob(){
  const ctrl=new AbortController();let wd=setTimeout(()=>ctrl.abort(),20000);
  const res=await fetch(VIDEO_URL,{priority:'low',signal:ctrl.signal});
  if(!res.ok)throw new Error('video '+res.status);
  const total=Number(res.headers.get('Content-Length'))||5532510;
  const reader=res.body.getReader();const chunks=[];let got=0,lastRing=0;
  for(;;){
    const {done,value}=await reader.read();if(done)break;
    clearTimeout(wd);wd=setTimeout(()=>ctrl.abort(),20000);
    chunks.push(value);got+=value.length;
    const frac=Math.min(1,got/total),now=performance.now();
    if(now-lastRing>100||frac===1){lastRing=now;ring.style.setProperty('--ld',Math.round(126*(1-frac)))}
  }
  clearTimeout(wd);ring.style.setProperty('--ld',0);
  video.src=URL.createObjectURL(new Blob(chunks,{type:'video/mp4'}));video.load();
  video.addEventListener('canplay',()=>{requestSeek(heroProgress()*video.duration);stage.classList.add('video-ready')},{once:true});
}
function failVideo(){stage.classList.add('video-failed');if(ring&&ring.parentNode){const c=document.createElement('span');c.className='cue';c.textContent='Scroll';ring.replaceWith(c)}}

/* live gates, character-for-character identical to the CSS */
const GATES=['(max-width: 720px)','(orientation: portrait) and (max-width: 1024px)','(orientation: portrait) and (pointer: coarse)','(orientation: landscape) and (pointer: coarse) and (max-height: 560px)','(prefers-reduced-motion: reduce)'];
let scrubOn=false;
function enableScrub(){
  if(scrubOn)return;scrubOn=true;loadStart=performance.now();
  initHeroOnce();addEventListener('scroll',onScroll,{passive:true});
  bands.forEach(b=>{b.op=-1;b.k=-1;b.ks=-1;b.kb=-1});
  updateCaptions(heroProgress());onScroll();
  if(loadK<1)kickLoad();
}
function kickLoad(){const step=()=>{updateCaptions(heroProgress());if(loadK<1)requestAnimationFrame(step)};requestAnimationFrame(step)}
function disableScrub(){
  if(!scrubOn)return;scrubOn=false;removeEventListener('scroll',onScroll);
  if(rafId!==null){cancelAnimationFrame(rafId);rafId=null}
}
function applyHeroMode(){if(GATES.some(q=>matchMedia(q).matches))disableScrub();else enableScrub()}
const MQLS=GATES.map(q=>matchMedia(q));MQLS.forEach(m=>m.addEventListener('change',applyHeroMode));
applyHeroMode();
})();
