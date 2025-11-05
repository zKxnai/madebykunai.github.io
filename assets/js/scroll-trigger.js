let scrollPhase = 0;
let iphoneElement = null;
let screenBrightness = 0;
let scrollLockProgress = 0;
let iphoneRect = null;

function initScrollTrigger() {
  iphoneElement = document.querySelector('.iphone-container');
  document.addEventListener('wheel', handleScroll, { passive: false });
  document.addEventListener('scroll', handleScrollCheck);
  window.addEventListener('resize', updateIphonePosition);
  updateIphonePosition();
}

function updateIphonePosition() {
  if (iphoneElement) {
    iphoneRect = iphoneElement.getBoundingClientRect();
  }
}

function handleScroll(e) {
  const viewportCenter = window.innerHeight / 2;
  const iphoneCenter = iphoneRect.top + (iphoneRect.height / 2);
  const distanceFromCenter = Math.abs(iphoneCenter - viewportCenter);
  const maxDistance = window.innerHeight / 2 + iphoneRect.height / 2;
  const proximityRatio = 1 - (distanceFromCenter / maxDistance);

  // PHASE 1: Lock scroll when iPhone centers
  if (proximityRatio > 0.3 && scrollPhase === 0) {
    scrollPhase = 1;
    e.preventDefault();
  }

  // While locked, track brightness
  if (scrollPhase === 1) {
    e.preventDefault();
    const wheelDelta = e.deltaY || e.detail || 0;
    scrollLockProgress += (wheelDelta / 1000);
    scrollLockProgress = Math.max(0, Math.min(1, scrollLockProgress));
    screenBrightness = scrollLockProgress;
    updateIphoneVisuals(screenBrightness);

    if (scrollLockProgress >= 1) {
      scrollPhase = 2;
    }
  } else if (scrollPhase === 2) {
    const zoomProgress = (e.deltaY || e.detail || 0) / 500;
    applyZoomEffect(zoomProgress);
  }
}

function handleScrollCheck() {
  updateIphonePosition();
}

function updateIphoneVisuals(brightness) {
  const screen = document.querySelector('.iphone-screen');
  const glow = document.querySelector('.iphone-glow');

  if (screen) {
    screen.style.opacity = 0.3 + (brightness * 0.7);
    screen.style.filter = `brightness(${0.5 + (brightness * 1.5)})`;
  }

  if (glow) {
    glow.style.opacity = brightness * 0.8;
    const scale = 1 + (brightness * 0.5);
    glow.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  const screenContent = document.querySelector('.screen-content');
  if (screenContent) {
    const hue = 180 - (brightness * 80);
    screenContent.style.color = `hsl(${hue}, 100%, ${50 + brightness * 30}%)`;
  }
}

function applyZoomEffect(progress) {
  const iphone = document.querySelector('.iphone');
  if (iphone) {
    const scale = 1 + (progress * 2);
    const translateY = -window.innerHeight * (progress * 0.5);
    iphone.style.transform = `scale(${scale}) translateY(${translateY}px)`;
  }

  const appsSection = document.querySelector('.apps-section');
  if (appsSection && progress > 0.3) {
    appsSection.style.opacity = (progress - 0.3) * 2;
  }
}

document.addEventListener('DOMContentLoaded', initScrollTrigger);
