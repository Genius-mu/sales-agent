(function () {
  "use strict";

  var config = window.SaimConfig || {};
  var businessId = config.businessId;
  var rawBaseUrl = config.baseUrl || "https://sales-agent-jet.vercel.app";
  var baseUrl = rawBaseUrl.replace(/\/+$/, "");

  if (!businessId) {
    console.warn("[Saim] No businessId provided in SaimConfig.");
    return;
  }

  var sessionId = "sa-" + Math.random().toString(36).slice(2) + Date.now();
  var isOpen = false;
  var isLoading = false;
  var messages = [
    { role: "assistant", content: "Hi! How can I help you today?" },
  ];

  var launcherStyle = document.createElement("style");
  launcherStyle.textContent =
    "#sa-launcher{position:fixed;bottom:20px;right:20px;z-index:2147483647;width:54px;height:54px;border-radius:50%;background:#2563eb;border:none;cursor:pointer;box-shadow:0 8px 28px rgba(37,99,235,0.45);display:flex;align-items:center;justify-content:center;transition:transform 0.2s,box-shadow 0.2s;outline:none;padding:0;}#sa-launcher:hover{transform:scale(1.08);box-shadow:0 10px 36px rgba(37,99,235,0.55);}#sa-iframe-wrap{position:fixed;bottom:84px;right:16px;z-index:2147483646;width:min(372px,calc(100vw - 32px));height:min(560px,calc(100vh - 110px));border:none;border-radius:18px;box-shadow:0 24px 64px rgba(0,0,0,0.22);transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),opacity 0.2s;overflow:hidden;}@media(max-width:480px){#sa-iframe-wrap{right:0;left:0;width:100%;bottom:0;height:calc(100vh - 80px);border-radius:20px 20px 0 0;}#sa-launcher{bottom:20px;right:20px;}}";
  document.head.appendChild(launcherStyle);

  var launcher = document.createElement("button");
  launcher.id = "sa-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-label", "Open chat");
  launcher.innerHTML = iconChat();
  document.body.appendChild(launcher);

  var widgetCSS = [
    "*{box-sizing:border-box;margin:0;padding:0;}",
    "body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fff;display:flex;flex-direction:column;height:100%;min-height:100vh;overflow:hidden;}",
    "html{height:100%;}",
    "@media(max-width:480px){#sa-header{padding:16px;}#sa-messages{padding:14px;}#sa-footer{padding:10px 10px 12px;}.msg{max-width:90%;font-size:14px;}}",
    "#sa-header{background:#2563eb;padding:14px 16px;display:flex;align-items:center;gap:11px;flex-shrink:0;justify-content:space-between;}",
    "#sa-header-left{display:flex;align-items:center;gap:11px;}",
    "#sa-avatar-wrap{position:relative;flex-shrink:0;}",
    "#sa-avatar{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:600;overflow:hidden;}",
    "#sa-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%;}",
    "img{max-width:100%;height:auto;}",
    "#sa-avatar-dot{position:absolute;bottom:-1px;right:-1px;width:10px;height:10px;border-radius:50%;background:#4ade80;border:2px solid #2563eb;}",
    "#sa-header-title{color:#fff;font-size:14px;font-weight:600;line-height:1.1;}",
    "#sa-header-sub{color:rgba(255,255,255,0.75);font-size:11px;margin-top:2px;}",
    "#sa-messages{flex:1;overflow-y:auto;overflow-x:hidden;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f7f7f9;min-height:0;}",
    "#sa-messages::-webkit-scrollbar{width:4px;}",
    "#sa-messages::-webkit-scrollbar-thumb{background:#d4d4d8;border-radius:4px;}",
    ".msg{max-width:82%;padding:10px 14px;border-radius:16px;font-size:13px;line-height:1.55;word-break:break-word;overflow-wrap:break-word;animation:msgIn 0.25s cubic-bezier(0.16,1,0.3,1);}",
    "@keyframes msgIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}",
    ".msg-agent{background:#fff;color:#18181b;border:1px solid #e8e8ec;border-bottom-left-radius:5px;align-self:flex-start;box-shadow:0 1px 2px rgba(0,0,0,0.05);}",
    ".msg-user{background:#2563eb;color:#fff;border-bottom-right-radius:5px;align-self:flex-end;}",
    ".msg a{color:inherit;text-decoration:underline;}",
    ".msg-agent a{color:#2563eb;}",
    ".msg strong{font-weight:700;}",
    ".msg em{font-style:italic;}",
    ".typing{display:flex;align-items:center;gap:4px;padding:12px 14px;background:#fff;border:1px solid #e8e8ec;border-radius:16px;border-bottom-left-radius:5px;align-self:flex-start;box-shadow:0 1px 2px rgba(0,0,0,0.05);}",
    ".typing span{width:6px;height:6px;background:#a1a1aa;border-radius:50%;animation:bounce 1.2s infinite;}",
    ".typing span:nth-child(2){animation-delay:0.15s;}",
    ".typing span:nth-child(3){animation-delay:0.3s;}",
    "@keyframes bounce{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-5px);}}",
    "#sa-footer{border-top:1px solid #ececef;padding:11px 11px 7px;display:flex;gap:8px;background:#fff;flex-shrink:0;align-items:center;}",
    "#sa-input{flex:1;border:1px solid #e4e4e7;border-radius:11px;padding:9px 14px;font-size:13px;outline:none;color:#18181b;background:#f7f7f9;transition:border-color 0.15s,background 0.15s;height:38px;font-family:inherit;}",
    "#sa-input:focus{border-color:#2563eb;background:#fff;}",
    "#sa-input::placeholder{color:#a1a1aa;}",
    "#sa-send{background:#2563eb;border:none;border-radius:11px;width:38px;height:38px;min-width:38px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.15s,transform 0.1s;}",
    "#sa-send:hover{background:#1d4ed8;}",
    "#sa-send:active{transform:scale(0.94);}",
    "#sa-send:disabled{background:#93c5fd;cursor:not-allowed;}",
    "#sa-branding{text-align:center;font-size:10px;color:#b4b4bb;padding:4px 0 9px;flex-shrink:0;background:#fff;}",
  ].join("");

  var widgetHTML =
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>' +
    widgetCSS +
    "</style></head><body>" +
    '<div id="sa-header"><div id="sa-header-left"><div id="sa-avatar-wrap"><div id="sa-avatar">S</div><div id="sa-avatar-dot"></div></div><div><div id="sa-header-title">Sales Assistant</div><div id="sa-header-sub">Online · Replies instantly</div></div></div><button id="sa-close-btn" style="background:rgba(255,255,255,0.15);border:none;border-radius:8px;width:28px;height:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;flex-shrink:0;"><svg width=\"14\" height=\"14\" fill=\"none\" viewBox=\"0 0 24 24\"><path stroke=\"#fff\" stroke-width=\"2.5\" stroke-linecap=\"round\" d=\"M6 6l12 12M6 18L18 6\"/></svg></button></div>' +
    '<div id="sa-messages"></div>' +
    '<div id="sa-footer"><input id="sa-input" type="text" placeholder="Ask me anything…" autocomplete="off" />' +
    '<button id="sa-send" type="button"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z"/></svg></button></div>' +
    '<div id="sa-branding">Powered by Saim</div>' +
    "</body></html>";

  var iframeWrap = document.createElement("iframe");
  iframeWrap.id = "sa-iframe-wrap";
  iframeWrap.setAttribute("title", "Saim Assistant");
  iframeWrap.setAttribute("frameborder", "0");
  iframeWrap.style.transform = "scale(0.92) translateY(12px)";
  iframeWrap.style.opacity = "0";
  iframeWrap.style.pointerEvents = "none";
  iframeWrap.srcdoc = widgetHTML;
  document.body.appendChild(iframeWrap);

  // Fetch widget config (agent name + color) then update dynamically
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
      updateWidgetConfig(agentName, color);
      // White-label (Scale plan): the server decides whether branding shows
      if (cfg.show_branding === false) {
        waitForIframe(function (doc) {
          var b = doc.getElementById("sa-branding");
          if (b) b.style.display = "none";
        });
      }
    });

  function updateWidgetConfig(agentName, color) {
    waitForIframe(function (doc) {
      var header = doc.getElementById("sa-header");
      if (header) header.style.backgroundColor = color;

      var titleEl = doc.getElementById("sa-header-title");
      if (titleEl) titleEl.textContent = agentName;

      var avatarEl = doc.getElementById("sa-avatar");
      if (avatarEl && !avatarEl.querySelector("img")) {
        avatarEl.textContent = agentName.charAt(0).toUpperCase();
      }

      var sendBtn = doc.getElementById("sa-send");
      if (sendBtn) sendBtn.style.backgroundColor = color;
    });

    launcherStyle.textContent = launcherStyle.textContent
      .replace(/#2563eb/g, color)
      .replace(/#1d4ed8/g, darkenColor(color));
  }

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

  function appendSafeLink(doc, container, rawUrl, rawLabel) {
    var cleanUrl = (rawUrl || "").trim();
    var labelText = (rawLabel || cleanUrl).replace(/<[^>]*>/g, "");

    var isSafe = false;
    try {
      if (cleanUrl.indexOf("/") === 0) {
        isSafe = true;
      } else {
        var parsed = new URL(cleanUrl, "https://example.com");
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          isSafe = true;
        }
      }
    } catch (e) {
      isSafe = false;
    }

    if (cleanUrl.toLowerCase().indexOf("javascript:") === 0) {
      isSafe = false;
    }

    if (isSafe) {
      var a = doc.createElement("a");
      a.href = cleanUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = labelText;
      container.appendChild(a);
    } else {
      container.appendChild(doc.createTextNode(labelText));
    }
  }

  function parseLineTokens(doc, container, text) {
    var pattern = /(?:<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>|\[([^\]]+)\]\(([^)]+)\)|\*\*(.*?)\*\*|\*(.*?)\*)/gi;
    var lastIndex = 0;
    var match;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        container.appendChild(
          doc.createTextNode(text.substring(lastIndex, match.index)),
        );
      }

      if (match[1] !== undefined) {
        appendSafeLink(doc, container, match[1], match[2]);
      } else if (match[3] !== undefined) {
        appendSafeLink(doc, container, match[4], match[3]);
      } else if (match[5] !== undefined) {
        var strong = doc.createElement("strong");
        strong.textContent = match[5];
        container.appendChild(strong);
      } else if (match[6] !== undefined) {
        var em = doc.createElement("em");
        em.textContent = match[6];
        container.appendChild(em);
      }

      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < text.length) {
      container.appendChild(doc.createTextNode(text.substring(lastIndex)));
    }
  }

  function renderMessageContent(doc, container, content) {
    container.textContent = "";
    var lines = (content || "").split("\n");
    lines.forEach(function (line, idx) {
      if (idx > 0) {
        container.appendChild(doc.createElement("br"));
      }
      parseLineTokens(doc, container, line);
    });
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
        renderMessageContent(doc, div, msg.content);
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
                '" target="_blank">Upgrade to continue →</a>',
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

    // Close button inside widget header
    var closeBtn = doc.getElementById("sa-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        closeWidget();
      });
    }

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
    // Hide launcher on mobile since close btn is inside widget
    if (window.innerWidth <= 480) {
      launcher.style.display = "none";
    }
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
    launcher.style.display = "flex";
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
    return '<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 3C6.477 3 2 6.925 2 11.75c0 2.412 1.064 4.593 2.793 6.15L4 21l3.578-1.433C8.944 20.166 10.43 20.5 12 20.5c5.523 0 10-3.925 10-8.75S17.523 3 12 3Z"/></svg>';
  }

  function iconClose() {
    return '<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#fff" stroke-width="2.5" stroke-linecap="round" d="M6 6l12 12M6 18L18 6"/></svg>';
  }
})();
