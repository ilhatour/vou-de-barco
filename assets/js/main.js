/* VOU DE BARCO — interações
   nav mobile · header ao rolar · reveal · formulário → WhatsApp */
(function () {
  "use strict";
  var WA = "5524974031431"; // +55 24 97403-1431

  /* ---- Header muda ao rolar ---- */
  var header = document.querySelector(".site-header");
  if (header && !header.classList.contains("header--solid")) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Menu mobile ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Reveal ao entrar na viewport ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Efeitos de navegação: progresso, parallax, bússola ---- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var progress = document.querySelector(".scroll-progress");
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var needle = document.querySelector(".compass .needle");
  var ticking = false;

  function onScrollFx() {
    var y = window.scrollY || window.pageYOffset;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var p = docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0;
    if (progress) progress.style.setProperty("--p", p.toFixed(4));
    if (!reduceMotion) {
      for (var i = 0; i < parallaxEls.length; i++) {
        var el = parallaxEls[i];
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        el.style.transform = "translate3d(0," + (y * speed).toFixed(1) + "px,0)";
      }
      if (needle) needle.style.setProperty("--rot", (18 + p * 320).toFixed(1) + "deg");
    }
    ticking = false;
  }
  function requestFx() { if (!ticking) { ticking = true; window.requestAnimationFrame(onScrollFx); } }
  window.addEventListener("scroll", requestFx, { passive: true });
  window.addEventListener("resize", requestFx, { passive: true });
  onScrollFx();

  /* ---- Formulário de contato → WhatsApp ---- */
  var form = document.querySelector("[data-wa-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var nome = (d.get("nome") || "").toString().trim();
      var tel = (d.get("whatsapp") || "").toString().trim();
      var data = (d.get("data") || "").toString().trim();
      var pessoas = (d.get("pessoas") || "").toString().trim();
      var interesse = (d.get("interesse") || "").toString().trim();

      var linhas = [
        "Olá, Vou de Barco! Quero fazer uma reserva.",
        "",
        nome ? ("• Nome: " + nome) : "",
        interesse ? ("• Interesse: " + interesse) : "",
        data ? ("• Data desejada: " + data) : "",
        pessoas ? ("• Pessoas: " + pessoas) : "",
        tel ? ("• Meu WhatsApp: " + tel) : ""
      ].filter(Boolean);

      var url = "https://wa.me/" + WA + "?text=" + encodeURIComponent(linhas.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }
})();
