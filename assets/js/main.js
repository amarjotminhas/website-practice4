/* =====================================================================
   MERIDIAN INTERIOR GROUP — Global behavior
   ===================================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Theme toggle (persisted) ---- */
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem("mig-theme");
    if (saved) root.setAttribute("data-theme", saved);
  } catch (e) {}
  var tbtn = document.getElementById("themeBtn");
  if (tbtn) {
    tbtn.addEventListener("click", function () {
      var cur = root.getAttribute("data-theme");
      if (!cur) cur = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      var next = cur === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("mig-theme", next); } catch (e) {}
    });
  }

  /* ---- Mobile nav ---- */
  var burger = document.getElementById("burger"), mnav = document.getElementById("mnav");
  if (burger && mnav) {
    burger.addEventListener("click", function () {
      var open = mnav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mnav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { mnav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---- Reveal on scroll ---- */
  var revs = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revs.forEach(function (e) { e.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revs.forEach(function (e) { io.observe(e); });
  }

  /* ---- Condensing nav shadow ---- */
  var nav = document.getElementById("topnav");
  if (nav) {
    var onScroll = function () { nav.style.boxShadow = window.scrollY > 12 ? "0 10px 30px -18px rgba(0,0,0,0.35)" : "none"; };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  /* ---- Year stamp ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- Unsplash image URL helper ---- */
  window.migImg = function (id, w) {
    return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + (w || 800) + "&q=80";
  };

  /* ---- Count-up stats: replays every time they scroll into view ---- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var animateCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var dur = 900, start = null;
      var myRun = (el._run || 0) + 1; el._run = myRun;   // token cancels any prior animation
      function tick(ts) {
        if (el._run !== myRun) return;                    // superseded by a reset/restart
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(dec);
      }
      requestAnimationFrame(tick);
    };
    if (reduce || !("IntersectionObserver" in window)) {
      /* leave the real numbers in place for reduced-motion / no-JS-observer */
    } else {
      counters.forEach(function (el) { el.textContent = "0"; });
      var cio = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          var el = en.target;
          if (en.isIntersecting) {
            if (!el._counting) { el._counting = true; animateCount(el); }   // start once per entry
          } else {
            el._counting = false;
            el._run = (el._run || 0) + 1;   // cancel any in-flight animation
            el.textContent = "0";           // reset so the next scroll-in animates fresh
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* =============== BLUEPRINT THUMBNAIL GENERATOR =============== */
  var palettes = [
    ["#1f2933","#3a4a57"], ["#2a2320","#4a3a2c"], ["#1e2a2a","#2f4747"],
    ["#26232e","#403a52"], ["#2a2422","#4a3630"], ["#20262b","#374651"]
  ];
  window.migThumb = function (seed) {
    var p = palettes[seed % palettes.length], g = "grad" + seed, lines = "";
    for (var i = 1; i < 9; i++) { var x = i * 12.5; lines += '<line x1="'+x+'" y1="0" x2="'+x+'" y2="75" stroke="rgba(255,255,255,0.06)" stroke-width="0.4"/>'; }
    for (var j = 1; j < 6; j++) { var y = j * 12.5; lines += '<line x1="0" y1="'+y+'" x2="100" y2="'+y+'" stroke="rgba(255,255,255,0.06)" stroke-width="0.4"/>'; }
    var fx = 14 + (seed*7 % 18), fy = 14 + (seed*5 % 12), fw = 46 + (seed*3 % 20), fh = 30 + (seed*4 % 14);
    var plan = '<rect x="'+fx+'" y="'+fy+'" width="'+fw+'" height="'+fh+'" fill="none" stroke="#2E96D6" stroke-width="0.8"/>'+
      '<line x1="'+fx+'" y1="'+(fy+fh*0.55)+'" x2="'+(fx+fw)+'" y2="'+(fy+fh*0.55)+'" stroke="#2E96D6" stroke-width="0.5" opacity="0.8"/>'+
      '<line x1="'+(fx+fw*0.5)+'" y1="'+fy+'" x2="'+(fx+fw*0.5)+'" y2="'+(fy+fh)+'" stroke="#2E96D6" stroke-width="0.5" opacity="0.8"/>'+
      '<circle cx="'+(fx+fw)+'" cy="'+(fy+fh*0.55)+'" r="1.6" fill="#2E96D6"/>';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 75" preserveAspectRatio="xMidYMid slice">'+
      '<defs><linearGradient id="'+g+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+p[0]+'"/><stop offset="1" stop-color="'+p[1]+'"/></linearGradient></defs>'+
      '<rect width="100" height="75" fill="url(#'+g+')"/>'+ lines + plan + '</svg>';
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  };

  /* =============== PORTFOLIO (renders where #projGrid exists) =============== */
  var grid = document.getElementById("projGrid");
  if (grid) {
    var limit = parseInt(grid.getAttribute("data-limit") || "0", 10);
    var projects = [
      { name: "Northwind Labs — R&D Campus", region: "mountain", sector: "science", place: "Boulder, CO", tags: "Cleanrooms · 120,000 SF", img: "1532094349884-543bc11b234d" },
      { name: "Cascade Systems HQ", region: "pacific", sector: "office", place: "Portland, OR", tags: "Headquarters · 8 Floors", img: "1497366811353-6870744d04b2" },
      { name: "Trailhead Bio Manufacturing", region: "mountain", sector: "science", place: "Salt Lake City, UT", tags: "GMP · Process Piping", img: "1576086213369-97a306d36557" },
      { name: "Summit Legal Partners", region: "southwest", sector: "office", place: "Phoenix, AZ", tags: "Law · Custom Millwork", img: "1524758631624-e2822e304c36" },
      { name: "Copperfield Health Clinic", region: "mountain", sector: "health", place: "Denver, CO", tags: "Outpatient · Imaging", img: "1519494026892-80bbd2d6fd0d" },
      { name: "The Halcyon Hotel Renovation", region: "mountain", sector: "hospitality", place: "Denver, CO", tags: "Hospitality · Occupied", img: "1566073771259-6a8506099945" },
      { name: "Rincon Capital Offices", region: "southwest", sector: "office", place: "Austin, TX", tags: "Finance · Trading Floor", img: "1600880292203-757bb62b4baf" },
      { name: "Willamette Dental Group", region: "pacific", sector: "health", place: "Portland, OR", tags: "Multi-Site · Rollout", img: "1631217868264-e5b90bb7e133" },
      { name: "Sonora Neuroscience Suite", region: "southwest", sector: "science", place: "Tucson, AZ", tags: "Dry Lab · Vivarium", img: "1600607687939-ce8a6c25118c" },
      { name: "Basecamp Coworking", region: "mountain", sector: "office", place: "Boise, ID", tags: "Amenity · Fit-Out", img: "1497366216548-37526070297c" },
      { name: "Cedar & Vine Restaurant Group", region: "pacific", sector: "hospitality", place: "Portland, OR", tags: "Restaurant · 3 Venues", img: "1551882547-ff40c63fe5fa" },
      { name: "Mesa Verde Surgical Center", region: "southwest", sector: "health", place: "Phoenix, AZ", tags: "ASC · OR Suites", img: "1538108149393-fbbd81895907" }
    ];
    var list = limit ? projects.slice(0, limit) : projects;
    var frag = document.createDocumentFragment();
    list.forEach(function (pr, i) {
      var el = document.createElement("article");
      el.className = "proj reveal";
      el.setAttribute("data-region", pr.region);
      el.setAttribute("data-sector", pr.sector);
      el.innerHTML =
        '<div class="thumb"><img loading="lazy" alt="'+pr.name+'" src="'+window.migImg(pr.img, 640)+'"></div>'+
        '<div class="meta"><span class="region">'+pr.place+'</span><h3>'+pr.name+'</h3><div class="tags">'+pr.tags+'</div></div>';
      frag.appendChild(el);
    });
    grid.appendChild(frag);
    grid.querySelectorAll(".reveal").forEach(function (e) { e.classList.add("in"); });

    var state = { region: "all", sector: "all" };
    var chips = document.querySelectorAll(".chip[data-type]");
    var empty = document.getElementById("emptyMsg");
    function applyFilter() {
      var shown = 0;
      grid.querySelectorAll(".proj").forEach(function (p) {
        var okR = state.region === "all" || p.getAttribute("data-region") === state.region;
        var okS = state.sector === "all" || p.getAttribute("data-sector") === state.sector;
        var ok = okR && okS;
        p.classList.toggle("hide", !ok);
        if (ok) shown++;
      });
      if (empty) empty.style.display = shown ? "none" : "block";
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        var t = c.getAttribute("data-type");
        state[t] = c.getAttribute("data-val");
        chips.forEach(function (o) { if (o.getAttribute("data-type") === t) o.setAttribute("aria-pressed", o === c ? "true" : "false"); });
        applyFilter();
      });
    });
  }

  /* =============== US OFFICE MAP PINS (home only) =============== */
  var pinsWrap = document.getElementById("usmapPins");
  if (pinsWrap) {
    var MW = 959, MH = 593;   /* matches the inline map viewBox */
    var offices = [
      { city: "Denver", note: "Headquarters — our home office since 2001.", x: 375, y: 235, hq: true },
      { city: "Portland", note: "Our Pacific Northwest home.", x: 165, y: 72 },
      { city: "Boise", note: "Building across the Boise metro.", x: 240, y: 130 },
      { city: "Salt Lake City", note: "Our Mountain West operations hub.", x: 285, y: 200 },
      { city: "Phoenix", note: "Projects across the Valley of the Sun.", x: 270, y: 340 },
      { city: "Austin", note: "Serving Central Texas from downtown.", x: 495, y: 428 },
      { city: "Nashville", note: "Delivering across Middle Tennessee.", x: 660, y: 300 }
    ];
    var closeAll = function () {
      var open = pinsWrap.querySelectorAll(".usmap-pin.open");
      for (var i = 0; i < open.length; i++) open[i].classList.remove("open");
    };
    offices.forEach(function (o) {
      var pin = document.createElement("button");
      pin.type = "button";
      pin.className = "usmap-pin" + (o.hq ? " is-hq" : "");
      pin.style.left = (o.x / MW * 100) + "%";
      pin.style.top = (o.y / MH * 100) + "%";
      pin.setAttribute("aria-label", o.city + " — " + o.note);
      pin.innerHTML = '<span class="usmap-dot" aria-hidden="true"></span>' +
        '<span class="usmap-tip" role="tooltip"><b>' + o.city + '</b><span>' + o.note + '</span></span>';
      pin.addEventListener("click", function (e) {
        e.stopPropagation();
        var wasOpen = pin.classList.contains("open");
        closeAll();
        if (!wasOpen) pin.classList.add("open");
      });
      pinsWrap.appendChild(pin);
    });
    document.addEventListener("click", closeAll);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
  }

  /* =============== HERO SLIDESHOW (home only) =============== */
  var slides = document.querySelectorAll(".hero-slide");
  if (slides.length > 1) {
    var dirs = ["pan-right", "pan-left", "pan-up", "pan-down"];
    var randDir = function () { return dirs[Math.floor(Math.random() * dirs.length)]; };
    var idx = 0;
    slides[0].classList.add(randDir());
    if (!reduce) {
      setInterval(function () {
        var cur = slides[idx];
        cur.classList.remove("is-active", "pan-right", "pan-left", "pan-up", "pan-down");
        idx = (idx + 1) % slides.length;
        var next = slides[idx];
        next.classList.add(randDir());
        void next.offsetWidth;           /* restart the pan animation */
        next.classList.add("is-active");
      }, 6000);
    }
  }

  /* =============== HERO CANVAS (home only) =============== */
  var cv = document.getElementById("meridian");
  if (cv && cv.getContext) {
    var ctx = cv.getContext("2d"), w, h, dpr = Math.min(window.devicePixelRatio || 1, 2), t = 0;
    var accent = "236,235,230";
    function size() { var r = cv.getBoundingClientRect(); w = r.width; h = r.height; cv.width = w*dpr; cv.height = h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
    var arcs = [];
    for (var i = 0; i < 5; i++) arcs.push({ r: 0.3 + i*0.22, off: Math.random()*Math.PI*2, sp: 0.0006 + i*0.0002 });
    function draw() {
      ctx.clearRect(0,0,w,h);
      var cx = w*0.72, cy = h*0.32;
      arcs.forEach(function (a, i) {
        var rr = a.r * Math.max(w,h) * 0.6;
        ctx.beginPath();
        ctx.strokeStyle = "rgba(" + accent + "," + (0.05 + (i===2 ? 0.05 : 0)) + ")";
        ctx.lineWidth = i===2 ? 1.2 : 0.7;
        ctx.arc(cx, cy, rr, a.off + t*a.sp, a.off + t*a.sp + Math.PI*1.4);
        ctx.stroke();
      });
      var mx = cx + Math.sin(t*0.0004)*40;
      ctx.beginPath(); ctx.strokeStyle = "rgba(" + accent + ",0.12)"; ctx.lineWidth = 1;
      ctx.moveTo(mx, 0); ctx.lineTo(mx, h); ctx.stroke();
      t += 1; requestAnimationFrame(draw);
    }
    size(); window.addEventListener("resize", size);
    if (!reduce) draw();
    else { var cx2 = w*0.72, cy2 = h*0.32; arcs.forEach(function (a) { ctx.beginPath(); ctx.strokeStyle="rgba("+accent+",0.06)"; ctx.lineWidth=0.8; ctx.arc(cx2,cy2,a.r*Math.max(w,h)*0.6,a.off,a.off+Math.PI*1.4); ctx.stroke(); }); }
  }

  /* =============== CONTACT / GENERIC FORM VALIDATION =============== */
  document.querySelectorAll("form[data-validate]").forEach(function (form) {
    var success = document.getElementById(form.getAttribute("data-success"));
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var valid = input.value.trim() !== "";
        if (input.type === "email") valid = valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        if (field) field.classList.toggle("invalid", !valid);
        if (!valid && ok) { input.focus(); ok = false; }
        else if (!valid) ok = false;
      });
      if (!ok) return;
      if (success) {
        form.style.display = "none";
        success.classList.add("show");
        success.setAttribute("tabindex", "-1");
        success.focus();
        success.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      }
    });
    form.querySelectorAll("[required]").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field && field.classList.contains("invalid")) {
          var valid = input.value.trim() !== "";
          if (input.type === "email") valid = valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
          field.classList.toggle("invalid", !valid);
        }
      });
    });
  });
})();
