/* WEBFLOW DEVELOPERS — main.js v3 */
const PHONE_RAW  = '+918233818473';
const PHONE_DISP = '+91 82338 18473';
const WA_NUM     = '918233818473';
const WA_BASE    = 'https://wa.me/' + WA_NUM;
const FORMSPREE  = 'https://formspree.io/f/xpwzvgqb';
const EMAIL_DISP = 'hello@webflowdevelopers.us';

/* NAV SCROLL */
(function(){
  const nav = document.getElementById('main-nav');
  if(!nav) return;
  const fn = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', fn, {passive:true}); fn();
})();

/* MOBILE MENU */
(function(){
  const btn  = document.getElementById('nav-hamburger');
  const menu = document.getElementById('mobile-menu');
  if(!btn||!menu) return;
  btn.addEventListener('click', () => {
    const o = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(o));
    document.body.style.overflow = o ? 'hidden' : '';
  });
  document.addEventListener('click', e => {
    if(!btn.contains(e.target)&&!menu.contains(e.target)){
      menu.classList.remove('open'); document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', e => {
    if(e.key==='Escape'){menu.classList.remove('open'); document.body.style.overflow='';}
  });
})();

/* FAQ ACCORDION */
document.querySelectorAll('.faq-item__q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});

/* FORM SUBMISSION → Formspree email + WhatsApp */
document.querySelectorAll('form.lead-form-el, form.city-form-el, form.contact-form-el').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    const data = Object.fromEntries(new FormData(form));
    btn.disabled = true;
    btn.innerHTML = '<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;vertical-align:middle;margin-right:6px"></span> Sending…';
    try {
      const res = await fetch(FORMSPREE, {
        method:'POST',
        headers:{'Accept':'application/json','Content-Type':'application/json'},
        body: JSON.stringify({
          ...data,
          _subject: 'New Webflow Lead — ' + (data.city || 'Website'),
          _replyto: data.email
        })
      });
      const name    = data.name    || 'there';
      const city    = data.city    || 'my city';
      const service = data.service || 'Webflow development';
      const budget  = data.budget  ? ' Budget: '+data.budget+'.' : '';
      const msg = encodeURIComponent('Hi! I\'m '+name+' from '+city+'. I need '+service+'.'+budget+' Please reply!');
      setTimeout(() => window.open(WA_BASE+'?text='+msg,'_blank'), 800);
      btn.innerHTML = '✓ Sent! Redirecting to WhatsApp…';
      btn.style.background = '#16a34a';
      form.reset();
      showToast('Message sent! You\'ll get a reply within 30 minutes.', 'success');
      setTimeout(() => { btn.innerHTML = orig; btn.style.background=''; btn.disabled=false; }, 5000);
    } catch(err) {
      btn.innerHTML = orig; btn.disabled = false;
      showToast('Please WhatsApp us directly!', 'error');
      setTimeout(() => window.open(WA_BASE+'?text=Hi!%20I%20need%20Webflow%20help.','_blank'), 600);
    }
  });
});

/* NEWSLETTER */
document.querySelectorAll('form.newsletter-form').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const email = form.querySelector('input[type="email"]').value;
    btn.disabled = true; btn.textContent = '…';
    await fetch(FORMSPREE, {method:'POST', headers:{'Accept':'application/json','Content-Type':'application/json'}, body: JSON.stringify({email, _subject:'Newsletter Signup'})}).catch(()=>{});
    btn.textContent = '✓ Subscribed!'; btn.style.background='#16a34a';
    form.reset();
    setTimeout(() => { btn.textContent='Subscribe'; btn.style.background=''; btn.disabled=false; }, 4000);
  });
});

/* TOAST */
function showToast(msg, type='success'){
  document.querySelector('.wd-toast')?.remove();
  const t = document.createElement('div');
  t.className = 'wd-toast';
  t.textContent = msg;
  t.style.cssText='position:fixed;bottom:100px;right:24px;z-index:99999;background:'+(type==='error'?'#7f1d1d':'#0D1829')+';color:#fff;border:1px solid '+(type==='error'?'rgba(239,68,68,.4)':'rgba(20,110,245,.4)')+';padding:13px 18px;border-radius:10px;font-size:.85rem;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,.5);max-width:300px;';
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(()=>t.remove(),400); }, 4500);
}

/* STICKY OFFER BAR */
(function(){
  const bar = document.getElementById('sticky-bar');
  if(!bar) return;
  if(sessionStorage.getItem('stickyBarClosed')){ bar.style.display='none'; return; }
  bar.style.display='flex';
  document.body.classList.add('has-sticky-bar');
  bar.querySelector('.sticky-bar__close')?.addEventListener('click', () => {
    bar.style.display='none';
    document.body.classList.remove('has-sticky-bar');
    sessionStorage.setItem('stickyBarClosed','1');
  });
})();

/* EXIT-INTENT POPUP */
(function(){
  const popup = document.getElementById('exit-popup');
  if(!popup||sessionStorage.getItem('exitPopupShown')) return;
  let shown = false;
  const show = () => {
    if(shown) return; shown=true;
    popup.style.display='flex';
    sessionStorage.setItem('exitPopupShown','1');
  };
  document.addEventListener('mouseleave', e => { if(e.clientY < 5) show(); });
  setTimeout(show, 45000);
  popup.querySelector('.exit-popup__close')?.addEventListener('click', () => popup.style.display='none');
  popup.addEventListener('click', e => { if(e.target===popup) popup.style.display='none'; });
  document.addEventListener('keydown', e => { if(e.key==='Escape') popup.style.display='none'; });
})();

