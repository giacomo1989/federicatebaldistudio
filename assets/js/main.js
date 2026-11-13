async function init(){
const lang=['it','en','es'].includes(localStorage.getItem('ft-lang'))?localStorage.getItem('ft-lang'):'it';
const load=async p=>{const r=await fetch(p);if(!r.ok)throw Error(p);return r.json()};
const [t,projects,manifest]=await Promise.all([load(`i18n/${lang}.json`),load('data/projects.json'),load('data/images-manifest.json')]);
document.documentElement.lang=lang;
const $=s=>document.querySelector(s);
const icons={instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',pinterest:'<path d="M9 20l3-12m-2 7c-5-3-2-11 4-11 8 0 8 12 1 12-2 0-3-1-3-3"/><circle cx="12" cy="12" r="10"/>',linkedin:'<path d="M5 9v11M10 20V9m0 5c0-7 9-7 9 0v6"/><circle cx="5" cy="4" r="1" fill="currentColor"/>'};
const SOCIAL_FALLBACK={instagram:"https://www.instagram.com/",pinterest:"https://www.pinterest.com/",linkedin:"https://www.linkedin.com/"};
const categories=[['',t.all],['residenziale',t.residential],['retail',t.retail],['uffici',t.offices]];
const SOCIAL={};
const social=Object.entries(icons).map(([k,v])=>`<a ${SOCIAL[k]?`href="${SOCIAL[k]}" target="_blank" rel="noopener"`:`href="${SOCIAL_FALLBACK[k]}" target="_blank" rel="noopener"`} aria-label="${k}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${v}</svg></a>`).join('');
$('header').innerHTML=`<div class="social">${social}</div><a class="brand" href="index.html"><img src="images/logo.png" alt="FT"><span>FEDERICA TEBALDI STUDIO</span></a><button class="menu-toggle" aria-label="${t.open}" aria-expanded="false"><i></i><i></i></button><nav aria-label="Navigazione"><a href="studio.html">${t.studio}</a><div class="dropdown"><a href="progetti.html">${t.projects}</a><button class="sub-toggle" aria-controls="project-options" aria-label="${t.categories}" aria-expanded="false"><svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2 4.5 6 8 10 4.5" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="submenu" id="project-options" hidden>${categories.map(([id,label])=>`<a href="progetti.html${id?'?categoria='+id:''}">${label}</a>`).join('')}</div></div><a href="contatti.html">${t.contact}</a><div class="language"><button type="button" class="language-toggle" aria-label="Language" aria-expanded="false" aria-controls="language-options">${lang.toUpperCase()}<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2 4.5 6 8 10 4.5" fill="none" stroke="currentColor" stroke-width="1"/></svg></button><div class="language-options" id="language-options" hidden>${['it','en','es'].map(l=>`<button type="button" data-lang="${l}" lang="${l}" aria-current="${l===lang?'true':'false'}">${l.toUpperCase()}</button>`).join('')}</div></div></nav>`;
$('footer').innerHTML=`<div class="footer-stack"><span class="footer-copyright">© ${new Date().getFullYear()} FEDERICA TEBALDI STUDIO</span><a class="footer-privacy" href="privacy.html">${t.privacyLink}</a><a class="footer-powered" href="https://geividigitalstudio.com" target="_blank" rel="noopener">POWERED BY GEIVI DIGITAL STUDIO</a></div>`;
const toggle=$('.menu-toggle');toggle.onclick=()=>{let open=document.body.classList.toggle('menu-open');toggle.setAttribute('aria-expanded',open);toggle.setAttribute('aria-label',open?t.close:t.open);};
const menus=[
  {root:$('.dropdown'),trigger:$('.sub-toggle'),panel:$('.submenu')},
  {root:$('.language'),trigger:$('.language-toggle'),panel:$('.language-options')}
];
const setOpen=(menu,open)=>{
  menu.panel.hidden=!open;
  menu.trigger.setAttribute('aria-expanded',String(open));
};
const openMenu=menu=>{menus.forEach(m=>setOpen(m,m===menu));};
for(const menu of menus){
  menu.root.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&matchMedia('(min-width:701px)').matches)openMenu(menu)});
  menu.root.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&matchMedia('(min-width:701px)').matches)setOpen(menu,false)});
  menu.trigger.addEventListener('click',()=>{if(menu.panel.hidden)openMenu(menu);else setOpen(menu,false)});
  menu.root.addEventListener('focusout',e=>{if(!menu.root.contains(e.relatedTarget))setOpen(menu,false)});
  menu.root.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.panel.hidden){e.stopPropagation();setOpen(menu,false);menu.trigger.focus()}else if(e.key==='ArrowDown'&&e.target===menu.trigger){e.preventDefault();openMenu(menu);menu.panel.querySelector('a,button')?.focus()}});
}
$('.language-options').addEventListener('click',e=>{const option=e.target.closest('[data-lang]');if(!option)return;localStorage.setItem('ft-lang',option.dataset.lang);location.reload()});
document.addEventListener('click',e=>{for(const menu of menus)if(!menu.root.contains(e.target))setOpen(menu,false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('menu-open'))toggle.click()});
toggle.addEventListener('click',()=>{if(!document.body.classList.contains('menu-open'))menus.forEach(m=>setOpen(m,false))});
const params=new URLSearchParams(location.search);
// V8: persist the active project category in the navigation.
if($('.grid') || $('.detail')){
  const currentCategory=$('.detail')?projects.find(p=>p.id===params.get('id'))?.category:(params.get('categoria')||'');
  if(categories.some(([id])=>id===currentCategory)){
    const activeLink=[...$('.submenu').querySelectorAll('a')].find(a=>(new URL(a.href).searchParams.get('categoria')||'')===currentCategory);
    activeLink?.setAttribute('aria-current',$('.detail')?'location':'page');
  }
}

