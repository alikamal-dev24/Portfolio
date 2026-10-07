(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,G=!rm&&window.gsap&&window.ScrollTrigger;
$('#yr').textContent=new Date().getFullYear();
/* hero heading: letters rise one by one */
$$('#h1 .w').forEach((w,i)=>{const t=w.textContent;w.textContent='';w.setAttribute('aria-hidden','true');
 [...t].forEach((ch,j)=>{const s=document.createElement('span');s.className='c';s.textContent=ch;s.style.animationDelay=(.15+i*.35+j*.07)+'s';w.appendChild(s)})});
/* typing role */
const roles=['Front-End Developer','WordPress Developer','Bricks Builder Expert','Performance Specialist'],ty=$('#ty');let ri=0,ci=roles[0].length,del=true;
if(!rm)(function tick(){const r=roles[ri];
 if(del){ci--;if(ci<=0){del=false;ri=(ri+1)%roles.length}}else{ci++;if(ci>=roles[ri].length)del=true}
 ty.textContent=roles[ri].slice(0,ci);
 setTimeout(tick,ci>=roles[ri].length&&del?1800:del?35:75)})();
/* sliding marquee: duplicate for a seamless loop */
const mt=$('#mt');mt.innerHTML+=mt.innerHTML;
/* header, progress, active link, menu */
const hd=$('#hd'),bar=$('#bar'),links=$$('nav a'),secs=links.map(a=>$(a.getAttribute('href')));
addEventListener('scroll',()=>{const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;hd.classList.toggle('s',y>20);bar.style.width=(y/h*100)+'%';
 let c=0;secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<innerHeight*.4)c=i});links.forEach((a,i)=>a.classList.toggle('on',i===c))},{passive:true});
const mb=$('#mb'),nv=$('#nv');mb.onclick=()=>{const o=nv.classList.toggle('o');mb.classList.toggle('o',o);mb.setAttribute('aria-expanded',o)};
links.forEach(a=>a.addEventListener('click',()=>{nv.classList.remove('o');mb.classList.remove('o');mb.setAttribute('aria-expanded',false)}));
/* hero spotlight follows the mouse */
const hero=$('.hero');hero.addEventListener('mousemove',e=>{const r=hero.getBoundingClientRect();hero.style.setProperty('--mx',e.clientX-r.left+'px');hero.style.setProperty('--my',e.clientY-r.top+'px')});
/* custom cursor: orange dot + trailing ring */
const cur=$('.cur'),ring=$('.ring');let mx=0,my=0,rx=0,ry=0;
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
 addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.transform=`translate(${mx}px,${my}px)`});
 (function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(loop)})();
 document.addEventListener('mouseover',e=>ring.classList.toggle('big',!!e.target.closest('a,button,.card,.frame,.bt,.sv,[role=tab]')))}
