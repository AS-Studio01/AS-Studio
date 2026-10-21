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
/* canvas renderer for script-based ad animation on hero */
const heroCanvas = document.getElementById('heroCanvas');
const heroCtx = heroCanvas ? heroCanvas.getContext('2d') : null;

function renderHeroFrame(ctx, w, h, p, t) {
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = '#060d0c';
  ctx.fillRect(0, 0, w, h);

  const radGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 40, w * 0.5, h * 0.5, w * 0.7);
  radGrad.addColorStop(0, 'rgba(20, 50, 44, 0.45)');
  radGrad.addColorStop(0.6, 'rgba(12, 28, 25, 0.6)');
  radGrad.addColorStop(1, '#050a09');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, w, h);

  // Elegant golden particle dust
  for (let i = 0; i < 30; i++) {
    const px = (Math.sin(i * 127 + t * 0.3 + p * 4) * 0.5 + 0.5) * w;
    const py = (Math.cos(i * 311 + t * 0.25 + p * 3) * 0.5 + 0.5) * h;
    const size = (Math.sin(i + t) * 0.5 + 0.5) * 2 + 1;
    ctx.fillStyle = i % 3 === 0 ? 'rgba(229, 190, 122, 0.55)' : 'rgba(0, 242, 254, 0.35)';
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Scene 1: Kinetic Brand Intro (p < 0.22)
  if (p < 0.22) {
    const alpha = Math.min(1, Math.max(0, (0.22 - p) / 0.05));
    ctx.globalAlpha = alpha;

    // Glowing Arch
    const archY = h * 0.32;
    const archScale = 1.0 + Math.sin(t * 1.5) * 0.03;
    ctx.save();
    ctx.translate(w * 0.5, archY);
    ctx.scale(archScale, archScale);
    ctx.strokeStyle = '#e5be7a';
    ctx.lineWidth = 5;
    ctx.shadowColor = 'rgba(229, 190, 122, 0.6)';
    ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.arc(0, -10, 42, Math.PI, 0, false);
    ctx.lineTo(42, 38);
    ctx.moveTo(-42, -10);
    ctx.lineTo(-42, 38);
    ctx.stroke();

    ctx.fillStyle = '#b98a50';
    ctx.beginPath();
    ctx.arc(0, -5, 18, Math.PI, 0, false);
    ctx.lineTo(18, 38);
    ctx.lineTo(-18, 38);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.font = '700 44px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 12;
    ctx.fillText('AS STUDIO', w * 0.5, h * 0.49);
    ctx.fillStyle = '#e5be7a';
    ctx.fillText('.', w * 0.5 + 120, h * 0.49);

    ctx.font = '600 24px system-ui, sans-serif';
    ctx.fillStyle = '#e5be7a';
    ctx.fillText('CALM, FAST WEBSITES FOR INDEPENDENT BUSINESSES', w * 0.5, h * 0.58);

    ctx.font = '400 16px ui-monospace, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Sub-Second Speeds · Handcrafted Code · Zero Page Builders', w * 0.5, h * 0.65);
  }
  // Scene 2: Tactile Showcase Demos (0.22 <= p < 0.46)
  else if (p >= 0.22 && p < 0.46) {
    const rel = (p - 0.22) / 0.24;
    const alpha = Math.min(1, Math.min(rel * 3, (1 - rel) * 3));
    ctx.globalAlpha = Math.max(0.2, alpha);

    ctx.textAlign = 'center';
    ctx.font = '700 13px ui-monospace, monospace';
    ctx.fillStyle = '#e5be7a';
    ctx.fillText('WORKING CONCEPT DEMONSTRATIONS', w * 0.5, h * 0.18);

    ctx.font = '700 34px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Tactile Design Engineered for Client Trust', w * 0.5, h * 0.26);

    const cw = Math.min(380, w * 0.38);
    const ch = 200;
    const cy = h * 0.36;

    // Card 1: VitalCare
    const c1x = w * 0.5 - cw - 16;
    ctx.fillStyle = 'rgba(15, 26, 24, 0.88)';
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(c1x, cy, cw, ch, 14);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '700 18px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('VitalCare Multispecialty Clinic', c1x + 22, cy + 42);
    ctx.font = '400 13.5px system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Healthcare · 6 Clinical Departments · Doctor Roster', c1x + 22, cy + 76);
    ctx.fillStyle = '#10b981';
    ctx.fillText('✓ Low-friction booking & real operating schedules', c1x + 22, cy + 120);

    // Card 2: Fold Atelier
    const c2x = w * 0.5 + 16;
    ctx.fillStyle = 'rgba(15, 26, 24, 0.88)';
    ctx.strokeStyle = 'rgba(229, 190, 122, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(c2x, cy, cw, ch, 14);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 18px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Fold Atelier Fashion Label', c2x + 22, cy + 42);
    ctx.font = '400 13.5px system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Artisanal Fashion · Size Guides · Quick-View Drawer', c2x + 22, cy + 76);
    ctx.fillStyle = '#e5be7a';
    ctx.fillText('✓ Editorial typography & sensory garment swatches', c2x + 22, cy + 120);
  }
  // Scene 3: Telemetry & Cognitive Latency (0.46 <= p < 0.70)
  else if (p >= 0.46 && p < 0.70) {
    const rel = (p - 0.46) / 0.24;
    const alpha = Math.min(1, Math.min(rel * 3, (1 - rel) * 3));
    ctx.globalAlpha = Math.max(0.2, alpha);

    ctx.textAlign = 'center';
    ctx.font = '700 13px ui-monospace, monospace';
    ctx.fillStyle = '#00f2fe';
    ctx.fillText('REAL-TIME ANALYTICS & TELEMETRY', w * 0.5, h * 0.2);

    ctx.font = '700 36px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Measured in Milliseconds, Not Seconds', w * 0.5, h * 0.28);

    // Sine wave telemetry
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 0; x < w * 0.7; x += 6) {
      const y = h * 0.48 + Math.sin(x * 0.03 + t * 4) * 22 + Math.cos(x * 0.015 - t * 2) * 14;
      const rx = w * 0.15 + x;
      if (x === 0) ctx.moveTo(rx, y);
      else ctx.lineTo(rx, y);
    }
    ctx.stroke();

    ctx.font = '700 48px ui-monospace, monospace';
    ctx.fillStyle = '#00f2fe';
    ctx.fillText('0.38 ms', w * 0.5, h * 0.65);
    ctx.font = '500 14px ui-monospace, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('COGNITIVE INGRESS LATENCY · 100% CLEAN SYNTAX', w * 0.5, h * 0.72);
  }
  // Scene 4: Lighthouse 100/100 (0.70 <= p < 0.88)
  else if (p >= 0.70 && p < 0.88) {
    const rel = (p - 0.70) / 0.18;
    const alpha = Math.min(1, Math.min(rel * 3, (1 - rel) * 3));
    ctx.globalAlpha = Math.max(0.2, alpha);

    ctx.textAlign = 'center';
    ctx.font = '700 13px ui-monospace, monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText('GOOGLE LIGHTHOUSE BENCHMARK', w * 0.5, h * 0.18);

    ctx.font = '700 36px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('100 / 100 Performance Across All Metrics', w * 0.5, h * 0.27);

    const labels = ['Performance', 'Accessibility', 'Best Practices', 'SEO'];
    const spacing = Math.min(180, w * 0.2);
    const startX = w * 0.5 - spacing * 1.5;
    const rY = h * 0.48;

    for (let i = 0; i < 4; i++) {
      const rx = startX + i * spacing;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(rx, rY, 44, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.font = '700 28px ui-monospace, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('100', rx, rY + 10);

      ctx.font = '600 13px system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(labels[i], rx, rY + 70);
    }
  }
  // Scene 5: Packages & Clear Next Steps (p >= 0.88)
  else {
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center';
    ctx.font = '700 13px ui-monospace, monospace';
    ctx.fillStyle = '#e5be7a';
    ctx.fillText('THREE TAILORED SIZES · ONE HIGH STANDARD', w * 0.5, h * 0.18);

    ctx.font = '700 36px system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Step Inside. Planned in a Day, Handed Over in Full.', w * 0.5, h * 0.27);

    const pw = Math.min(260, w * 0.26);
    const ph = 180;
    const py = h * 0.36;
    const pkgs = [
      { name: 'Starter', price: '$95', info: '1 Page · 3 Days · Roasteries & Boutiques' },
      { name: 'Growth', price: '$275', info: '3 Pages · 5 Days · Medical & Fashion' },
      { name: 'Signature', price: '$600', info: '6 Pages · 7 Days · Full Flagship Studio' }
    ];

    pkgs.forEach((pkg, idx) => {
      const px = w * 0.5 - pw * 1.5 - 16 + idx * (pw + 16);
      ctx.fillStyle = idx === 1 ? 'rgba(32, 92, 83, 0.5)' : 'rgba(15, 26, 24, 0.85)';
      ctx.strokeStyle = idx === 1 ? '#00f2fe' : 'rgba(229, 190, 122, 0.35)';
      ctx.lineWidth = idx === 1 ? 2 : 1;
      ctx.beginPath();
      ctx.roundRect(px, py, pw, ph, 14);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 18px system-ui, sans-serif';
      ctx.fillStyle = idx === 1 ? '#00f2fe' : '#e5be7a';
      ctx.fillText(pkg.name, px + pw * 0.5, py + 38);

      ctx.font = '700 40px ui-monospace, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(pkg.price, px + pw * 0.5, py + 92);

      ctx.font = '400 12.5px system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(pkg.info, px + pw * 0.5, py + 140);
    });

    ctx.font = '600 15px ui-monospace, monospace';
    ctx.fillStyle = '#e5be7a';
    ctx.fillText('★ ORDER SAFELY ON FIVERR (@as_studio01) · 100% SOURCE CODE OWNERSHIP ★', w * 0.5, h * 0.78);
  }

  ctx.restore();
}

