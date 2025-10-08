/* ============================================================
   script.js  (The Gap Family, Oct 2025 build)
   Implements:
     • Surface-level RNG quirks
     • Deep-Loop triggers
     • Gradual transitions
     • Whisper chime logic
     • GAP key/tap sequence
     • District Manager photo fade/swap
   ============================================================ */

(function(){
  const PAGE_IDS = ['index','products','about'];
  const deepLoopKey = 'tgf_deep_loop';
  const visitKey   = 'tgf_visited_pages';
  const chimePlayedKey = 'tgf_chime_played';

  const q = s => document.querySelector(s);
  const qAll = s => Array.from(document.querySelectorAll(s));

  document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const page = body.getAttribute('data-page') || 'index';
    const year = new Date().getFullYear();
    ['year','year2','year3','year4'].forEach(id=>{
      const el = document.getElementById(id);
      if (el) el.textContent = year;
    });

    try {
      let visited = sessionStorage.getItem(visitKey);
      visited = visited ? JSON.parse(visited) : [];
      if (!visited.includes(page)) {
        visited.push(page);
        sessionStorage.setItem(visitKey, JSON.stringify(visited));
      }
      if (PAGE_IDS.every(p => visited.includes(p))) enableDeepLoop('visited_all_pages');
    } catch(e){}

    if (page === 'about' && Math.random() < 0.10) {
      setTimeout(()=> enableDeepLoop('about_rng'), 700 + Math.random()*800);
    }

    if (localStorage.getItem(deepLoopKey) === '1') applyDeepLoopVisuals();

    applySurfaceQuirks();
    setupLogoSequence();
    setupGradualTransition();
    setupChimeTest();
    setupGapSequence();           // NEW G-A-P sequence
    setupDistrictManagerPhoto();  // NEW photo fade/swap

    if (localStorage.getItem(deepLoopKey) === '1')
      setTimeout(maybeShowOverlay, 2500 + Math.random()*6000);
  });

  /* ============================================================
     Surface quirks (mild hover flickers, shifts)
     ============================================================ */
  function applySurfaceQuirks(){
    qAll('.promo,.product,.member').forEach(el=>{
      if (Math.random()<0.28){
        el.classList.add('shift-small');
        setTimeout(()=>el.classList.remove('shift-small'),1200+Math.random()*2400);
      }
    });

    qAll('.nav a,.promo,.product,.btn').forEach(el=>{
      el.addEventListener('mouseover',()=>{
        if(Math.random()<0.30){
          el.classList.add('flicker');
          if(Math.random()<0.20){
            el.classList.add('shift-small');
            setTimeout(()=>el.classList.remove('shift-small'),350+Math.random()*400);
          }
          setTimeout(()=>el.classList.remove('flicker'),260);
        }
      });
    });
  }

  /* ============================================================
     Deep Loop visuals & activator
     ============================================================ */
  function enableDeepLoop(reason){
    try{localStorage.setItem(deepLoopKey,'1');}catch(e){}
    applyDeepLoopVisuals();
    playWhisperOnce(true); // force play on activation
    console.log('Deep Loop activated:',reason);
  }

  function applyDeepLoopVisuals(){
    document.body.classList.add('deep-loop');
  }

  /* ============================================================
     Gradual transition bright→dim
     ============================================================ */
  function setupGradualTransition(){
    if(Math.random()<0.06&&localStorage.getItem(deepLoopKey)!=='1'){
      setTimeout(()=>{
        document.body.classList.add('deep-loop');
        setTimeout(()=>{
          if(localStorage.getItem(deepLoopKey)!=='1'&&Math.random()<0.4)
            setTimeout(()=>document.body.classList.remove('deep-loop'),
                       4000+Math.random()*6000);
        },12000);
      },1000+Math.random()*3200);
    }
  }

  /* ============================================================
     Logo click sequence
     ============================================================ */
  function setupLogoSequence(){
    const logo=q('.logo img');
    if(!logo)return;
    let clicks=0,last=0;
    logo.addEventListener('click',()=>{
      const now=Date.now();
      if(now-last>2000)clicks=0;
      clicks++;last=now;
      if(clicks===7)window.location.href='secret.html';
      if(clicks===5)playWhisperOnce(true);
    });
  }

  /* ============================================================
     Manual chime test (press C only once per page)
     ============================================================ */
  function setupChimeTest(){
    window.addEventListener('keydown',e=>{
      if(e.key.toLowerCase()==='c' && !sessionStorage.getItem(chimePlayedKey)){
        sessionStorage.setItem(chimePlayedKey,'1');
        playWhisperOnce(true);
      }
    });
  }

  /* ============================================================
     GAP Sequence — desktop typing or mobile tapping
     ============================================================ */
  function setupGapSequence(){
    const required = ['g','a','p'];
    let progress = [];

    // desktop typing
    window.addEventListener('keydown', e=>{
      const k = e.key.toLowerCase();
      if(required.includes(k)){
        progress.push(k);
        if(progress.join('')===required.join('')){
          playWhisperOnce(true);
          progress = [];
        } else if(progress.join('') !== required.slice(0,progress.length).join('')){
          progress = [];
        }
      }
    });

    // mobile taps
    const keyElements = qAll('.gap-key');
    if(keyElements.length){
      let tapProgress = [];
      keyElements.forEach(k=>{
        k.addEventListener('click',()=>{
          const audioClick=new Audio('assets/keyclick.mp3');
          audioClick.volume=0.2;
          audioClick.play().catch(()=>{});
          k.classList.add('pressed');
          setTimeout(()=>k.classList.remove('pressed'),150);

          tapProgress.push(k.dataset.key);
          if(tapProgress.join('')===required.join('')){
            playWhisperOnce(true);
            tapProgress = [];
          } else if(tapProgress.join('') !== required.slice(0,tapProgress.length).join('')){
            tapProgress = [];
          }
        });
      });

      // prompt wiggle on mobile
      if (window.innerWidth <= 768) {
        keyElements.forEach(k => k.classList.add('prompt'));
        setTimeout(() => keyElements.forEach(k => k.classList.remove('prompt')), 2500);
      }
    }
  }

  /* ============================================================
     District Manager Photo Fade + Swap (About page)
     ============================================================ */
  function setupDistrictManagerPhoto(){
    const img = q('img[src*="employee2.jpg"]');
    if(!img)return;
    let clickCount = 0;
    const maxClicks = 5;

    img.addEventListener('click',()=>{
      clickCount++;
      if(clickCount < maxClicks){
        img.style.opacity = String(1 - clickCount * 0.15);
      } else if(clickCount === maxClicks){
        img.style.transition = 'opacity 0.8s ease';
        img.style.opacity = '0';
        setTimeout(()=>{
          img.src = 'assets/employee2-alt.jpg';
          img.style.opacity = '1';
          playWhisperOnce(true);
        },800);
      }
    });
  }

  /* ============================================================
     Whisper chime helper
     ============================================================ */
  function playWhisperOnce(force=false){
    if(!force && Math.random()>0.06)return;
    const audio=new Audio('assets/whisper-clip.mp3');
    audio.volume=0.1;
    audio.play().catch(()=>{});
  }

  /* ============================================================
     RNG overlay (rare)
     ============================================================ */
  function maybeShowOverlay(){
    if(Math.random()>0.05)return;
    const overlay=document.createElement('div');
    overlay.className='rng-overlay';
    overlay.innerHTML=`<button class="overlay-btn" aria-label="Continue">continue</button>`;
    document.body.appendChild(overlay);
    playWhisperOnce(true);
    requestAnimationFrame(()=>overlay.classList.add('visible'));

    const close=()=>{
      overlay.classList.remove('visible');
      setTimeout(()=>overlay.remove(),1200);
      playWhisperOnce(true);
    };
    overlay.querySelector('button').addEventListener('click',close);
    window.addEventListener('keydown',e=>{if(e.key==='Escape')close();},{once:true});
  }

})(); // end IIFE