const esc=v=>String(v??t.missing).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const missing=()=>`<div class="missing-photo">${esc(t.missing)}</div>`;
if($('.home-photo')){const select=()=>{const photos=manifest.home;const last=sessionStorage.getItem('ft-home');const choices=photos.filter(x=>x!==last);const pool=choices.length?choices:photos;if(!pool.length){$('.home-photo').outerHTML=missing();return}const photo=pool[Math.floor(Math.random()*pool.length)];$('.home-photo').src=photo;sessionStorage.setItem('ft-home',photo)};select();window.addEventListener('pageshow',e=>{if(e.persisted&&$('.home-photo'))select()});}
if($('.grid')){document.title=t.projects+' | Federica Tebaldi Studio';const cat=params.get('categoria')||'';$('.grid').innerHTML=projects.filter(p=>!cat||p.category===cat).map(p=>{const cover=manifest.projects[p.id]?.[0];return `<a class="card ${cover?'':'no-cover'}" href="progetto.html?id=${p.id}">${cover?`<img src="${esc(cover)}" alt="${esc(p.name)}" loading="lazy">`:missing()}<span>${esc(p.name)}${p.status==='ongoing'?`<small>${esc(t.ongoing)}</small>`:''}</span></a>`}).join('')}
if($('.detail')){const p=projects.find(p=>p.id===params.get('id'));if(!p){$('.detail').innerHTML=`<p>${esc(t.missing)}</p><a href="progetti.html">${esc(t.back)}</a>`}else{const tr=p.translations[lang];document.title=p.name+' | Federica Tebaldi Studio';$('.detail-title').remove();const info=document.createElement('section');info.className='project-info';const rows=[['location',tr.location],['year',p.year],['type',tr.type],['client',tr.client],['area',p.area==null?null:p.area+' m²'],...Object.entries(p.credits||{})];info.innerHTML=`<h1>${esc(p.name)}</h1>${p.status==='ongoing'?`<p class="status">${esc(t.ongoing)}</p>`:''}<dl>${rows.map(([k,v])=>`<div><dt>${esc(t[k])}:</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;$('.description').before(info);$('.description').textContent=tr.description;$('.back').textContent=t.back;$('.back').href='progetti.html?categoria='+p.category;const photos=manifest.projects[p.id]||[];let n=0;const img=$('.slide');const show=()=>{img.src=photos[n];img.alt=p.name+' – '+(n+1)};const move=d=>{n=(n+d+photos.length)%photos.length;show()};$('.prev').setAttribute('aria-label',t.previous);$('.next').setAttribute('aria-label',t.next);if(!photos.length){img.outerHTML=missing()}else show();if(photos.length<2){$('.prev').hidden=true;$('.next').hidden=true}else{$('.prev').onclick=()=>move(-1);$('.next').onclick=()=>move(1);document.addEventListener('keydown',e=>{if(e.target.closest('.language,select,input,textarea'))return;if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1)});requestAnimationFrame(()=>requestAnimationFrame(()=>$('.carousel').classList.add('ready')))}}}
if($('.privacy')){document.title=t.privacyTitle+' | Federica Tebaldi Studio';$('.privacy').innerHTML=`<h1>${esc(t.privacyTitle)}</h1>${t.privacySections.map(s=>`<section><h2>${esc(s.heading)}</h2><p>${esc(s.text)}</p></section>`).join('')}`;}
if($('.studio')){$('.studio').innerHTML=`<h1>${esc(t.studio)}</h1><p>Federica Tebaldi Studio</p><p>${esc(t.missing)}</p>`;document.title=t.studio+' | Federica Tebaldi Studio'}
if($('.contact')){$('.contact').innerHTML=`<div>FEDERICA TEBALDI STUDIO<br>${esc(t.missing)}</div><div>${esc(t.contactUs)}</div><div>Federica Tebaldi<br>${esc(t.missing)}<br>${esc(t.missing)}</div>`;document.title=t.contact+' | Federica Tebaldi Studio'}
}
init().catch(e=>{console.error(e);document.querySelector('main').textContent='INFO MANCANTE — impossibile caricare i dati. Avviare il sito tramite server HTTP.'});
