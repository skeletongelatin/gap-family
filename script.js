/* ============================================================
script.js (The Gap Family, Oct 2025 — Fixed Mobile Key Sound)
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

    // only init chat on products page
    if (page === 'products') setupHelpAndDMChat();

    setupMobileGapSequence();
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
  GAP sequence (desktop)
  ============================================================ */
  function setupGapSequence(){
    const required = ['g','a','p'];
    let progress = [];
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
  Whisper sound
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
      }
    `;
    document.head.appendChild(style);
  }

  /* ============================================================
   Mobile GAP Key Sequence (click sound fixed)
   ============================================================ */
  function setupMobileGapSequence() {
    const mobileKeys = document.querySelectorAll(".gap-key");
    if (!mobileKeys.length) return;

    let seq = [];
    mobileKeys.forEach(key => {
      key.addEventListener("click", () => {
        // play a *key click* sound, not whisper
        const clickSound = new Audio("assets/keyclick.mp3"); // use your keypress sound file
        clickSound.volume = 0.5;
        clickSound.play().catch(() => {});

        const val = key.dataset.key;
        seq.push(val);
        key.style.transform = "translateY(4px)";
        setTimeout(() => key.style.transform = "", 150);

        if (seq.join("") === "gap") {
          triggerLightsOut();
          seq = [];
        } else if (!"gap".startsWith(seq.join(""))) {
          seq = [];
        }
      });
    });
  }

  /* ============================================================
  Helpdesk Chat — products only (fixed bubble click issue)
  ============================================================ */
  function setupHelpAndDMChat() {
    const helpBubble = document.querySelector("#help-bubble");
    const helpChat = document.querySelector("#help-chat");
    const helpMessages = helpChat?.querySelector(".help-messages");
    const helpInput = document.querySelector("#help-input");
    const header = helpChat?.querySelector(".help-header");

    // Only run if on products page and elements exist
    if (document.body.getAttribute("data-page") !== "products" || !helpBubble || !helpChat || !helpMessages || !helpInput) return;

    let districtOnline = false;
    let idleTimer = null;

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

    // ✅ Bubble toggles chat only (no backroom popup interference)
    helpBubble.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      helpChat.classList.toggle("visible");
      if (helpChat.classList.contains("visible") && helpMessages.children.length === 0) {
        addMessage("bot", "Our help desk is currently offline. Please leave a message.");
      }
    });

    // ✅ Clicking outside closes chat
    document.addEventListener("click", (e) => {
      if (!helpChat.contains(e.target) && !helpBubble.contains(e.target)) {
        helpChat.classList.remove("visible");
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
          msg.innerHTML = `<a href="#" class="check-back-link">Check in the back →</a>`;
          helpMessages.appendChild(msg);
          helpMessages.scrollTop = helpMessages.scrollHeight;

          // ✅ Stop event propagation so this link never triggers bubble logic
          const link = msg.querySelector(".check-back-link");
          link.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const audio = new Audio("assets/backroom.mp3");
            audio.volume = 0.5;
            audio.play().catch(() => {});
            const w = 700, h = 500;
            const left = window.screenX + (window.outerWidth - w) / 2;
            const top = window.screenY + (window.outerHeight - h) / 2;
            const features = `width=${w},height=${h},left=${left},top=${top},popup=yes,resizable=no,scrollbars=no`;
            const popup = window.open("back.html", "backpopup", features);
            if (!popup) window.open("back.html", "_blank");
          });
        }, 1500);
      } else {
        showTyping(() => {
          addMessage("bot", nonsense[Math.floor(Math.random() * nonsense.length)]);
        }, 1000);
      }
    }

    function resetIdleTimer() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        addMessage("bot", "Still there?");
      }, 7000);
    }
  }

})();
