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


   document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year2");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const helpBubble = document.getElementById("help-bubble");
  const helpChat = document.getElementById("help-chat");
  const helpMessages = helpChat?.querySelector(".help-messages");
  const helpInput = document.getElementById("help-input");

  const dmNotice = document.getElementById("dm-notice");
  const dmChat = document.getElementById("dm-chat");
  const dmMessages = dmChat?.querySelector(".dm-messages");
  const dmInput = document.getElementById("dm-input");

  if (!helpBubble || !helpChat || !helpMessages || !helpInput || !dmNotice || !dmChat || !dmMessages || !dmInput) return;

  // --- Toggle help chat ---
  helpBubble.addEventListener("click", () => {
    helpChat.classList.toggle("visible");
  });

  // --- Help message submission ---
  helpInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && helpInput.value.trim() !== "") {
      const text = helpInput.value.trim();
      addHelpMessage("user", text);
      helpInput.value = "";
      setTimeout(() => {
        addHelpMessage("bot", "Our help desk is currently offline. Please check back during business hours.");
      }, 800);

      // trigger district manager sequence after 1 second
      setTimeout(() => {
        dmNotice.classList.add("visible");
      }, 1800);
    }
  });

  // === District Manager Chat Sequence ===
  dmNotice.addEventListener("click", () => {
    dmNotice.style.display = "none";
    dmChat.classList.add("visible");
    addDMMessage("system", "District Manager is typing...");
    setTimeout(() => {
      dmMessages.innerHTML = "";
      addDMMessage("dm", "What are you looking for?");
    }, 1500);
  });

  dmInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && dmInput.value.trim() !== "") {
      const text = dmInput.value.trim();
      addDMMessage("user", text);
      dmInput.value = "";
      handleDMResponse(text);
    }
  });

  // --- Helper functions ---
  function addHelpMessage(type, text) {
    const msg = document.createElement("div");
    msg.classList.add("help-message", type);
    msg.textContent = text;
    helpMessages.appendChild(msg);
    helpMessages.scrollTop = helpMessages.scrollHeight;
  }

  function addDMMessage(type, text) {
    const msg = document.createElement("div");
    msg.classList.add("dm-message", type);
    msg.textContent = text;
    dmMessages.appendChild(msg);
    dmMessages.scrollTop = dmMessages.scrollHeight;
  }

  function dmTyping(callback, delay = 1200) {
    const typingEl = document.createElement("div");
    typingEl.classList.add("dm-typing");
    typingEl.innerHTML = "<span></span><span></span><span></span>";
    dmMessages.appendChild(typingEl);
    dmMessages.scrollTop = dmMessages.scrollHeight;
    setTimeout(() => {
      typingEl.remove();
      callback();
    }, delay);
  }

  function handleDMResponse(input) {
    const lower = input.toLowerCase();
    const productKeywords = ["shirt", "jeans", "jacket", "pants", "khakis", "sweater", "hoodie"];
    const nonsense = [
      "that’s not in stock.",
      "check the shelves again.",
      "we moved everything recently.",
      "inventory fluctuates in the dark.",
      "loss prevention is aware.",
      "…did you clock in?",
    ];

    dmTyping(() => {
      if (productKeywords.some(word => lower.includes(word))) {
        addDMMessage("dm", "Would you like to check in the back?");
        const link = document.createElement("a");
        link.href = "backroom.html";
        link.textContent = "Check in the back →";
        link.style.display = "block";
        link.style.color = "#003366";
        link.style.marginTop = "0.3rem";
        dmMessages.appendChild(link);
      } else {
        addDMMessage("dm", nonsense[Math.floor(Math.random() * nonsense.length)]);
      }
    });
  }

  // --- Reveal client info if idle ---
  let idleTimer;
  const resetIdle = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => revealClientInfo(), 7000);
  };
  document.addEventListener("mousemove", resetIdle);
  document.addEventListener("keydown", resetIdle);
  resetIdle();

  function revealClientInfo() {
    const ua = navigator.userAgent;
    const platform = navigator.platform || "unknown device";
    const dmDistort = document.createElement("div");
    dmDistort.classList.add("dm-distort");
    dmChat.appendChild(dmDistort);

    dmTyping(() => {
      addDMMessage("dm", `I can see you’re on ${platform} using ${getBrowserName(ua)}…`);
      dmTyping(() => {
        addDMMessage("dm", "So why don’t you ask for help! I’m always happy to help for you! Just ask! Help!");
      }, 1800);
    }, 1500);

    setTimeout(() => dmDistort.remove(), 2000);
  }

  function getBrowserName(ua) {
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "an unknown browser";
  }
});


})();

