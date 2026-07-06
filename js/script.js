const isTouch = matchMedia('(hover:none),(pointer:coarse)').matches;

if(!isTouch){
  const cd=document.getElementById('cd'),cr=document.getElementById('cr');
  let mx=0,my=0,rx=0,ry=0,raf=null;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;cd.style.left=mx+'px';cd.style.top=my+'px';
    if(!raf) raf=requestAnimationFrame(loop);
  });
  function loop(){
    rx+=(mx-rx)*.1;ry+=(my-ry)*.1;cr.style.left=rx+'px';cr.style.top=ry+'px';
    raf=requestAnimationFrame(loop);
  }
  document.querySelectorAll('a,button,.mitem,.mclose,.btn-rg').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('hov'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('hov'));
  });
} else {
  document.documentElement.style.cursor='auto';
  document.getElementById('cd')?.remove();
  document.getElementById('cr')?.remove();
}

document.querySelectorAll('.mitem[onclick]').forEach(el=>{
  el.setAttribute('role','button');
  el.setAttribute('tabindex','0');
  el.addEventListener('keydown', e=>{
    if(e.key==='Enter'||e.key===' '){ e.preventDefault(); el.click(); }
  });
});
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('sc',scrollY>60));

const obs=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('on')}),{threshold:.08});
document.querySelectorAll('.rv').forEach(r=>obs.observe(r));

let lastFocusedElement = null;

function openM(id){
  const el = document.getElementById(id);
  if(el){
    lastFocusedElement = document.activeElement;
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow='hidden';
    
    const focusable = el.querySelectorAll('button, a, [tabindex="0"]');
    if(focusable.length > 0) { focusable[0].focus(); }
  }
}

function closeM(id){
  const el = document.getElementById(id);
  if(el){
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow='';
    if(lastFocusedElement) { lastFocusedElement.focus(); }
  }
}

document.addEventListener('keydown', e=>{
  if(e.key==='Escape') document.querySelectorAll('.modal.open').forEach(m=>closeM(m.id));
  
  const openModal = document.querySelector('.modal.open');
  if(openModal && e.key==='Tab'){
    const focusables = openModal.querySelectorAll('button, a, [tabindex="0"]');
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    
    if(e.shiftKey && document.activeElement === first){
      last.focus(); e.preventDefault();
    } else if(!e.shiftKey && document.activeElement === last){
      first.focus(); e.preventDefault();
    }
  }
});

function initSliders(){
  const sliders = document.querySelectorAll('.msl');
  sliders.forEach(sl => {
    const slides = sl.querySelectorAll('.ms');
    if(slides.length > 1){
      let cur = 0;
      setInterval(() => {
        slides[cur].classList.remove('on');
        cur = (cur + 1) % slides.length;
        slides[cur].classList.add('on');
      }, 4500);
    }
  });
}
document.addEventListener('DOMContentLoaded',initSliders);
