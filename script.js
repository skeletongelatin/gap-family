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

    if (body.dataset.page === 'deep') setupDeepPage?.();

    injectDistortionCSS();

    // initialize helpdesk + DM chat
    setupHelpdeskAndDM();
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
    const keyElements = qAll('.gap-key');
    if(keyElements.length){
      let tapProgress = [];
      keyElements.forEach(k=>{
        k.addEventListener('click',()=>{
          const audioClick=new Audio('assets/keyclick.mp3');
          audioClick.volume=0.2; audioClick.play().catch(()=>{});
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
      .dm-distort {
        position:absolute;inset:0;background:repeating-linear-gradient(0deg,#fff 0px,#fff 2px,#ccc 3px,#fff 5px);
        opacity:0.4;animation:glitchFlash 1.2s ease-in-out;
      }
      @keyframes glitchFlash {
        0%,100%{opacity:0;}20%,40%,60%,80%{opacity:0.8;transform:translateY(-1px);}
        30%,50%,70%,90%{opacity:0.8;transform:translateY(1px);}
      }
    `;
    document.head.appendChild(style);
  }

  /* ============================================================
     Helpdesk + District Manager Chat
     ============================================================ */
  function setupHelpdeskAndDM(){
    const helpBubble = document.getElementById("help-bubble");
    const helpChat = document.getElementById("help-chat");
    const helpMessages = helpChat?.querySelector(".help-messages");
    const helpInput = document.getElementById("help-input");

    const dmNotice = document.getElementById("dm-notice");
    const dmChat = document.getElementById("dm-chat");
    const dmMessages = dmChat?.querySelector(".dm-messages");
    const dmInput = document.getElementById("dm-input");

    if (!helpBubble || !helpChat || !helpMessages || !helpInput || !dmNotice || !dmChat || !dmMessages || !dmInput) return;

    let dmActive = false;
    let idleTimer;

    helpBubble.addEventListener("click", () => {
      helpChat.classList.toggle("visible");
      if (helpMessages.children.length === 0) {
        addHelpMessage("system", "Our help desk is currently closed. Please leave a message.");
      }
      helpInput.focus();
    });

    helpInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && helpInput.value.trim() !== "") {
        const msg = helpInput.value.trim();
        addHelpMessage("user", msg);
        helpInput.value = "";
        setTimeout(()=> addHelpMessage("system", "Our help desk is currently outside of business hours."), 800);
        setTimeout(()=> triggerDM(), 1800);
      }
    });

    function addHelpMessage(type, text){
      const div=document.createElement("div");
      div.className=`help-message ${type}`;
      div.textContent=text;
      helpMessages.appendChild(div);
      helpMessages.scrollTop=helpMessages.scrollHeight;
    }

    function triggerDM(){
      if(dmActive)return;
      dmActive=true;
      dmNotice.classList.add("visible");
      setTimeout(()=>{
        dmNotice.classList.remove("visible");
        dmChat.classList.add("visible");
        dmTyping();
        setTimeout(()=>{
          addDMMessage("manager","What are you looking for?");
          watchIdle();
        },1500);
      },2000);
    }

    function addDMMessage(sender,text){
      const div=document.createElement("div");
      div.className=`dm-message ${sender==="user"?"user":""}`;
      div.textContent=text;
      dmMessages.appendChild(div);
      dmMessages.scrollTop=dmMessages.scrollHeight;
    }

    function dmTyping(){
      const typing=document.createElement("div");
      typing.className="dm-typing";
      typing.innerHTML="<span></span><span></span><span></span>";
      dmMessages.appendChild(typing);
      dmMessages.scrollTop=dmMessages.scrollHeight;
      setTimeout(()=>typing.remove(),1500);
    }

    const nonsense = [
      "that’s not in stock.",
      "check the shelves again.",
      "we moved everything recently.",
      "inventory fluctuates in the dark.",
      "loss prevention is aware.",
      "…did you clock in?",
    ];

    dmInput.addEventListener("keydown",(e)=>{
      if(e.key==="Enter"&&dmInput.value.trim()!==""){
        const input=dmInput.value.trim();
        addDMMessage("user",input);
        dmInput.value="";
        resetIdle();
        dmTyping();
        setTimeout(()=>{
          if(/shirt|jeans|jacket|item|product|stock/i.test(input)){
            addDMMessage("manager","Would you like to check in the back?");
            const link=document.createElement("a");
            link.href="backroom.html";
            link.textContent="→ Check in the back";
            link.className="dm-message system";
            dmMessages.appendChild(link);
          }else{
            const rand=nonsense[Math.floor(Math.random()*nonsense.length)];
            addDMMessage("manager",rand);
          }
          watchIdle();
        },1400);
      }
    });

    function watchIdle(){
      clearTimeout(idleTimer);
      idleTimer=setTimeout(()=>revealInfo(),7000);
    }

    function resetIdle(){
      clearTimeout(idleTimer);
    }

    function revealInfo(){
      const ua=navigator.userAgent;
      const platform=navigator.platform;
      const lang=navigator.language;
      const info=`I can see that you're on ${platform}, using ${ua.split(" ")[0]}, language: ${lang}. So why don't you ask for help? I'm always happy to help for you! Just ask! Help!`;
      const distort=document.createElement("div");
      distort.className="dm-distort";
      dmChat.appendChild(distort);
      setTimeout(()=>distort.remove(),2000);
      dmTyping();
      setTimeout(()=>addDMMessage("manager",info),1800);
    }
  }

})();
