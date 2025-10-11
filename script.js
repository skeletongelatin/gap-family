/* ============================================================
script.js (The Gap Family, Oct 2025 — Stable Working Version)
============================================================ */

(function() {
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
    injectDistortionCSS();
    setupHelpAndDMChat();
    setupDeepButtonSequence(); // ← call deep button sequence here
    window.setupDeepButtonSequence = setupDeepButtonSequence;

  });

  /* ============================================================
  Surface quirks
  ============================================================ */
  function applySurfaceQuirks() {
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
  Gradual transition
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
  Manual chime test
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
  GAP sequence
  ============================================================ */
  function setupGapSequence() {
        if (document.body.dataset.page === 'products') return;
    const required = ['g', 'a', 'p'];
    let progress = [];

    const clickSound = new Audio('assets/keyclick.mp3');
    clickSound.volume = 0.3;

    window.addEventListener('keydown', e => {
      const k = e.key.toLowerCase();
      if (required.includes(k)) {
        playKeyClick();
        progress.push(k);
        checkGapProgress();
      }
    });

    const keyEls = document.querySelectorAll('.gap-key');
    keyEls.forEach(el => {
      el.addEventListener('click', () => {
        const k = el.dataset.key;
        playKeyClick();
        el.classList.add('pressed');
        setTimeout(() => el.classList.remove('pressed'), 150);
        progress.push(k);
        checkGapProgress();
      });
    });

    function playKeyClick() {
      const s = clickSound.cloneNode();
      s.volume = 0.3;
      s.play().catch(() => {});
    }

    function checkGapProgress() {
      if (progress.join('') === required.join('')) {
        playWhisperOnce(true);
        triggerLightsOut();
        progress = [];
      } else if (progress.join('') !== required.slice(0, progress.length).join('')) {
        progress = [];
      }
    }
  }

  /* ============================================================
  Deep Page Button Sequence
  ============================================================ */
  function setupDeepButtonSequence() {
    if (document.body.dataset.page !== "deep") return;

    const btn = document.getElementById("weirdButton");
    if (!btn) return;

    btn.style.position = "relative";
    btn.style.zIndex = "10";

    let clickStage = 0;

    btn.addEventListener("click", () => {
      clickStage++;

      if (clickStage === 1) {
        document.body.classList.add("shrink-1");
        btn.textContent = "you can’t";
      } else if (clickStage === 2) {
        document.body.classList.remove("shrink-1");
        document.body.classList.add("shrink-2");
        btn.textContent = "stop";
      } else if (clickStage === 3) {
        document.body.classList.remove("shrink-2");
        document.body.classList.add("shrink-3");
        btn.textContent = "YOU ARE HERE NOW";
        btn.classList.add("final-stage");

        spawnDesktopOverrun(); // our new desktop-overrun function


        const rumbleInterval = setInterval(() => {
          document.body.classList.add("rumble");
          setTimeout(() => document.body.classList.remove("rumble"), 400);
        }, 2500);

        setTimeout(() => clearInterval(rumbleInterval), 15000);
      } 
      // Progressive shake+blur
      else if (clickStage === 4 || clickStage === 5) {
        const intensity = clickStage === 4 ? 1 : 1.7; // stronger on 5th click
        document.body.style.animation = `shakeBlur ${0.6 * intensity}s ease-in-out`;
        setTimeout(() => {
          document.body.style.animation = "";
        }, 600 * intensity);

        btn.textContent = clickStage === 4 ? "almost..." : "LAST CHANCE";
      } 
// Final click: white flash then redirect
else if (clickStage === 6) {
  const flash = document.createElement("div");
  flash.style.position = "fixed";
  flash.style.top = "0";
  flash.style.left = "0";
  flash.style.width = "100%";
  flash.style.height = "100%";
  flash.style.background = "white";
  flash.style.zIndex = "9999";
  flash.style.opacity = "0";
  flash.style.transition = "opacity 0.3s ease";
  document.body.appendChild(flash);
  requestAnimationFrame(() => { flash.style.opacity = "1"; });
  setTimeout(() => window.location.href = "index.html?gap=1", 350);
}

    });

function spawnDesktopOverrun() {
  const oldContainer = document.getElementById('overrun-container');
  if (oldContainer) oldContainer.remove();

  const container = document.createElement('div');
  container.id = 'overrun-container';
  Object.assign(container.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  });
  document.body.appendChild(container);

  const messages = [
    "NOW", "HURRY", "LIMITED", "JOIN",
    "OPEN", "DON’T WAIT", "FOREVER", "CLICK ME"
  ];

  // inject keyframes once
  if (!document.getElementById("violentRumble")) {
    const style = document.createElement("style");
    style.id = "violentRumble";
    style.textContent = `
      @keyframes violentRumble {
        0%   { transform: translate(-50%, -50%) rotate(0deg); }
        20%  { transform: translate(calc(-50% + 3px), calc(-50% + 2px)) rotate(-1deg); }
        40%  { transform: translate(calc(-50% - 3px), calc(-50% - 2px)) rotate(1deg); }
        60%  { transform: translate(calc(-50% + 2px), calc(-50% - 3px)) rotate(-1deg); }
        80%  { transform: translate(calc(-50% - 2px), calc(-50% + 3px)) rotate(1deg); }
        100% { transform: translate(-50%, -50%) rotate(0deg); }
      }
    `;
    document.head.appendChild(style);
  }

  const maxButtons = 250;
  let spawned = 0;

  const spawnInterval = setInterval(() => {
    if (spawned >= maxButtons) {
      clearInterval(spawnInterval);
      return;
    }

    const btn = document.createElement('button');
    btn.textContent = messages[Math.floor(Math.random() * messages.length)];
    btn.className = 'weird-btn';
    Object.assign(btn.style, {
      position: 'absolute',
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      opacity: '1',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      background: 'var(--gap-blue)',
      color: 'white',
      padding: '0.6rem 1.2rem',
      borderRadius: '4px',
      boxSizing: 'border-box',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      animation: `violentRumble 0.15s infinite linear`, // 👈 harsh shake
    });

    container.appendChild(btn);
    spawned++;
  }, 10);
} // ✅ closes spawnDesktopOverrun
} // ✅ closes setupDeepButtonSequence

 

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
  Lights-Out Transition
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
  Distortion CSS
  ============================================================ */
  function injectDistortionCSS(){
    const style=document.createElement("style");
    style.textContent=`
.dm-message.distort-reveal {
  animation: distortFade 2.4s ease-in-out;
}
@keyframes distortFade {
  0% { filter: contrast(180%) saturate(150%) blur(2px); opacity: 0; transform: skewX(6deg);}
  10% { filter: none; opacity: 1; transform: skewX(0deg);}
  40% { filter: hue-rotate(40deg) contrast(130%); }
  60% { filter: none; }
  85% { filter: blur(1px) contrast(200%); }
  100% { filter: none; opacity: 1; transform: none; }
}`;
    document.head.appendChild(style);
  }

 /* ============================================================
Unified Helpdesk + DM Chat
============================================================ */
function setupHelpAndDMChat(){
  const helpBubble = document.querySelector("#help-bubble");
  const helpChat = document.querySelector("#help-chat");
  const helpMessages = helpChat?.querySelector(".help-messages");
  const helpInput = document.querySelector("#help-input");
  const header = helpChat?.querySelector(".help-header");

  if (!helpBubble || !helpChat || !helpMessages || !helpInput) return;

  let districtOnline = false;
  let idleTimer = null;

   function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      districtOnline = false;
      header.textContent = "Help Desk (Offline)";
      header.classList.remove("dm-online");
      console.log("District Manager went idle.");
    }, 60000); // 1 min idle
  }

  function addMessage(type, text) {
    const msg = document.createElement("div");
    msg.className = `help-message ${type}`;
    msg.innerHTML = text;
    helpMessages.appendChild(msg);
    helpMessages.scrollTop = helpMessages.scrollHeight;
  }

  function showTyping(callback, delay = 1000) {
    const dots = document.createElement("div");
    dots.className = "dm-typing";
    dots.innerHTML = "<span></span><span></span><span></span>";
    helpMessages.appendChild(dots);
    helpMessages.scrollTop = helpMessages.scrollHeight;
    setTimeout(() => {
      dots.remove();
      callback();
    }, delay);
  }

  helpBubble.addEventListener("click", () => {
    helpChat.classList.toggle("visible");
    if (helpChat.classList.contains("visible") && helpMessages.children.length === 0) {
      addMessage("bot", "Our help desk is currently offline. Please leave a message.");
    }
  });

  helpInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && helpInput.value.trim()) {
      const text = helpInput.value.trim();
      helpInput.value = "";
      addMessage("user", text);
      clearTimeout(idleTimer);

      if (!districtOnline) {
        showTyping(() => {
          addMessage("bot", "We’re currently outside help desk business hours.");
          setTimeout(() => {
            const systemMsg = document.createElement("div");
            systemMsg.className = "help-message system";
            systemMsg.textContent = "DISTRICT MANAGER has joined the chat...";
            helpMessages.appendChild(systemMsg);
            helpMessages.scrollTop = helpMessages.scrollHeight;
            setTimeout(startDistrictManager, 1800);

            // --- Flicker hero image + play sound ---
            const hero = document.querySelector(".hero-image");
            if (hero) {
              hero.classList.add("dm-flicker");
              setTimeout(() => hero.classList.remove("dm-flicker"), 2000);
            }

            const flickerSound = new Audio("assets/lights-flicker.mp3");
            flickerSound.volume = 0.6;
            flickerSound.play().catch(() => {});
          }, 1500);
        }, 1200);
      } else {
        handleDMResponse(text);
      }
    }
  });

  function startDistrictManager() {
    districtOnline = true;
    header.textContent = "District Manager 🟢";
    header.classList.add("dm-online");
    showTyping(() => {
      addMessage("bot", "What are you looking for?");
      resetIdleTimer();
    }, 1200);
  }

  function handleDMResponse(inputText) {
    resetIdleTimer();
    const lower = inputText.toLowerCase();
    const productWords = /(shirt|jacket|pants|product|item|stock|inventory|jeans|hoodie)/;
    const nonsense = [
      "that’s not in stock.",
      "check the shelves again.",
      "we moved everything recently.",
      "inventory fluctuates in the dark.",
      "loss prevention is aware.",
      "…did you clock in?",
    ];

if (productWords.test(lower)) {
  showTyping(() => {
    const msg = document.createElement("div");
    msg.className = "help-message bot";
    msg.textContent = "Check in the back →";
    helpMessages.appendChild(msg);
    helpMessages.scrollTop = helpMessages.scrollHeight;

    // --- Add creepy fade-out of chat ---
    const chatbox = document.querySelector("#help-chat");
    setTimeout(() => {
      // subtle vibration + fade sound at start of fade
      navigator.vibrate?.([40, 30, 80]);
      const fadeSound = new Audio("assets/ui-fade.mp3"); // subtle hum/glitch
      fadeSound.volume = 0.4;
      fadeSound.play().catch(() => {});

      if (chatbox) {
        chatbox.classList.add("fade-away");
        // Optional: remove it completely after animation
        setTimeout(() => chatbox.remove(), 3000);
      }
    }, 1800); // wait ~1.8s after message appears

    // --- Continue to backroom sequence ---
    setTimeout(() => {
      createBackDoorOverlay();
    }, 2500);
  }, 1500);
}


  }

  /* ------------------------------------------------------------
     Creates a clickable door overlay over the .hero-image.
     Clicking: swaps to open door image, plays creak, opens popup.
  ------------------------------------------------------------ */
  function createBackDoorOverlay() {
  if (document.getElementById("backdoor-overlay")) return; // already present
  const hero = document.querySelector(".hero-image");
  if (!hero) return;

  if (getComputedStyle(hero).position === "static") {
    hero.style.position = "relative";
  }

  const overlay = document.createElement("div");
  overlay.id = "backdoor-overlay";
  overlay.className = "door-overlay";
  overlay.setAttribute("role", "button");
  overlay.setAttribute("tabindex", "0");
  overlay.setAttribute("aria-label", "Open backroom door");

  const img = document.createElement("img");
  img.src = "assets/door-closed.png";
  img.alt = "Backroom door (closed)";
  img.draggable = false;

  overlay.appendChild(img);
  hero.appendChild(overlay);

  // --- New creepy fade-in effect + ambient sound (safe) ---
  try {
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 2.5s ease-in-out";
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
    });
  } catch (e) {
    console.warn("Door fade-in skipped:", e);
  }

  try {
    const appearSound = new Audio("assets/door-appear.mp3");
    appearSound.volume = 0.4;
    appearSound.play().catch(() => {}); // prevent uncaught promise
  } catch (e) {
    console.warn("Door sound skipped:", e);
  }
