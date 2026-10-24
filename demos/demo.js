(function(){'use strict';

/* Clean URL address-bar enforcement for demo pages */
(function enforceCleanAddressBar() {
  try {
    const p = window.location.pathname;
    const s = window.location.search || '';
    const h = window.location.hash || '';
    if (p.endsWith('.html') || p.includes('/index.html') || p.startsWith('/demos/')) {
      let clean = p;
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
      if (clean !== p) {
        window.history.replaceState(null, '', clean + s + h);
      }
    }
  } catch (_) {}
})();

/* Clean link click interceptor in demos: rewrites ../../work.html -> /work, residences.html -> /currentDemo/residences */
document.addEventListener('click', function(e) {
  const a = e.target.closest('a');
  if (!a || !a.getAttribute('href')) return;
  const raw = a.getAttribute('href');
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('#')) return;

  const pathname = window.location.pathname;
  let demoBase = '';
  if (pathname.startsWith('/vitalcare') || pathname.includes('vitalcare')) demoBase = '/vitalcare';
  else if (pathname.startsWith('/mitti') || pathname.includes('mitti')) demoBase = '/mitti';
  else if (pathname.startsWith('/fold') || pathname.includes('fold')) demoBase = '/fold';
  else if (pathname.startsWith('/atelier') || pathname.includes('atelier')) demoBase = '/atelier';
  else if (pathname.startsWith('/apex') || pathname.includes('apex')) demoBase = '/apex';
  else if (pathname.startsWith('/rao') || pathname.includes('rao')) demoBase = '/rao';
  else if (pathname.startsWith('/delta') || pathname.includes('delta')) demoBase = '/delta';

  // Common root-level links from demos
  if (raw.includes('../../work.html') || raw === '../work.html') {
    e.preventDefault();
    const hash = raw.includes('#') ? raw.slice(raw.indexOf('#')) : '';
    window.location.href = '/work' + hash;
    return;
  }
  if (raw.includes('../../index.html') || raw === '../index.html' || raw === '../../') {
    e.preventDefault();
    window.location.href = '/';
    return;
  }
  if (raw.includes('../../contact.html') || raw === '../contact.html') {
    e.preventDefault();
    const query = raw.includes('?') ? raw.slice(raw.indexOf('?')) : '';
    window.location.href = '/contact' + query;
    return;
  }
  if (raw.includes('../../work/')) {
    e.preventDefault();
    const cs = raw.replace(/^.*\/work\//, '').replace(/\.html$/, '');
    window.location.href = '/work/' + cs;
    return;
  }

  // Internal demo relative links (e.g. index.html -> /apex, residences.html -> /apex/residences)
  if (demoBase && (raw.endsWith('.html') || raw.includes('.html?') || raw === 'index.html')) {
    e.preventDefault();
    const [pathPart, queryPart] = raw.split('?');
    const [pagePart, hashPart] = pathPart.split('#');
    let sub = pagePart.replace(/\.html$/, '');
    let dest = sub === 'index' || sub === '' ? demoBase : demoBase + '/' + sub;
    if (queryPart) dest += '?' + queryPart;
    if (hashPart) dest += '#' + hashPart;
    window.location.href = dest;
    return;
  }
}, true);

const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
$$('.reveal').forEach(el=>io.observe(el));
/* lightweight analytics tracking across demo pages */
(function trackDemo(){
  try{
    const path=location.pathname;
    const m=path.match(/\/demos\/([^\/]+)/);
    const demo=m?m[1]:'demo';
    const payload={
      path:path,
      demo:demo,
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
const m=$('.dmenu'),l=$('.dlinks');
if(m&&l){
  m.addEventListener('click',e=>{
    e.stopPropagation();
    const o=l.classList.toggle('open');
    m.setAttribute('aria-expanded',o);
  });
  $$('a',l).forEach(a=>a.addEventListener('click',()=>{
    l.classList.remove('open');
    m.setAttribute('aria-expanded','false');
  }));
  document.addEventListener('click',e=>{
    if(l.classList.contains('open')&&!l.contains(e.target)&&!m.contains(e.target)){
      l.classList.remove('open');
      m.setAttribute('aria-expanded','false');
    }
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&l.classList.contains('open')){
      l.classList.remove('open');
      m.setAttribute('aria-expanded','false');
      m.focus();
    }
  });
}
/* tabs */
$$('[data-tabs]').forEach(g=>{const btns=$$('button',g),panes=$$('.pane',g.parentElement);
 btns.forEach(b=>b.addEventListener('click',()=>{btns.forEach(x=>x.classList.toggle('on',x===b));panes.forEach(p=>p.classList.toggle('on',p.dataset.pane===b.dataset.tab))}))});
/* filters */
$$('[data-filter-group]').forEach(g=>{const items=$$('[data-cat]',g.parentElement);
 $$('button',g).forEach(b=>b.addEventListener('click',()=>{$$('button',g).forEach(x=>x.classList.toggle('on',x===b));const c=b.dataset.f;items.forEach(i=>{i.style.display=(c==='all'||i.dataset.cat===c)?'':'none'})}))});
/* demo forms: success state only, nothing is sent anywhere */
$$('form[data-demo]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const st=$('.st',f);if(!f.checkValidity()){f.reportValidity();return}
 st.textContent=f.dataset.demo;f.reset()}));
/* cart (Atelier North) */
const P=window.PRODUCTS||[];const KEY='atelier-north-cart';
const getCart=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}};
const setCart=c=>{try{localStorage.setItem(KEY,JSON.stringify(c))}catch(e){}updCount()};
const money=n=>'$'+n.toLocaleString('en-US');
function updCount(){const n=Object.values(getCart()).reduce((a,b)=>a+b,0);$$('[data-cart-count]').forEach(e=>e.textContent=n)}
updCount();
window.addToCart=(id)=>{const c=getCart();c[id]=(c[id]||0)+1;setCart(c);const t=$('#toast');if(t){t.textContent='Added to cart';t.style.opacity=1;setTimeout(()=>t.style.opacity=0,1400)}};
function renderCart(){const box=$('#cartItems');if(!box)return;const c=getCart();const ids=Object.keys(c).filter(i=>c[i]>0);
 if(!ids.length){box.innerHTML='<p class="lead">Your cart is empty.</p>';$('#cartSum')&&($('#cartSum').style.display='none');return}
 let sub=0;box.innerHTML='';ids.forEach(id=>{const p=P.find(x=>x.id===id);if(!p)return;sub+=p.price*c[id];
  const r=document.createElement('div');r.className='crow';
  r.innerHTML='<div class="th"></div><div><b></b><div class="fine"></div></div><div class="qty"><button aria-label="Fewer">−</button><span></span><button aria-label="More">+</button></div>';
  r.querySelector('.th').style.cssText=p.bg;r.querySelector('b').textContent=p.name;r.querySelector('.fine').textContent=money(p.price);r.querySelector('span').textContent=c[id];
  const [mi,pl]=r.querySelectorAll('button');mi.onclick=()=>{const k=getCart();k[id]=Math.max(0,(k[id]||0)-1);setCart(k);renderCart()};pl.onclick=()=>{const k=getCart();k[id]=(k[id]||0)+1;setCart(k);renderCart()};box.appendChild(r)});
 const ship=sub>=200?0:15;$('#subTotal').textContent=money(sub);$('#shipTotal').textContent=ship?money(ship):'Free';$('#grandTotal').textContent=money(sub+ship)}
renderCart();
/* checkout demo */
const co=$('#checkout');if(co){const c=getCart();let sub=0;Object.keys(c).forEach(id=>{const p=P.find(x=>x.id===id);if(p)sub+=p.price*c[id]});const ship=sub&&sub<200?15:0;$('#coTotal').textContent=money(sub+ship)}
const pay=$('#payBtn');if(pay)pay.addEventListener('click',e=>{e.preventDefault();const f=$('#checkout');if(!f.checkValidity()){f.reportValidity();return}$('#payModal').classList.add('on')});
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('.modal').classList.remove('on')));
/* deposit reservation demo */
const dep=$('#depositBtn');if(dep)dep.addEventListener('click',e=>{e.preventDefault();const f=$('#reserve');if(!f.checkValidity()){f.reportValidity();return}$('#payModal').classList.add('on')});
const sel=$('#resSel'),amt=$('#depAmt');if(sel&&amt){const u=()=>{amt.textContent=sel.selectedOptions[0].dataset.dep||'$0'};sel.addEventListener('change',u);u()}

})();