/* hero orb tilt + magnetic buttons */
if(!rm&&matchMedia('(hover:hover)').matches){
 const po=$('.port');po.addEventListener('mousemove',e=>{const r=po.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;po.style.transform=`perspective(900px) rotateX(${(.5-y/r.height)*10}deg) rotateY(${(x/r.width-.5)*10}deg)`;po.style.transition='transform .1s'});
 po.addEventListener('mouseleave',()=>{po.style.transform='';po.style.transition='transform .5s'});
 $$('.mag').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.3}px)`});b.addEventListener('mouseleave',()=>b.style.transform='')})}
/* sticky CTA: shows after the hero, hides while the contact section is on screen */
const stk=$('#stk');let cv=false;
new IntersectionObserver(e=>{cv=e[0].isIntersecting;up()}).observe($('#contact'));
function up(){stk.classList.toggle('on',scrollY>innerHeight*.6&&!cv)}addEventListener('scroll',up,{passive:true});
/* counters: real numbers are in the HTML; animate from 0 only when scrolled into view */
$$('[data-n]').forEach(el=>{if(rm)return;const n=+el.dataset.n,s=el.dataset.s||'';
 new IntersectionObserver((e,o)=>{if(!e[0].isIntersecting)return;o.disconnect();let t0=null;
  const f=t=>{t0??=t;const p=Math.min((t-t0)/1400,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3)))+(p<1?'':s);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)},{threshold:.6}).observe(el)});
/* process timeline line draws when it scrolls into view */
const tlh=$('#tlh');new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){tlh.classList.add('in');o.disconnect()}},{threshold:.35}).observe(tlh);
/* technical-depth tabs */
const tabs=$$('[role=tab]'),pnl=$$('[role=tabpanel]');
const sel=i=>{tabs.forEach((t,k)=>{t.setAttribute('aria-selected',k===i);t.tabIndex=k===i?0:-1});pnl.forEach((p,k)=>p.hidden=k!==i);
 if(G)gsap.from(pnl[i].querySelectorAll('li,h3'),{y:18,opacity:0,duration:.5,stagger:.06,ease:'power3.out',clearProps:'opacity,transform'})};
tabs.forEach((t,i)=>{t.onclick=()=>sel(i);t.onkeydown=e=>{const n=e.key==='ArrowRight'?i+1:e.key==='ArrowLeft'?i-1:null;if(n===null)return;e.preventDefault();const j=(n+tabs.length)%tabs.length;sel(j);tabs[j].focus()}});
/* testimonials slider (stays hidden while projects.js has no testimonials) */
const T=window.TESTIMONIALS||[],rs=$('#reviews');
if(T.length&&rs){const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 rs.hidden=false;const tk=$('#tk'),dt=$('#dt');let i=0;
 tk.innerHTML=T.map((t,k)=>`<div class="slide" role="group" aria-roledescription="slide" aria-label="${k+1} of ${T.length}"><figure><div class="stars" role="img" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“${esc(t.quote)}”</blockquote><figcaption>${t.photo?`<img src="${esc(t.photo)}" alt="" loading="lazy" onerror="this.remove()">`:''}<div><b>${esc(t.name)}</b><span>${esc(t.role||'')}</span>${t.project?` · <a href="projects.html">${esc(t.project)}</a>`:''}</div></figcaption></figure></div>`).join('');
 dt.innerHTML=T.map((_,k)=>`<button aria-label="Show testimonial ${k+1}"></button>`).join('');
 const sl=$$('.slide');
 const go=n=>{i=(n+T.length)%T.length;tk.style.transform=`translateX(-${i*100}%)`;sl.forEach((s,k)=>{s.inert=k!==i;s.setAttribute('aria-hidden',k!==i)});$$('button',dt).forEach((b,k)=>b.setAttribute('aria-current',k===i))};
 $('#pv').onclick=()=>go(i-1);$('#nx').onclick=()=>go(i+1);$$('button',dt).forEach((b,k)=>b.onclick=()=>go(k));
 $('#sl').addEventListener('keydown',e=>{if(e.key==='ArrowLeft')go(i-1);if(e.key==='ArrowRight')go(i+1)});
 let x0=0;$('#sl').addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});$('#sl').addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>50)go(i+(d<0?1:-1))});
 if(T.length<2)$('#ct').hidden=true;go(0)}
/* contact form: posts to data-endpoint (Formspree etc.) if set, otherwise opens the visitor's email app */
const f=$('#f'),fm=$('#fm');
f.addEventListener('submit',async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f));if(d.website)return;
 const body=`Project type: ${d.type}\nBudget: ${d.budget||'-'}\nTimeline: ${d.timeline||'-'}\n\n${d.details}\n\nFrom: ${d.name} (${d.email})`;
 if(f.dataset.endpoint){try{const r=await fetch(f.dataset.endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(d)});
  if(!r.ok)throw 0;f.reset();fm.textContent='Thanks! Your message has been sent. I will get back to you as soon as possible.'}catch(_){fm.textContent='Something went wrong. Please email me directly.'}return}
 location.href='mailto:ali.kamalofficial24@gmail.com?subject='+encodeURIComponent('Project enquiry: '+d.type+' from '+d.name)+'&body='+encodeURIComponent(body);fm.textContent='Opening your email app...'});
/* reveal fallback when GSAP is unavailable */
if(!G){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});$$('.rv').forEach(el=>io.observe(el));return}
/* GSAP: hero entrance, scroll reveals, project image reveals, page wipe */
document.documentElement.classList.add('gsap-on');gsap.registerPlugin(ScrollTrigger);
gsap.set('.rv',{opacity:0,y:40});
gsap.timeline({defaults:{ease:'power4.out'}})
 .from('#hd',{yPercent:-120,opacity:0,duration:.8})
 .from('#h1 .c',{yPercent:115,rotate:6,duration:1.1,stagger:.07},'<.1')
 .from('.hero .fade',{y:28,opacity:0,duration:.8,stagger:.1,clearProps:'opacity,transform'},'-=.8')
 .from('.port',{opacity:0,scale:.7,rotate:-10,duration:1.4,ease:'expo.out',clearProps:'opacity,transform'},'<.1')
 .from('.chip',{opacity:0,duration:.6,stagger:.12},'-=.9')
 .from('.scroll,.mq',{opacity:0,duration:.6},'-=.4');
ScrollTrigger.batch('.rv',{start:'top 90%',once:true,onEnter:b=>gsap.to(b,{opacity:1,y:0,duration:.9,ease:'power3.out',stagger:.1,overwrite:true,clearProps:'opacity,transform'})});
$$('.frame').forEach(fr=>{const im=$('img',fr);
 gsap.from(fr,{clipPath:'inset(10% 6% 10% 6% round 16px)',opacity:0,y:50,duration:1.1,ease:'power3.out',clearProps:'clipPath,opacity,transform',scrollTrigger:{trigger:fr,start:'top 88%',once:true}});
 if(im)gsap.from(im,{scale:1.18,duration:1.6,ease:'power3.out',clearProps:'transform',scrollTrigger:{trigger:fr,start:'top 88%',once:true}})});
document.addEventListener('click',e=>{const a=e.target.closest('a[href="projects.html"],a[href^="case-study.html"]');if(!a||e.metaKey||e.ctrlKey)return;
 e.preventDefault();gsap.to('.wipe',{yPercent:-100,duration:.6,ease:'power4.inOut',onComplete:()=>location.href=a.href})});
addEventListener('pageshow',e=>{if(e.persisted)gsap.set('.wipe',{yPercent:0})});
})();
