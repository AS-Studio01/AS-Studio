(function(){
'use strict';

/* Clean URL address-bar enforcement (strips .html and /index.html in browser address bar) */
(function enforceCleanAddressBar() {
  try {
    const p = window.location.pathname;
    const s = window.location.search || '';
    const h = window.location.hash || '';
    if (p.endsWith('.html') || p.includes('/index.html') || p.includes('x7q2m9r4v8k1p6z3') || p.startsWith('/demos/')) {
      let clean = p;
      if (clean === '/index.html') clean = '/';
      else if (clean === '/packages.html') clean = '/packages';
      else if (clean === '/work.html') clean = '/work';
      else if (clean === '/about.html') clean = '/about';
      else if (clean === '/contact.html') clean = '/contact';
      else if (clean.includes('x7q2m9r4v8k1p6z3')) clean = '/admin';
      else if (clean === '/legal/privacy.html' || clean === '/legal/privacy') clean = '/privacy';
      else if (clean === '/legal/terms.html' || clean === '/legal/terms') clean = '/terms';
      else if (clean === '/legal/disclaimer.html' || clean === '/legal/disclaimer') clean = '/disclaimer';
      else if (clean === '/legal/cancellation-refund.html' || clean === '/legal/cancellation-refund') clean = '/refund';
      else {
        const demoMap = [
          ['/demos/vitalcare-multispeciality-clinic', '/vitalcare'],
          ['/demos/mitti-cafe', '/mitti'],
          ['/demos/fold-atelier', '/fold'],
          ['/demos/atelier-north', '/atelier'],
          ['/demos/apex-residences', '/apex'],
          ['/demos/rao-law', '/rao'],
          ['/demos/delta-os', '/delta'],
        ];
        for (const [folder, prefix] of demoMap) {
          if (clean.startsWith(folder)) {
            clean = clean.replace(folder, prefix);
            break;
          }
        }
        clean = clean.replace(/\/index\.html$/, '').replace(/\/index$/, '').replace(/\.html$/, '');
        if (!clean || clean === '') clean = '/';
      }

      if (clean !== p) {
        window.history.replaceState(null, '', clean + s + h);
      }
    }
  } catch (_) {}
})();

/* Dynamic link click interceptor: rewrites any .html relative href to clean custom URLs */
document.addEventListener('click', function(e) {
  const a = e.target.closest('a');
  if (!a || !a.getAttribute('href')) return;
  const rawHref = a.getAttribute('href');
  if (rawHref.startsWith('http://') || rawHref.startsWith('https://') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('#')) return;

  const cleanMap = {
    'index.html': '/',
    '/index.html': '/',
    '../index.html': '/',
    'packages.html': '/packages',
    '/packages.html': '/packages',
    '../packages.html': '/packages',
    'work.html': '/work',
    '/work.html': '/work',
    '../work.html': '/work',
    'about.html': '/about',
    '/about.html': '/about',
    '../about.html': '/about',
    'contact.html': '/contact',
    '/contact.html': '/contact',
    '../contact.html': '/contact',
    'legal/privacy.html': '/privacy',
    '/legal/privacy.html': '/privacy',
    '../legal/privacy.html': '/privacy',
    'legal/terms.html': '/terms',
    '/legal/terms.html': '/terms',
    '../legal/terms.html': '/terms',
    'legal/disclaimer.html': '/disclaimer',
    '/legal/disclaimer.html': '/disclaimer',
    '../legal/disclaimer.html': '/disclaimer',
    'legal/cancellation-refund.html': '/refund',
    '/legal/cancellation-refund.html': '/refund',
    '../legal/cancellation-refund.html': '/refund',
    'demos/vitalcare-multispeciality-clinic/index.html': '/vitalcare',
    'demos/mitti-cafe/index.html': '/mitti',
    'demos/fold-atelier/index.html': '/fold',
    'demos/atelier-north/index.html': '/atelier',
    'demos/apex-residences/index.html': '/apex',
    'demos/rao-law/index.html': '/rao',
    'demos/delta-os/index.html': '/delta',
    '/x7q2m9r4v8k1p6z3/': '/admin',
    '/x7q2m9r4v8k1p6z3': '/admin',
    '../x7q2m9r4v8k1p6z3/': '/admin'
  };

  const parts = rawHref.split(/([?#].*)/);
  const baseHref = parts[0];
  const queryOrHash = parts.slice(1).join('');
  if (cleanMap[baseHref]) {
    a.setAttribute('href', cleanMap[baseHref] + queryOrHash);
  }
}, true);

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
/* Visual Theme Switcher (Louis Obsidian Dark Glass & Louis Luxury Light) */
(function setupThemeSwitcher() {
  const getStoredTheme = () => {
    try { return localStorage.getItem('as-theme'); } catch (_) { return null; }
  };
  const setStoredTheme = (theme) => {
    try { localStorage.setItem('as-theme', theme); } catch (_) {}
  };

  const applyTheme = (theme, updateStorage) => {
    const isLight = theme === 'light' || theme === 'louis-light';
    const targetTheme = isLight ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', targetTheme);
    if (document.body) {
      document.body.setAttribute('data-theme', targetTheme);
    }
    if (updateStorage) {
      setStoredTheme(targetTheme);
    }
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const icon = btn.querySelector('.theme-icon');
      const text = btn.querySelector('.theme-text');
      if (isLight) {
        if (icon) icon.textContent = '✦';
        if (text) text.textContent = 'Louis Dark';
        btn.setAttribute('aria-label', 'Switch to Louis Obsidian Dark Glass theme');
        btn.title = 'Switch to Louis Obsidian Dark Glass theme';
      } else {
        if (icon) icon.textContent = '✧';
        if (text) text.textContent = 'Louis Light';
        btn.setAttribute('aria-label', 'Switch to Louis Luxury Light theme');
        btn.title = 'Switch to Louis Luxury Light theme';
      }
    });
  };

  const saved = getStoredTheme();
  if (saved) {
    applyTheme(saved, false);
  } else {
    applyTheme('dark', false);
  }

  const initToggleInNav = () => {
    const navIn = document.querySelector('.nav-in');
    if (navIn && !navIn.querySelector('.theme-toggle')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'theme-toggle';
      toggleBtn.type = 'button';
      toggleBtn.setAttribute('aria-label', 'Switch visual theme');
      toggleBtn.innerHTML = '<span class="theme-icon">✧</span><span class="theme-text">Louis Light</span>';
      const menuBtn = navIn.querySelector('.menu');
      if (menuBtn) {
        navIn.insertBefore(toggleBtn, menuBtn);
      } else {
        navIn.appendChild(toggleBtn);
      }
    }
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current, false);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggleInNav);
  } else {
    initToggleInNav();
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-toggle');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next, true);
  });
})();

