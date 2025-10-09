/* ============================================================
   chat.js — Help Desk System for thegapfamily (Products page)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const bubble = document.getElementById('help-bubble');
  const chat = document.getElementById('help-chat');
  const messages = document.querySelector('.help-messages');
  const input = document.getElementById('help-input');

  if (!bubble || !chat) return;

  // show bubble fixed bottom-right
  bubble.style.position = 'fixed';
  bubble.style.bottom = '20px';
  bubble.style.right = '20px';
  bubble.style.zIndex = '9999';
  bubble.style.cursor = 'pointer';

  bubble.addEventListener('click', () => {
    chat.classList.toggle('visible');
  });

  // handle sending messages
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && input.value.trim() !== '') {
      const text = input.value.trim();
      appendMessage('user', text);
      input.value = '';
      handleResponse(text);
    }
  });

  function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.className = `msg ${sender}`;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function handleResponse(text) {
    const lower = text.toLowerCase();

    if (lower.includes('pants') || lower.includes('stock') || lower.includes('back')) {
      appendMessage('bot', 'Checking in the back...');
      setTimeout(() => {
        appendMessage('bot', 'Please hold...');
        openBackroom();
      }, 1200);
    } else {
      appendMessage('bot', "I'm not sure about that. Try asking about our stock.");
    }
  }

  function openBackroom() {
    const popup = window.open(
      'back.html',
      'backroom',
      'width=500,height=350,menubar=no,toolbar=no,location=no,status=no,resizable=no'
    );

    if (!popup) {
      appendMessage('bot', 'Please allow pop-ups to continue.');
    }
  }
});
