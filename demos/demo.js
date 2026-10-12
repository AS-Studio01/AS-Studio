(function(){'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
$$('.reveal').forEach(el=>io.observe(el));
const m=$('.dmenu'),l=$('.dlinks');if(m)m.addEventListener('click',()=>{const o=l.classList.toggle('open');m.setAttribute('aria-expanded',o)});
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
const money=n=>'₹'+n.toLocaleString('en-IN');
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
 const ship=sub>=15000?0:499;$('#subTotal').textContent=money(sub);$('#shipTotal').textContent=ship?money(ship):'Free';$('#grandTotal').textContent=money(sub+ship)}
renderCart();
/* checkout demo */
const co=$('#checkout');if(co){const c=getCart();let sub=0;Object.keys(c).forEach(id=>{const p=P.find(x=>x.id===id);if(p)sub+=p.price*c[id]});const ship=sub&&sub<15000?499:0;$('#coTotal').textContent=money(sub+ship)}
const pay=$('#payBtn');if(pay)pay.addEventListener('click',e=>{e.preventDefault();const f=$('#checkout');if(!f.checkValidity()){f.reportValidity();return}$('#payModal').classList.add('on')});
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('.modal').classList.remove('on')));
/* deposit reservation demo */
const dep=$('#depositBtn');if(dep)dep.addEventListener('click',e=>{e.preventDefault();const f=$('#reserve');if(!f.checkValidity()){f.reportValidity();return}$('#payModal').classList.add('on')});
const sel=$('#resSel'),amt=$('#depAmt');if(sel&&amt){const u=()=>{amt.textContent=sel.selectedOptions[0].dataset.dep||'₹0'};sel.addEventListener('change',u);u()}
})();