/* Floating Frosted Glass Legal Policy Compliance Banner */
(function setupPolicyComplianceBanner() {
  const CONSENT_KEY = 'as-policy-accepted-v1';
  try {
    if (localStorage.getItem(CONSENT_KEY) === 'true') {
      return;
    }
  } catch (_) {}

  const initBanner = () => {
    if (document.querySelector('.policy-banner')) return;

    const isSubdir = location.pathname.includes('/legal/') || location.pathname.includes('/work/') || location.pathname.includes('/demos/');
    const prefix = isSubdir ? '../' : '';

    const banner = document.createElement('div');
    banner.className = 'policy-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Legal Policy Compliance Notice');
    banner.innerHTML = `
      <div class="policy-banner-text">
        <strong>Site Policies &amp; Compliance:</strong> By continuing to use our website, you accept and agree to our
        <span class="policy-banner-links">
          <a href="${prefix}legal/privacy.html">Privacy Policy</a>,
          <a href="${prefix}legal/terms.html">Terms of Service</a>,
          <a href="${prefix}legal/disclaimer.html">Disclaimer</a>, and
          <a href="${prefix}legal/cancellation-refund.html">Cancellation &amp; Refund Policy</a>.
        </span>
      </div>
      <div class="policy-banner-acts">
        <button type="button" class="policy-banner-btn" id="acceptPolicyBtn">Accept &amp; Continue</button>
      </div>
    `;

    document.body.appendChild(banner);

    const btn = banner.querySelector('#acceptPolicyBtn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        try {
          localStorage.setItem(CONSENT_KEY, 'true');
        } catch (_) {}
        banner.classList.add('dismissed');
        setTimeout(() => {
          if (banner.parentNode) banner.parentNode.removeChild(banner);
        }, 400);
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBanner);
  } else {
    initBanner();
  }
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
/* Fail-Safe Resilient Reveal */
(function setupRevealObserver() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Immediately make all elements visible so zero content disappears or hides
  elements.forEach(el => el.classList.add('in'));

  if (reduce() || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, {
    root: null,
    rootMargin: '40px 0px 40px 0px',
    threshold: 0
  });

  elements.forEach(el => observer.observe(el));

  window.refreshReveals = () => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  };
})();
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
/* process line fills smoothly with requestAnimationFrame */
const steps=document.querySelector('.steps'),sl=document.querySelector('.stepline');
if(steps&&sl){
  const items=[...steps.children];
  let ticking=false;
  const upd=()=>{
    ticking=false;
    if(reduce()){items.forEach(i=>i.classList.add('on'));sl.style.setProperty('--sp',1);return}
    const r=steps.getBoundingClientRect();
    const p=Math.min(1,Math.max(0,(innerHeight*0.75-r.top)/(r.height+innerHeight*0.2)));
    sl.style.setProperty('--sp',p.toFixed(3));
    items.forEach((it,i)=>{
      const threshold=(i+0.25)/items.length;
      it.classList.toggle('on',p>=threshold);
    });
  };
  const onScroll=()=>{if(!ticking){ticking=true;requestAnimationFrame(upd)}};
  addEventListener('scroll',onScroll,{passive:true});
  upd();
}