/* SCROLL REVEAL */
(function(){
  if(!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(el => { if(el.isIntersecting){ el.target.classList.add('revealed'); obs.unobserve(el.target); } });
  }, {threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* COUNTER ANIMATION */
(function(){
  const counters = document.querySelectorAll('[data-count]');
  if(!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix||'';
      const dur = 2000; const step = 16;
      let cur = 0; const inc = target/(dur/step);
      const timer = setInterval(() => {
        cur += inc;
        if(cur>=target){ cur=target; clearInterval(timer); }
        el.textContent = (Number.isInteger(target)?Math.floor(cur):cur.toFixed(1))+suffix;
      }, step);
      obs.unobserve(el);
    });
  }, {threshold:0.5});
  counters.forEach(el => obs.observe(el));
})();

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if(!target) return;
    e.preventDefault();
    window.scrollTo({top: target.getBoundingClientRect().top + window.scrollY - 84, behavior:'smooth'});
  });
});

/* READING PROGRESS (blog) */
(function(){
  const bar = document.getElementById('read-progress');
  if(!bar) return;
  window.addEventListener('scroll', () => {
    const d = document.documentElement;
    bar.style.width = Math.min((d.scrollTop/(d.scrollHeight-d.clientHeight))*100,100)+'%';
  }, {passive:true});
})();

/* TABLE OF CONTENTS (blog) */
(function(){
  const toc = document.getElementById('toc-list');
  if(!toc) return;
  document.querySelectorAll('.blog-content h2, .blog-content h3').forEach((h,i) => {
    if(!h.id) h.id = 'h'+i;
    const li = document.createElement('li');
    li.className = h.tagName==='H3' ? 'toc-sub' : '';
    li.innerHTML = '<a href="#'+h.id+'">'+h.textContent+'</a>';
    toc.appendChild(li);
  });
})();

/* ACTIVE NAV LINK */
(function(){
  const path = window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    if((a.getAttribute('href')||'').split('/').pop()===path) a.classList.add('nav-active');
  });
})();

/* PHONE CLICK GA4 */
document.querySelectorAll('a[href^="tel:"]').forEach(a => {
  a.addEventListener('click', () => {
    if(typeof gtag!=='undefined') gtag('event','phone_call',{event_category:'contact'});
  });
});

/* INJECT UTILITY CSS */
(function(){
  const s = document.createElement('style');
  s.textContent = `
    @keyframes spin{to{transform:rotate(360deg)}}
    .reveal{opacity:0;transform:translateY(22px);transition:opacity .65s ease,transform .65s ease}
    .reveal.revealed{opacity:1;transform:none}
    .nav-active{color:#fff !important;background:rgba(255,255,255,.08) !important}
    #exit-popup{display:none;position:fixed;inset:0;background:rgba(2,8,20,.88);z-index:99998;align-items:center;justify-content:center;backdrop-filter:blur(8px)}
    .exit-popup__box{background:#0D1829;border:1px solid rgba(20,110,245,.35);border-radius:20px;padding:44px 40px;max-width:460px;width:92%;text-align:center;position:relative;animation:epin .3s ease}
    @keyframes epin{from{transform:scale(.93);opacity:0}to{transform:scale(1);opacity:1}}
    .exit-popup__close{position:absolute;top:14px;right:16px;background:none;border:none;color:#5A6A82;font-size:1.4rem;cursor:pointer;line-height:1}
    .exit-popup__close:hover{color:#fff}
    #sticky-bar{display:none;position:fixed;top:0;left:0;right:0;z-index:1001;background:linear-gradient(90deg,#146EF5,#6B3FF6);color:#fff;padding:9px 20px;font-size:.82rem;font-weight:600;align-items:center;justify-content:center;gap:12px;animation:slideDown .4s ease}
    @keyframes slideDown{from{transform:translateY(-100%)}to{transform:translateY(0)}}
    .sticky-bar__close{background:none;border:none;color:rgba(255,255,255,.7);cursor:pointer;font-size:1.1rem;margin-left:6px}
    body.has-sticky-bar .nav{top:38px}
    #read-progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#146EF5,#6B3FF6);z-index:9999;width:0;transition:width .1s}
    .copy-btn{position:absolute;top:10px;right:10px;background:rgba(20,110,245,.2);border:1px solid rgba(20,110,245,.4);color:#4F94FF;font-size:.72rem;padding:4px 10px;border-radius:5px;cursor:pointer;font-family:inherit}
    #toc-list{list-style:none;padding:0}
    #toc-list li{margin-bottom:6px}
    #toc-list a{font-size:.84rem;color:#94A3B8;text-decoration:none;transition:color .15s}
    #toc-list a:hover,#toc-list a.active{color:#146EF5}
    .toc-sub a{padding-left:12px;font-size:.8rem}
  `;
  document.head.appendChild(s);
})();