/* lerp loop that rests */
let target=0,shown=0,rafId=null,lastTick=0,heroOnScreen=true;
function tick(now){
  const dt=Math.min(100,now-(lastTick||now));lastTick=now;
  shown+=(target-shown)*(1-Math.pow(1-0.16,dt/16.667));
  if(Math.abs(target-shown)<0.0005){shown=target;rafId=null;lastTick=0}else{rafId=requestAnimationFrame(tick)}
  if(heroCanvas && heroCtx){
    renderHeroFrame(heroCtx, heroCanvas.width, heroCanvas.height, shown, now * 0.001);
  }
  updateCaptions(shown);
}
function onScroll(){target=heroProgress();if(rafId===null&&heroOnScreen)rafId=requestAnimationFrame(tick)}
new IntersectionObserver(es=>{heroOnScreen=es[0].isIntersecting;if(heroOnScreen&&scrubOn)onScroll()}).observe(hero);

/* instant canvas readiness with poster backdrop */
let started=false;
function initHeroOnce(){
  if(started)return;started=true;
  posterEl.style.backgroundImage="url('"+POSTER_URL+"')";
  stage.classList.add('video-ready');
  if(ring) ring.style.setProperty('--ld', 0);
  if(heroCanvas && heroCtx){
    renderHeroFrame(heroCtx, heroCanvas.width, heroCanvas.height, heroProgress(), performance.now() * 0.001);
  }
}

/* live gates: Phones and touch devices instantly skip heavy video decoding */
const GATES=['(max-width: 980px)','(pointer: coarse)','(orientation: portrait) and (max-width: 1024px)','(orientation: landscape) and (pointer: coarse) and (max-height: 560px)','(prefers-reduced-motion: reduce)'];
let scrubOn=false;
function enableScrub(){
  if(GATES.some(q=>matchMedia(q).matches)) return;
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