/* single-open FAQ accordion with smooth slide animation */
document.querySelectorAll('.faq').forEach(faq=>{
  const allDetails=[...faq.querySelectorAll('details')];
  allDetails.forEach(detail=>{
    const summary=detail.querySelector('summary'),content=detail.querySelector('p');
    if(!summary||!content)return;
    summary.addEventListener('click',e=>{
      e.preventDefault();
      if(reduce()){
        const willOpen=!detail.hasAttribute('open');
        allDetails.forEach(d=>{if(d!==detail)d.removeAttribute('open')});
        if(willOpen)detail.setAttribute('open','');else detail.removeAttribute('open');
        return;
      }
      if(detail.hasAttribute('open')){
        const startHeight=content.offsetHeight;
        content.style.overflow='hidden';
        const anim=content.animate([
          {height:startHeight+'px',opacity:1,transform:'translateY(0)'},
          {height:'0px',opacity:0,transform:'translateY(-6px)'}
        ],{duration:260,easing:'cubic-bezier(0.16,1,0.3,1)'});
        anim.onfinish=()=>{
          detail.removeAttribute('open');
          content.style.overflow='';
          content.style.height='';
        };
      }else{
        allDetails.forEach(other=>{
          if(other!==detail&&other.hasAttribute('open')){
            const oc=other.querySelector('p');
            if(oc){
              const sh=oc.offsetHeight;
              oc.style.overflow='hidden';
              const a=oc.animate([
                {height:sh+'px',opacity:1},
                {height:'0px',opacity:0}
              ],{duration:220,easing:'cubic-bezier(0.16,1,0.3,1)'});
              a.onfinish=()=>{
                other.removeAttribute('open');
                oc.style.overflow='';
                oc.style.height='';
              };
            }else{
              other.removeAttribute('open');
            }
          }
        });
        detail.setAttribute('open','');
        const targetHeight=content.scrollHeight;
        content.style.overflow='hidden';
        const anim=content.animate([
          {height:'0px',opacity:0,transform:'translateY(-6px)'},
          {height:targetHeight+'px',opacity:1,transform:'translateY(0)'}
        ],{duration:300,easing:'cubic-bezier(0.16,1,0.3,1)'});
        anim.onfinish=()=>{
          content.style.overflow='';
          content.style.height='';
        };
      }
    });
  });
});

document.addEventListener('visibilitychange',()=>document.body.classList.toggle('paused',document.hidden));
})();

/* gentle parallax on image bands & hero imagery */
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var bands=[].slice.call(document.querySelectorAll('.imgband'));
  var heroStatic=document.querySelector('.hero-static');
  var stage=document.querySelector('.stage');
  var ticking=false;
  function upd(){
    ticking=false;
    var sy=window.scrollY;
    if(heroStatic&&sy<innerHeight*1.2){
      heroStatic.style.backgroundPositionY=Math.round(sy*0.22)+'px';
    }
    if(stage&&sy<innerHeight*2){
      stage.style.setProperty('--hero-py',(sy*0.12).toFixed(1)+'px');
    }
    bands.forEach(function(b){
      var r=b.getBoundingClientRect();
      if(r.bottom<0||r.top>innerHeight)return;
      var p=(r.top+r.height/2-innerHeight/2)/innerHeight;
      var bg=b.querySelector('.bg');
      if(bg)bg.style.setProperty('--py',(p*-60).toFixed(1)+'px');
    });
  }
  addEventListener('scroll',function(){
    if(!ticking){ticking=true;requestAnimationFrame(upd)}
  },{passive:true});
  upd();
})();

/* Subtle Scroll-to-Top Button (appears after scrolling down) */
(function setupScrollToTop() {
  function initBtn() {
    if (document.querySelector('.scroll-top-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Scroll back to top');
    btn.setAttribute('title', 'Scroll to top');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>';
    document.body.appendChild(btn);

    let scrollTicking = false;
    function checkScroll() {
      scrollTicking = false;
      const shouldShow = window.scrollY > 380;
      btn.classList.toggle('visible', shouldShow);
    }

    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(checkScroll);
      }
    }, { passive: true });
    checkScroll();

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBtn);
  } else {
    initBtn();
  }
})();


