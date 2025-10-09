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

    // Inject distortion CSS once
    injectDistortionCSS();
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
     DISTRICT MANAGER CHAT LOGIC + REVEAL DISTORTION
     ============================================================ */

  let dmNotice = document.querySelector(".dm-notice");
  let dmChat = document.querySelector(".dm-chat");
  let dmMessages = dmChat?.querySelector(".dm-messages");
  let dmInput = document.getElementById("dm-input");
  let dmActive = false;
  let idleTimer;
  let typingIndicator;

  const nonsenseResponses = [
    "that’s not in stock.",
    "check the shelves again.",
    "we moved everything recently.",
    "inventory fluctuates in the dark.",
    "loss prevention is aware.",
    "…did you clock in?",
  ];

  function getClientInfo() {
    const ua = navigator.userAgent || 'unknown';
    const platform = navigator.platform || 'unknown';
    const lang = navigator.language || 'unknown';
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown';
    const screenW = window.screen?.width || '?';
    const screenH = window.screen?.height || '?';
    const touch = (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    let browser = /firefox/i.test(ua) ? 'Firefox' :
                  /edg/i.test(ua) ? 'Edge' :
                  /chrome/i.test(ua) ? 'Chrome' :
                  /safari/i.test(ua) ? 'Safari' : 'Unknown';
    let os = /windows/i.test(ua) ? 'Windows' :
             /mac os x/i.test(ua) ? 'macOS' :
             /android/i.test(ua) ? 'Android' :
             /iphone|ipad|ipod/i.test(ua) ? 'iOS' :
             /linux/i.test(ua) ? 'Linux' : 'Unknown';
    const deviceType = (touch && screenW < 900) ? 'mobile' : 'desktop';
    return {browser, os, lang, tz, screen:`${screenW}×${screenH}`, deviceType};
  }

  function showTypingIndicator() {
    typingIndicator = document.createElement("div");
    typingIndicator.className = "dm-typing";
    typingIndicator.innerHTML = "<span></span><span></span><span></span>";
    dmMessages.appendChild(typingIndicator);
    dmMessages.scrollTop = dmMessages.scrollHeight;
  }
  function hideTypingIndicator() {
    if (typingIndicator) {
      typingIndicator.remove();
      typingIndicator = null;
    }
  }

  function showMessage(text, sender = "dm", delay = 600, distort = false) {
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      const msg = document.createElement("div");
      msg.className = "dm-message" + (sender === "user" ? " user" : "");
      msg.textContent = text;
      if (distort) msg.classList.add("distort-reveal");
      dmMessages.appendChild(msg);
      dmMessages.scrollTop = dmMessages.scrollHeight;
      if (distort) setTimeout(() => msg.classList.remove("distort-reveal"), 2500);
    }, delay);
  }

  function startIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => triggerAwareness(), 7000);
  }
  function resetIdleTimer() {
    clearTimeout(idleTimer);
    startIdleTimer();
  }

  function triggerAwareness() {
    const info = getClientInfo();
    showMessage(`I can see you're on ${info.os}, using ${info.browser}...`, "dm", 800, true);
    setTimeout(() => showMessage(`So why don't you ask for help!`), 2200);
    setTimeout(() => showMessage(`I'm always happy to help for you!`), 3600);
    setTimeout(() => showMessage(`Just ask! Help!`), 4600);
  }

  function openChat() {
    dmNotice.classList.remove("visible");
    dmChat.classList.add("visible");

    if (!dmActive) {
      dmActive = true;
      const ding = new Audio('assets/notify.mp3');
      ding.volume = 0.2;
      ding.play().catch(()=>{});
      setTimeout(() => showMessage("👋 District Manager here."), 500);
      setTimeout(() => showMessage("What are you looking for today?"), 2000);
      startIdleTimer();
    }
  }

  if (dmInput) {
    dmInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && dmInput.value.trim() !== "") {
        const text = dmInput.value.trim();
        dmInput.value = "";
        showMessage(text, "user", 0);
        resetIdleTimer();

        if (/shirt|jacket|jean|hoodie|product|item|sale/i.test(text)) {
          setTimeout(() => showMessage("Would you like to check in the back?"), 1500);
          setTimeout(() => {
            const link = document.createElement("a");
            link.href = "backroom.html";
            link.textContent = "→ Check in the back";
            link.className = "dm-message";
            dmMessages.appendChild(link);
            dmMessages.scrollTop = dmMessages.scrollHeight;
          }, 3200);
        } else {
          const msg = nonsenseResponses[Math.floor(Math.random() * nonsenseResponses.length)];
          setTimeout(() => showMessage(msg), 1400);
        }
      }
    });
  }

  if (dmNotice) dmNotice.addEventListener("click", openChat);

  /* ============================================================
     Distortion CSS Injector
     ============================================================ */
  function injectDistortionCSS() {
    const style = document.createElement("style");
    style.textContent = `
      .dm-message.distort-reveal {
        animation: distortFade 2.4s ease-in-out;
        position: relative;
      }
      @keyframes distortFade {
        0% { filter: contrast(180%) saturate(150%) blur(2px); opacity: 0; transform: skewX(6deg);}
        10% { filter: none; opacity: 1; transform: skewX(0deg);}
        40% { filter: hue-rotate(40deg) contrast(130%); }
        60% { filter: none; }
        85% { filter: blur(1px) contrast(200%); }
        100% { filter: none; opacity: 1; transform: none; }
      }
    `;
    document.head.appendChild(style);
  }

})();