setTimeout(() => {
  overlay.classList.add("visible"); // makes it clickable
}, 1000);


  // click handler — same behavior as before
  let activated = false;
 const activate = () => {
  if (activated) return;
  activated = true;

  overlay.classList.add("open");
  img.src = "assets/door-open.png";
  img.alt = "Backroom door (open)";

  // start both sounds *immediately* on user click
  const creak = new Audio("assets/door-creak.mp3");
  const backroom = new Audio("assets/backroom.mp3");

  creak.volume = 0.75;
  backroom.volume = 0.4;
  backroom.loop = true; // optional, makes it continuous

  // play both within user gesture
  creak.play().catch(() => {});
  backroom.play().catch(() => {});

  // then handle popup + navigation as before
  const w = 700, h = 500;
  const left = window.screenX + (window.outerWidth - w) / 2;
  const top = window.screenY + (window.outerHeight - h) / 2;
  const features = `width=${w},height=${h},left=${left},top=${top},popup=yes,resizable=no,scrollbars=no`;
  let popup = null;
  try { popup = window.open("about:blank", "backpopup", features); } catch (e) {}

  // --- Detect when popup closes, trigger vibration (mobile only) ---
const vibrationPattern = [40, 80, 40, 180, 60]; // short, unsettling pulse pattern
const checkPopupClosed = setInterval(() => {
  if (!popup || popup.closed) {
    clearInterval(checkPopupClosed);
    if (navigator.vibrate) {
      navigator.vibrate(vibrationPattern);
    }
  }
}, 500);

  const navigatePopup = () => {
    if (popup && !popup.closed) {
      try { popup.location = "back.html"; popup.focus(); }
      catch { window.open("back.html", "_blank"); }
    } else {
      window.open("back.html", "_blank");
    }
    setTimeout(() => overlay.remove(), 700);
  };

  creak.addEventListener("ended", () => navigatePopup(), { once: true });
  setTimeout(() => navigatePopup(), 1500);
};






  overlay.addEventListener("click", activate);
  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate();
    }
  });
}


  

} // ✅ closes setupHelpAndDMChat
})(); // ✅ closes the main IIFE




