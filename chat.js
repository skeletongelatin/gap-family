/* ============================================================
   chat.js — District Manager Help Chat
   Only loaded on the products page
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const helpBubble = document.querySelector("#help-bubble");
  const helpChat = document.querySelector("#help-chat");
  const helpMessages = helpChat?.querySelector(".help-messages");
  const helpInput = document.querySelector("#help-input");
  const header = helpChat?.querySelector(".help-header");

  if (!helpBubble || !helpChat || !helpMessages || !helpInput) return;

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

        const link = msg.querySelector(".check-back-link");
        link.addEventListener("click", (e) => {
          e.preventDefault();
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
});
