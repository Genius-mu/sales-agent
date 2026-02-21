(function () {
  "use strict";

  // ─── Config ───────────────────────────────────────────────────────────────
  var config = window.SalesAgentConfig || {};
  var businessId = config.businessId;
  var baseUrl = config.baseUrl || "https://yourapp.com";

  if (!businessId) {
    console.warn("[SalesAgent] No businessId provided in SalesAgentConfig.");
    return;
  }

  // ─── State ────────────────────────────────────────────────────────────────
  var sessionId = "sa-" + Math.random().toString(36).slice(2) + Date.now();
  var isOpen = false;
  var isLoading = false;
  var messages = [
    { role: "assistant", content: "Hi! 👋 How can I help you today?" },
  ];

  // ─── Styles ───────────────────────────────────────────────────────────────
  var style = document.createElement("style");
  style.textContent = [
    "#sa-launcher{position:fixed;bottom:24px;right:24px;z-index:99999;width:52px;height:52px;border-radius:50%;background:#2563eb;border:none;cursor:pointer;box-shadow:0 4px 24px rgba(37,99,235,0.4);display:flex;align-items:center;justify-content:center;transition:transform 0.2s,box-shadow 0.2s;}",
    "#sa-launcher:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(37,99,235,0.5);}",
    "#sa-launcher svg{transition:transform 0.3s;}",
    "#sa-widget{position:fixed;bottom:88px;right:24px;z-index:99998;width:360px;height:500px;border-radius:20px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.2);display:flex;flex-direction:column;background:#fff;border:1px solid #e4e4e7;transform:scale(0.92) translateY(12px);opacity:0;pointer-events:none;transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),opacity 0.2s;}",
    "#sa-widget.sa-open{transform:scale(1) translateY(0);opacity:1;pointer-events:all;}",
    "#sa-header{background:#2563eb;padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;}",
    "#sa-header-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;animation:sa-pulse 2s infinite;}",
    "@keyframes sa-pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}",
    "#sa-header-title{color:#fff;font-size:14px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}",
    "#sa-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f9f9fb;}",
    "#sa-messages::-webkit-scrollbar{width:4px;}",
    "#sa-messages::-webkit-scrollbar-track{background:transparent;}",
    "#sa-messages::-webkit-scrollbar-thumb{background:#d4d4d8;border-radius:4px;}",
    ".sa-msg{max-width:82%;padding:10px 13px;border-radius:16px;font-size:13px;line-height:1.5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;word-break:break-word;}",
    ".sa-msg-agent{background:#fff;color:#18181b;border:1px solid #e4e4e7;border-bottom-left-radius:4px;align-self:flex-start;box-shadow:0 1px 3px rgba(0,0,0,0.06);}",
    ".sa-msg-user{background:#2563eb;color:#fff;border-bottom-right-radius:4px;align-self:flex-end;}",
    ".sa-typing{display:flex;align-items:center;gap:4px;padding:10px 13px;background:#fff;border:1px solid #e4e4e7;border-radius:16px;border-bottom-left-radius:4px;align-self:flex-start;box-shadow:0 1px 3px rgba(0,0,0,0.06);}",
    ".sa-typing span{width:6px;height:6px;background:#a1a1aa;border-radius:50%;animation:sa-bounce 1.2s infinite;}",
    ".sa-typing span:nth-child(2){animation-delay:0.15s;}",
    ".sa-typing span:nth-child(3){animation-delay:0.3s;}",
    "@keyframes sa-bounce{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-5px);}}",
    "#sa-footer{border-top:1px solid #e4e4e7;padding:10px;display:flex;gap:8px;background:#fff;flex-shrink:0;}",
    "#sa-input{flex:1;border:1px solid #e4e4e7;border-radius:10px;padding:9px 13px;font-size:13px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;outline:none;color:#18181b;background:#f9f9fb;transition:border-color 0.15s;}",
    "#sa-input:focus{border-color:#2563eb;background:#fff;}",
    "#sa-input::placeholder{color:#a1a1aa;}",
    "#sa-send{background:#2563eb;border:none;border-radius:10px;width:36px;height:36px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.15s;}",
    "#sa-send:hover{background:#1d4ed8;}",
    "#sa-send:disabled{background:#93c5fd;cursor:not-allowed;}",
    "#sa-branding{text-align:center;font-size:10px;color:#a1a1aa;padding:4px 0 2px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}",
    "#sa-branding a{color:#a1a1aa;text-decoration:none;}",
    "#sa-branding a:hover{color:#2563eb;}",
  ].join("");
  document.head.appendChild(style);

  // ─── DOM ──────────────────────────────────────────────────────────────────
  // Launcher button
  var launcher = document.createElement("button");
  launcher.id = "sa-launcher";
  launcher.setAttribute("aria-label", "Open chat");
  launcher.innerHTML =
    '<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 3C6.477 3 2 6.925 2 11.75c0 2.412 1.064 4.593 2.793 6.15L4 21l3.578-1.433C8.944 20.166 10.43 20.5 12 20.5c5.523 0 10-3.925 10-8.75S17.523 3 12 3Z"/></svg>';
  document.body.appendChild(launcher);

  // Widget container
  var widget = document.createElement("div");
  widget.id = "sa-widget";
  widget.setAttribute("role", "dialog");
  widget.setAttribute("aria-label", "Sales Assistant");

  widget.innerHTML = [
    '<div id="sa-header">',
    '  <div id="sa-header-dot"></div>',
    '  <span id="sa-header-title">Sales Assistant</span>',
    "</div>",
    '<div id="sa-messages"></div>',
    '<div id="sa-footer">',
    '  <input id="sa-input" type="text" placeholder="Ask me anything..." autocomplete="off" />',
    '  <button id="sa-send" aria-label="Send">',
    '    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z"/></svg>',
    "  </button>",
    "</div>",
    '<div id="sa-branding"><a href="https://salesagent.ai" target="_blank">Powered by SalesAgent</a></div>',
  ].join("");

  document.body.appendChild(widget);

  var messagesEl = document.getElementById("sa-messages");
  var inputEl = document.getElementById("sa-input");
  var sendBtn = document.getElementById("sa-send");

  // ─── Render messages ──────────────────────────────────────────────────────
  function renderMessages() {
    messagesEl.innerHTML = "";
    messages.forEach(function (msg) {
      var div = document.createElement("div");
      div.className =
        "sa-msg " + (msg.role === "user" ? "sa-msg-user" : "sa-msg-agent");
      div.textContent = msg.content;
      messagesEl.appendChild(div);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    var div = document.createElement("div");
    div.className = "sa-typing";
    div.id = "sa-typing";
    div.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById("sa-typing");
    if (el) el.remove();
  }

  renderMessages();

  // ─── Toggle open/close ────────────────────────────────────────────────────
  function toggleWidget() {
    isOpen = !isOpen;
    if (isOpen) {
      widget.classList.add("sa-open");
      launcher.innerHTML =
        '<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#fff" stroke-width="2.5" stroke-linecap="round" d="M6 6l12 12M6 18L18 6"/></svg>';
      setTimeout(function () {
        inputEl.focus();
      }, 250);
    } else {
      widget.classList.remove("sa-open");
      launcher.innerHTML =
        '<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 3C6.477 3 2 6.925 2 11.75c0 2.412 1.064 4.593 2.793 6.15L4 21l3.578-1.433C8.944 20.166 10.43 20.5 12 20.5c5.523 0 10-3.925 10-8.75S17.523 3 12 3Z"/></svg>';
    }
  }

  // ─── Send message ─────────────────────────────────────────────────────────
  function sendMessage() {
    var text = inputEl.value.trim();
    if (!text || isLoading) return;

    messages.push({ role: "user", content: text });
    inputEl.value = "";
    renderMessages();
    showTyping();
    isLoading = true;
    sendBtn.disabled = true;

    fetch(baseUrl + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        sessionId: sessionId,
        businessId: businessId,
      }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        hideTyping();
        messages.push({
          role: "assistant",
          content: data.reply || "Sorry, I couldn't get a response.",
        });
        renderMessages();
      })
      .catch(function () {
        hideTyping();
        messages.push({
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        });
        renderMessages();
      })
      .finally(function () {
        isLoading = false;
        sendBtn.disabled = false;
        inputEl.focus();
      });
  }

  // ─── Events ───────────────────────────────────────────────────────────────
  launcher.addEventListener("click", toggleWidget);
  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Close on outside click
  document.addEventListener("click", function (e) {
    if (isOpen && !widget.contains(e.target) && !launcher.contains(e.target)) {
      toggleWidget();
    }
  });
})();
