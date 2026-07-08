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
function initCourseCarousel(){
  document.querySelectorAll('[data-carousel]').forEach(root=>{
    const track = root.querySelector('[data-carousel-track]');
    const slides = Array.from(track.children);
    const prevBtn = root.querySelector('[data-carousel-prev]');
    const nextBtn = root.querySelector('[data-carousel-next]');
    const dotsWrap = root.querySelector('[data-carousel-dots]');
    let index = 0;

    slides.forEach((_,i)=>{
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ir para foto ${i+1}`);
      if(i===0) dot.classList.add('on');
      dot.addEventListener('click', ()=>goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(i){
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d,di)=>d.classList.toggle('on', di===index));
    }

    prevBtn.addEventListener('click', ()=>goTo(index - 1));
    nextBtn.addEventListener('click', ()=>goTo(index + 1));

    // Suporte a swipe/touch
    let startX = 0, deltaX = 0, dragging = false;
    track.addEventListener('touchstart', e=>{
      startX = e.touches[0].clientX; dragging = true;
      track.style.transition = 'none';
    }, {passive:true});
    track.addEventListener('touchmove', e=>{
      if(!dragging) return;
      deltaX = e.touches[0].clientX - startX;
      track.style.transform = `translateX(calc(-${index * 100}% + ${deltaX}px))`;
    }, {passive:true});
    track.addEventListener('touchend', ()=>{
      dragging = false;
      track.style.transition = '';
      if(Math.abs(deltaX) > 50){ goTo(deltaX < 0 ? index + 1 : index - 1); }
      else { goTo(index); }
      deltaX = 0;
    });
  });
}
document.addEventListener('DOMContentLoaded',initCourseCarousel);
document.addEventListener('DOMContentLoaded',initSliders);
