(function(){
  'use strict';

  /* ==========================================================================
     CANVAS ASPECT COVER HELPER
     ========================================================================== */
  function drawCoverImage(ctx, canvas, img) {
    if (!ctx || !canvas || !img || !img.complete || img.naturalWidth === 0) return;

    var canvasWidth = canvas.clientWidth;
    var canvasHeight = canvas.clientHeight;

    var dpr = window.devicePixelRatio || 1;
    if (canvas.width !== canvasWidth * dpr || canvas.height !== canvasHeight * dpr) {
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      ctx.scale(dpr, dpr);
    }

    var imgWidth = img.naturalWidth;
    var imgHeight = img.naturalHeight;
    var imgRatio = imgWidth / imgHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    var renderW, renderH, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      renderW = canvasWidth;
      renderH = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - renderH) / 2;
    } else {
      renderW = canvasHeight * imgRatio;
      renderH = canvasHeight;
      offsetX = (canvasWidth - renderW) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  }

  /* ==========================================================================
     1. SECTION 1: HERO SCROLL SCRUBBING (moyora01_frame - 200 FRAMES)
     ========================================================================== */
  var TOTAL_FRAMES_S1 = 200;
  var S1_DIR = 'img/moyora01_frame/ezgif-464c9beaabe2efb9-jpg/';
  var imagesS1 = [];
  var imagesLoadedS1 = 0;
  var currentFrameS1 = 1;

  var heroSection = document.getElementById('hero');
  var canvasS1 = document.getElementById('hero-canvas');
  var ctxS1 = canvasS1 ? canvasS1.getContext('2d') : null;

  function preloadImagesS1() {
    for (var i = 1; i <= TOTAL_FRAMES_S1; i++) {
      var img = new Image();
      var padded = String(i).padStart(3, '0');
      img.src = S1_DIR + 'ezgif-frame-' + padded + '.jpg';
      img.onload = function() {
        imagesLoadedS1++;
        if (imagesLoadedS1 === 1 && currentFrameS1 === 1) {
          drawCoverImage(ctxS1, canvasS1, imagesS1[0]);
        }
      };
      imagesS1.push(img);
    }
  }

  function updateSection1Scrub() {
    if (!heroSection || !canvasS1 || !ctxS1) return;

    var rect = heroSection.getBoundingClientRect();
    var scrollable = rect.height - window.innerHeight;
    if (scrollable <= 0) return;

    var progress = Math.min(1, Math.max(0, -rect.top / scrollable));
    var frame = Math.min(TOTAL_FRAMES_S1, Math.max(1, Math.floor(progress * (TOTAL_FRAMES_S1 - 1)) + 1));

    if (frame !== currentFrameS1 || imagesLoadedS1 === 1) {
      currentFrameS1 = frame;
      drawCoverImage(ctxS1, canvasS1, imagesS1[currentFrameS1 - 1]);
    }
  }

  /* ==========================================================================
     2. SECTION 2: WHY MOYERA SCROLL SCRUBBING (moyora02_frame - 200 FRAMES)
     ========================================================================== */
  var TOTAL_FRAMES_S2 = 200;
  var S2_DIR = 'img/moyora02_frame/ezgif-4c195db82974b285-jpg/';
  var imagesS2 = [];
  var imagesLoadedS2 = 0;
  var currentFrameS2 = 1;

  var whySection = document.getElementById('why');
  var canvasS2 = document.getElementById('why-canvas');
  var ctxS2 = canvasS2 ? canvasS2.getContext('2d') : null;
  var whyContentBox = document.getElementById('why-content-box');

  function preloadImagesS2() {
    for (var i = 1; i <= TOTAL_FRAMES_S2; i++) {
      var img = new Image();
      var padded = String(i).padStart(3, '0');
      img.src = S2_DIR + 'ezgif-frame-' + padded + '.jpg';
      img.onload = function() {
        imagesLoadedS2++;
        if (imagesLoadedS2 === 1 && currentFrameS2 === 1) {
          drawCoverImage(ctxS2, canvasS2, imagesS2[0]);
        }
      };
      imagesS2.push(img);
    }
  }

  function updateSection2Scrub() {
    if (!whySection || !canvasS2 || !ctxS2) return;

    var rect = whySection.getBoundingClientRect();
    var scrollable = rect.height - window.innerHeight;
    if (scrollable <= 0) return;

    var progress = Math.min(1, Math.max(0, -rect.top / scrollable));
    var frame = Math.min(TOTAL_FRAMES_S2, Math.max(1, Math.floor(progress * (TOTAL_FRAMES_S2 - 1)) + 1));

    if (frame !== currentFrameS2 || imagesLoadedS2 === 1) {
      currentFrameS2 = frame;
      drawCoverImage(ctxS2, canvasS2, imagesS2[currentFrameS2 - 1]);
    }

    // Trigger Content Entrance Animation when video scrubbing reaches completion threshold (~70%)
    if (whyContentBox) {
      if (progress >= 0.70) {
        whyContentBox.classList.add('why-content-visible');
      } else {
        whyContentBox.classList.remove('why-content-visible');
      }
    }
  }

  /* ==========================================================================
     3. MASTER SCROLL & RESIZE LOOP (RAF)
     ========================================================================== */
  var isTicking = false;

  function onScroll() {
    if (!isTicking) {
      requestAnimationFrame(function() {
        updateSection1Scrub();
        updateSection2Scrub();
        isTicking = false;
      });
      isTicking = true;
    }
  }

  function onResize() {
    requestAnimationFrame(function() {
      drawCoverImage(ctxS1, canvasS1, imagesS1[currentFrameS1 - 1]);
      drawCoverImage(ctxS2, canvasS2, imagesS2[currentFrameS2 - 1]);
    });
  }

  /* ==========================================================================
     4. EXISTING INTERACTION HANDLERS (SCROLL REVEAL, NAV, LIGHTBOX)
     ========================================================================== */

  /* Scroll reveal */
  var items = document.querySelectorAll('[data-reveal]');
  if(!('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    items.forEach(function(el){ io.observe(el); });
  }

  /* Mobile nav toggler */
  var mnav = document.getElementById('mnav');
  var toggle = document.querySelector('.menu-toggle');
  if(mnav && toggle){
    document.querySelectorAll('#mnav a').forEach(function(a){
      a.addEventListener('click', function(){
        mnav.classList.remove('open');
        mnav.style.display = 'none';
      });
    });
  }

  /* Screenshot Lightbox modal */
  var lightbox = document.getElementById('lightbox');
  if(lightbox){
    var lbImg = lightbox.querySelector('img');
    var lbCaption = lightbox.querySelector('figcaption');
    var lbClose = lightbox.querySelector('.lightbox-close');
    var lastFocused = null;

    function openLightbox(src, caption){
      lastFocused = document.activeElement;
      lbImg.src = src;
      lbImg.alt = caption || '모여라 앱 화면';
      lbCaption.textContent = caption || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      if(lbClose) lbClose.focus();
    }
    function closeLightbox(){
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lbImg.src = '';
      if(lastFocused){ lastFocused.focus(); }
    }

    document.querySelectorAll('[data-lightbox]').forEach(function(el){
      el.addEventListener('click', function(){
        openLightbox(el.getAttribute('data-lightbox'), el.getAttribute('data-caption'));
      });
      el.setAttribute('role','button');
      el.setAttribute('tabindex','0');
      el.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          openLightbox(el.getAttribute('data-lightbox'), el.getAttribute('data-caption'));
        }
      });
    });

    if(lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e){
      if(e.target === lightbox){ closeLightbox(); }
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && lightbox.classList.contains('open')){ closeLightbox(); }
    });
  }

  /* Initialize Both Video Scrubbing Modules */
  preloadImagesS1();
  preloadImagesS2();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

})();
