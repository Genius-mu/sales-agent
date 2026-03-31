(function () {
  "use strict";

  var config = window.SaimConfig || {};
  var businessId = config.businessId;
  var baseUrl = config.baseUrl || "https://sales-agent-jet.vercel.app";

  if (!businessId) {
    console.warn("[Saim] No businessId provided in SaimConfig.");
    return;
  }

  var sessionId = "sa-" + Math.random().toString(36).slice(2) + Date.now();
  var isOpen = false;
  var isLoading = false;
  var messages = [
    { role: "assistant", content: "Hi! 👋 How can I help you today?" },
  ];

  var launcherStyle = document.createElement("style");
  launcherStyle.textContent =
    "#sa-launcher{position:fixed;bottom:24px;right:24px;z-index:2147483647;width:52px;height:52px;border-radius:50%;background:#2563eb;border:none;cursor:pointer;box-shadow:0 4px 24px rgba(37,99,235,0.45);display:flex;align-items:center;justify-content:center;transition:transform 0.2s,box-shadow 0.2s;outline:none;padding:0;}#sa-launcher:hover{transform:scale(1.08);box-shadow:0 6px 32px rgba(37,99,235,0.55);}#sa-iframe-wrap{position:fixed;bottom:88px;right:24px;z-index:2147483646;width:370px;height:530px;border:none;border-radius:20px;box-shadow:0 24px 64px rgba(0,0,0,0.22);transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),opacity 0.2s;overflow:hidden;}";
  document.head.appendChild(launcherStyle);

  var launcher = document.createElement("button");
  launcher.id = "sa-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-label", "Open chat");
  launcher.innerHTML = iconChat();
  document.body.appendChild(launcher);

  var iframeWrap = document.createElement("iframe");
  iframeWrap.id = "sa-iframe-wrap";
  iframeWrap.setAttribute("title", "Saim Assistant");
  iframeWrap.setAttribute("frameborder", "0");
  iframeWrap.style.transform = "scale(0.92) translateY(12px)";
  iframeWrap.style.opacity = "0";
  iframeWrap.style.pointerEvents = "none";
  document.body.appendChild(iframeWrap);

  var widgetCSS = [
    "*{box-sizing:border-box;margin:0;padding:0;}",
    "body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fff;display:flex;flex-direction:column;height:100vh;overflow:hidden;}",
    "#sa-header{background:#2563eb;padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;}",
    "#sa-header-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;animation:pulse 2s infinite;flex-shrink:0;}",
    "@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}",
    "#sa-header-title{color:#fff;font-size:14px;font-weight:600;}",
    "#sa-messages{flex:1;overflow-y:auto;overflow-x:hidden;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f9f9fb;min-height:0;}",
    "#sa-messages::-webkit-scrollbar{width:4px;}",
    "#sa-messages::-webkit-scrollbar-thumb{background:#d4d4d8;border-radius:4px;}",
    ".msg{max-width:82%;padding:10px 14px;border-radius:16px;font-size:13px;line-height:1.55;word-break:break-word;overflow-wrap:break-word;}",
    ".msg-agent{background:#fff;color:#18181b;border:1px solid #e4e4e7;border-bottom-left-radius:4px;align-self:flex-start;box-shadow:0 1px 3px rgba(0,0,0,0.06);}",
    ".msg-user{background:#2563eb;color:#fff;border-bottom-right-radius:4px;align-self:flex-end;}",
    ".msg strong{font-weight:700;}",
    ".msg em{font-style:italic;}",
    ".typing{display:flex;align-items:center;gap:4px;padding:10px 13px;background:#fff;border:1px solid #e4e4e7;border-radius:16px;border-bottom-left-radius:4px;align-self:flex-start;}",
    ".typing span{width:6px;height:6px;background:#a1a1aa;border-radius:50%;animation:bounce 1.2s infinite;}",
    ".typing span:nth-child(2){animation-delay:0.15s;}",
    ".typing span:nth-child(3){animation-delay:0.3s;}",
    "@keyframes bounce{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-5px);}}",
    "#sa-footer{border-top:1px solid #e4e4e7;padding:10px 10px 6px;display:flex;gap:8px;background:#fff;flex-shrink:0;align-items:center;}",
    "#sa-input{flex:1;border:1px solid #e4e4e7;border-radius:10px;padding:9px 13px;font-size:13px;outline:none;color:#18181b;background:#f9f9fb;transition:border-color 0.15s;height:36px;font-family:inherit;}",
    "#sa-input:focus{border-color:#2563eb;background:#fff;}",
    "#sa-input::placeholder{color:#a1a1aa;}",
    "#sa-send{background:#2563eb;border:none;border-radius:10px;width:36px;height:36px;min-width:36px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.15s;}",
    "#sa-send:hover{background:#1d4ed8;}",
    "#sa-send:disabled{background:#93c5fd;cursor:not-allowed;}",
    "#sa-branding{text-align:center;font-size:10px;color:#a1a1aa;padding:4px 0 8px;flex-shrink:0;background:#fff;}",
  ].join("");

  var widgetHTML =
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
    widgetCSS +
    "</style></head><body>" +
    '<div id="sa-header"><div id="sa-header-dot"></div><span id="sa-header-title">Sales Assistant</span></div>' +
    '<div id="sa-messages"></div>' +
    '<div id="sa-footer"><input id="sa-input" type="text" placeholder="Ask me anything..." autocomplete="off" />' +
    '<button id="sa-send" type="button"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z"/></svg></button></div>' +
    '<div id="sa-branding">Powered by Saim</div>' +
    "</body></html>";

  // Fetch widget config (agent name + color) then inject
  fetch(baseUrl + "/api/widget-config?businessId=" + businessId)
    .then(function (r) {
      return r.json();
    })
    .catch(function () {
      return { agent_name: "Sales Assistant", widget_color: "#2563eb" };
    })
    .then(function (cfg) {
      var agentName = cfg.agent_name || "Sales Assistant";
      var color = cfg.widget_color || "#2563eb";

      // Apply color + agent name to HTML
      var html = widgetHTML
        .replace(/#2563eb/g, color)
        .replace(/#1d4ed8/g, darkenColor(color))
        .replace("Sales Assistant", agentName);

      iframeWrap.srcdoc = html;

      // Also update launcher color
      launcherStyle.textContent = launcherStyle.textContent
        .replace(/#2563eb/g, color)
        .replace(/#1d4ed8/g, darkenColor(color));
    });

  function darkenColor(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    r = Math.max(0, r - 30);
    g = Math.max(0, g - 30);
    b = Math.max(0, b - 30);
    return (
      "#" +
      [r, g, b]
        .map(function (x) {
          return x.toString(16).padStart(2, "0");
        })
        .join("")
    );
  }

  function getIframeDoc() {
    return iframeWrap.contentDocument || iframeWrap.contentWindow.document;
  }

  function waitForIframe(cb) {
    var attempts = 0;
    var check = setInterval(function () {
      attempts++;
      var doc = getIframeDoc();
      if (doc && doc.getElementById("sa-messages")) {
        clearInterval(check);
        cb(doc);
      }
      if (attempts > 50) clearInterval(check);
    }, 100);
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatText(text) {
    return escapeHtml(text)
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }

  waitForIframe(function (doc) {
    var messagesEl = doc.getElementById("sa-messages");
    var inputEl = doc.getElementById("sa-input");
    var sendBtn = doc.getElementById("sa-send");

    function renderMessages() {
      messagesEl.innerHTML = "";
      messages.forEach(function (msg) {
        var div = doc.createElement("div");
        div.className =
          "msg " + (msg.role === "user" ? "msg-user" : "msg-agent");
        div.innerHTML = formatText(msg.content);
        messagesEl.appendChild(div);
      });
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
      var div = doc.createElement("div");
      div.id = "sa-typing";
      div.className = "typing";
      div.innerHTML = "<span></span><span></span><span></span>";
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function hideTyping() {
      var el = doc.getElementById("sa-typing");
      if (el) el.remove();
    }

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
          if (data.limitReached) {
            var upgradeUrl =
              data.upgradeUrl ||
              "https://sales-agent-jet.vercel.app/dashboard/billing";
            messages.push({
              role: "assistant",
              content:
                'This assistant has reached its monthly conversation limit. <a href="' +
                upgradeUrl +
                '" target="_blank" style="color:#2563eb;font-weight:600;">Upgrade to continue →</a>',
            });
          } else {
            messages.push({
              role: "assistant",
              content: data.reply || "Sorry, I couldn't get a response.",
            });
          }
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

    renderMessages();

    sendBtn.addEventListener("click", sendMessage);
    inputEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  });

  function openWidget() {
    isOpen = true;
    iframeWrap.style.transform = "scale(1) translateY(0)";
    iframeWrap.style.opacity = "1";
    iframeWrap.style.pointerEvents = "all";
    launcher.innerHTML = iconClose();
    setTimeout(function () {
      try {
        getIframeDoc().getElementById("sa-input").focus();
      } catch (e) {}
    }, 300);
  }

  function closeWidget() {
    isOpen = false;
    iframeWrap.style.transform = "scale(0.92) translateY(12px)";
    iframeWrap.style.opacity = "0";
    iframeWrap.style.pointerEvents = "none";
    launcher.innerHTML = iconChat();
  }

  launcher.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    isOpen ? closeWidget() : openWidget();
  });

  document.addEventListener("click", function (e) {
    if (
      isOpen &&
      !iframeWrap.contains(e.target) &&
      !launcher.contains(e.target)
    )
      closeWidget();
  });

  function iconChat() {
    return '<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 3C6.477 3 2 6.925 2 11.75c0 2.412 1.064 4.593 2.793 6.15L4 21l3.578-1.433C8.944 20.166 10.43 20.5 12 20.5c5.523 0 10-3.925 10-8.75S17.523 3 12 3Z"/></svg>';
  }

  function iconClose() {
    return '<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#fff" stroke-width="2.5" stroke-linecap="round" d="M6 6l12 12M6 18L18 6"/></svg>';
  }
})();
