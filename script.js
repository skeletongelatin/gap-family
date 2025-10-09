/* ============================================================
   script.js  (The Gap Family, Oct 2025 build)
   ============================================================ */
(function(){
  const PAGE_IDS = ['index','products','about'];
  const deepLoopKey = 'tgf_deep_loop';
  const visitKey = 'tgf_visited_pages';
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
    setupGapSequence();
    setupDistrictManagerPhoto();

    if (localStorage.getItem(deepLoopKey) === '1')
      setTimeout(maybeShowOverlay, 2500 + Math.random()*6000);

    // === Deep Page special ===
    if (body.dataset.page === 'deep') setupDeepPage();
  });

  /* ============================================================
     Surface quirks
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
     Deep Loop visuals
     ============================================================ */
  function enableDeepLoop(reason){
    try{localStorage.setItem(deepLoopKey,'1');}catch(e){}
    applyDeepLoopVisuals();
    playWhisperOnce(true);
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
     Logo click
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
     Manual chime test (C)
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
     GAP Sequence
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
          triggerLightsOut();
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
            triggerLightsOut();
            tapProgress = [];
          } else if(tapProgress.join('') !== required.slice(0,tapProgress.length).join('')){
            tapProgress = [];
          }
        });
      });
    }
  }

  /* ============================================================
     District Manager Photo
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
     Whisper chime
     ============================================================ */
  function playWhisperOnce(force=false){
    if(!force && Math.random()>0.06)return;
    const audio=new Audio('assets/whisper-clip.mp3');
    audio.volume=0.1;
    audio.play().catch(()=>{});
  }

  /* ============================================================
     RNG overlay
     ============================================================ */
  function maybeShowOverlay(){
    if(Math.random()>0.05)return;
    const overlay=document.createElement('div');
    overlay.className='rng-overlay';
    overlay.innerHTML=`<button class="overlay-btn">continue</button>`;
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

  /* ============================================================
     Lights-Out Transition → Deep Page
     ============================================================ */
  function triggerLightsOut(){
    const existing=document.querySelector('.lights-out');
    if(existing)existing.remove();
    const overlay=document.createElement('div');
    overlay.className='lights-out';
    document.body.appendChild(overlay);
    void overlay.offsetWidth;
    setTimeout(()=>overlay.classList.add('visible'),50);
    const chime=new Audio('assets/whisper-clip.mp3');
    chime.volume=0.6;chime.play().catch(()=>{});
    console.log('⚫ Lights out triggered — redirecting soon');
    setTimeout(()=>{window.location.href='deep.html';},2200);
  }
/* ============================================================
   DEEP PAGE BUTTON LOGIC + RUMBLE + BUTTON STORM
   ============================================================ */
function setupDeepPage() {
  const btn = document.querySelector('.btn');
  if (!btn) return;

  let clickStage = 0;
  let stormInterval;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    clickStage++;

    // Subtle rumble each click
    document.body.classList.add('rumble');
    setTimeout(() => document.body.classList.remove('rumble'), 500);

    // === Click 1: shrink stage 1 ===
    if (clickStage === 1) {
      document.body.classList.add('shrink-1');
      btn.textContent = "you can't";

    // === Click 2: shrink stage 2 ===
    } else if (clickStage === 2) {
      document.body.classList.remove('shrink-1');
      document.body.classList.add('shrink-2');
      btn.textContent = "stop";

    // === Click 3: final stage ===
    } else if (clickStage === 3) {
      document.body.classList.remove('shrink-2');
      document.body.classList.add('shrink-3');
      btn.textContent = "YOU ARE HERE NOW";
      btn.classList.add('final-stage');

      // Start spawning extra buttons
      startButtonStorm();

    // === Click 4+: glitch flash + redirect ===
    } else if (clickStage > 3) {
      clearInterval(stormInterval);

      const glitch = document.createElement('div');
      glitch.className = 'glitch-flash';
      document.body.appendChild(glitch);

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
    }
  });

  /* === Create random buttons after final stage === */
  function startButtonStorm() {
    const phrases = ["no", "now open", "on sale", "today only", "let go of me"];
    const body = document.body;

    let totalSpawned = 0;
    const maxButtons = 25;

    stormInterval = setInterval(() => {
      if (totalSpawned >= maxButtons) {
        clearInterval(stormInterval);
        return;
      }
      totalSpawned++;

      const clone = document.createElement('button');
      clone.className = 'btn clone-btn';
      clone.textContent = phrases[Math.floor(Math.random() * phrases.length)];

      // Match size roughly to final-stage button
      clone.style.position = 'fixed';
      clone.style.top = `${Math.random() * 90 + 5}%`;
      clone.style.left = `${Math.random() * 90 + 5}%`;
      clone.style.transform = `translate(-50%, -50%) scale(${0.9 + Math.random() * 0.3})`;
      clone.style.zIndex = 9997;
      clone.style.opacity = '0';
      clone.style.transition = 'opacity 0.4s ease, transform 0.3s ease';
      clone.style.background = 'var(--gap-blue)';
      clone.style.color = 'white';
      clone.style.padding = '2rem 4rem';
      clone.style.textTransform = 'uppercase';
      clone.style.letterSpacing = '1px';
      clone.style.boxShadow = '0 0 20px rgba(0,0,0,0.4)';

      body.appendChild(clone);

      // Fade in and rumble
      requestAnimationFrame(() => {
        clone.style.opacity = '1';
        clone.style.transform += ' rotate(' + (Math.random() * 10 - 5) + 'deg)';
        document.body.classList.add('rumble');
        setTimeout(() => document.body.classList.remove('rumble'), 400);
      });

      // Optional random fade-out and removal after a few seconds
      setTimeout(() => {
        clone.style.opacity = '0';
        setTimeout(() => clone.remove(), 1000);
      }, 4000 + Math.random() * 3000);

    }, 350); // frequency of spawning
  }
}
/* ============================================================
   DISTRICT MANAGER CHATBOX (Products Page Only)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  if (!body || !body.classList.contains('vintage')) return; // simple guard

  const dmNotice = document.getElementById('dm-notice');
  const dmChat = document.getElementById('dm-chat');
  const dmMessages = dmChat ? dmChat.querySelector('.dm-messages') : null;
  const dmInput = dmChat ? dmChat.querySelector('#dm-input') : null;

  if (!dmNotice || !dmChat || !dmMessages || !dmInput) return;

  // Delay before DM appears
  setTimeout(() => {
    dmNotice.classList.add('visible');
    playWhisperOnce(true);
    setTimeout(() => {
      dmNotice.classList.remove('visible');
      dmChat.classList.add('visible');
      addDMMessage("👋 District Manager here.");
      setTimeout(() => addDMMessage("What are you looking for?"), 2000);
    }, 3000);
  }, 8000 + Math.random() * 4000);

  // === Input handling ===
  dmInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && dmInput.value.trim() !== '') {
      const userMsg = dmInput.value.trim();
      addUserMessage(userMsg);
      dmInput.value = '';

      handleDMResponse(userMsg.toLowerCase());
    }
  });

  // === Message builders ===
  function addUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'msg user';
    el.textContent = text;
    dmMessages.appendChild(el);
    scrollToBottom();
  }

  function addDMMessage(text, glitch = false) {
    const el = document.createElement('div');
    el.className = 'msg dm';
    el.textContent = text;
    dmMessages.appendChild(el);
    scrollToBottom();

    // subtle glitch flicker
    if (glitch) {
      el.classList.add('flicker');
      setTimeout(() => el.classList.remove('flicker'), 300);
    }
  }

  function scrollToBottom() {
    dmMessages.scrollTop = dmMessages.scrollHeight;
  }

  // === Response logic ===
  function handleDMResponse(input) {
    const nonsense = [
      "that’s not in stock.",
      "check the shelves again.",
      "we moved everything recently.",
      "inventory fluctuates in the dark.",
      "loss prevention is aware.",
      "…did you clock in?",
    ];

    if (/shirt|jean|jacket|hoodie|product|item|sale/.test(input)) {
      setTimeout(() => addDMMessage("Would you like to check in the back?", true), 1000);
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = 'backroom.html';
        link.textContent = "→ Check in the back";
        link.className = 'backroom-link';
        const el = document.createElement('div');
        el.className = 'msg dm';
        el.appendChild(link);
        dmMessages.appendChild(el);
        scrollToBottom();
      }, 3500);
    } else {
      const msg = nonsense[Math.floor(Math.random() * nonsense.length)];
      setTimeout(() => addDMMessage(msg, Math.random() < 0.5), 800 + Math.random() * 1200);
    }
  }
});



})();
