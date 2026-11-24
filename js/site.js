// Let Subsplash embeds (giving, sermon library) grow to fit their content
window.addEventListener("message", function (e) {
  var frames = document.querySelectorAll("#subsplash-give, iframe.sp-autoheight");
  for (var i = 0; i < frames.length; i++) {
    if (e.source !== frames[i].contentWindow) continue;
    var d = e.data || {};
    if (d.pageHeight > 0) frames[i].style.height = d.pageHeight + "px";
  }
});

// Review preview only (claude.ai): outside embeds are blocked there, so show a labeled
// placeholder in their place. Does nothing on the live site.
document.addEventListener("DOMContentLoaded", function () {
  if (!/claudeusercontent\.com$/.test(location.hostname)) return;

  function slot(el, title, href) {
    var box = document.createElement("div");
    box.className = "embed-slot";
    box.innerHTML = "<strong></strong>On the live site, this appears right here on the page. " +
      "<a target=\"_blank\" rel=\"noopener\">Open it in a new tab →</a>";
    box.querySelector("strong").textContent = title;
    box.querySelector("a").href = href;
    el.parentNode.replaceChild(box, el);
  }

  var frames = document.querySelectorAll("iframe");
  for (var i = 0; i < frames.length; i++) {
    var f = frames[i];
    if (!/^https?:/.test(f.src)) continue;
    var host = f.closest(".video-16x9") || f;
    slot(host, f.title || "Embedded content", f.src.replace("youtube-nocookie.com/embed/videoseries?", "youtube.com/playlist?"));
  }
  var cals = document.querySelectorAll("div[id^='subsplash-embed-']");
  for (var j = 0; j < cals.length; j++) {
    var id = cals[j].id.replace("subsplash-embed-", "");
    slot(cals[j], "Events calendar (Subsplash)", "https://subsplash.com/+9f75/lb/ca/+" + id);
  }

  var bar = document.createElement("div");
  bar.className = "preview-bar";
  bar.textContent = "Review preview · Calendars, giving, sermon videos and sign-up boxes come from other sites and show as gray boxes here. They work on the live site.";
  document.body.insertBefore(bar, document.body.firstChild);
});

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
});

// Dropdown menus: the arrow button opens/closes its list (phones, tablets, keyboard);
// on computers they also open on hover (see site.css).
document.addEventListener("DOMContentLoaded", function () {
  var drops = document.querySelectorAll(".dropdown");
  function closeAll(except) {
    for (var i = 0; i < drops.length; i++) {
      if (drops[i] === except) continue;
      drops[i].classList.remove("open");
      drops[i].querySelector(".drop-btn").setAttribute("aria-expanded", "false");
    }
  }
  for (var i = 0; i < drops.length; i++) {
    (function (d) {
      var btn = d.querySelector(".drop-btn");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = !d.classList.contains("open");
        closeAll(d);
        d.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      // Close the menu after choosing a link (needed for same-page #links)
      var links = d.querySelectorAll(".drop-menu a");
      for (var j = 0; j < links.length; j++) {
        links[j].addEventListener("click", function () {
          closeAll(null);
          var nav = document.getElementById("site-nav");
          var toggle = document.querySelector(".menu-toggle");
          if (nav) nav.classList.remove("open");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
        });
      }
    })(drops[i]);
  }
  document.addEventListener("click", function () { closeAll(null); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(null); });
});
