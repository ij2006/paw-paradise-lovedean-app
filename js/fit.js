// ─────────────────────────────────────────────
//  Fit the app to the phone's screen.
//
//  iPhone home screen apps sometimes start with the wrong screen edges
//  (iOS reports no notch / home bar for a while, then corrects itself).
//  That made the top look blurry under the clock and the tab bar sit too high
//  until the phone caught up. This file:
//   1. nudges iOS to work the edges out again straight away,
//   2. if iOS still reports no notch while the app fills the screen, uses the
//      known notch height for that size of iPhone,
//   3. keeps the app exactly the height of the screen.
//  It re-checks when the phone rotates, unfolds (iPhone Duo) or reopens the app.
// ─────────────────────────────────────────────
(function () {
  var h = document.documentElement;
  var isIPhone = /iPhone|iPod/.test(navigator.userAgent);
  var probe;

  function measure() {
    if (!probe) {
      probe = document.createElement('div');
      probe.setAttribute('aria-hidden', 'true');
      probe.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;' +
        'padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);' +
        'padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)';
      document.body.appendChild(probe);
    }
    var cs = getComputedStyle(probe);
    return {
      top: parseFloat(cs.paddingTop) || 0, bottom: parseFloat(cs.paddingBottom) || 0,
      left: parseFloat(cs.paddingLeft) || 0, right: parseFloat(cs.paddingRight) || 0
    };
  }

  // Notch / Dynamic Island height for each iPhone screen height (portrait, in points)
  function notchFor(height) {
    if (height >= 956) return 62;  // 16 Pro Max, 17 Pro Max
    if (height >= 932) return 59;  // 14 Pro Max, 15 Plus / Pro Max, 16 Plus
    if (height >= 926) return 47;  // 12 / 13 Pro Max, 14 Plus
    if (height >= 912) return 62;  // iPhone Air
    if (height >= 896) return 48;  // XR, 11, XS Max, 11 Pro Max
    if (height >= 874) return 62;  // 16 Pro, 17, 17 Pro
    if (height >= 852) return 59;  // 14 Pro, 15, 15 Pro, 16
    if (height >= 844) return 47;  // 12, 13, 14
    if (height >= 812) return 50;  // X, XS, 11 Pro, 12 mini, 13 mini
    return 20;                     // iPhones with a home button
  }

  function fit() {
    if (!document.body) return;
    var m = measure();
    var vw = window.innerWidth, vh = window.innerHeight;
    var portrait = vh >= vw;
    var sw = portrait ? Math.min(screen.width, screen.height) : Math.max(screen.width, screen.height);
    var sh = portrait ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
    var topFb = 0, bottomFb = 0;
    var installed = h.classList.contains('is-installed');

    // Only for screen sizes of known iPhones (not iPhone Duo or anything new, which report their edges properly)
    var knownWidth = [320, 375, 390, 393, 402, 414, 420, 428, 430, 440].indexOf(sw) !== -1;
    var stretch = false;
    if (installed && isIPhone && portrait && knownWidth && Math.abs(vw - sw) < 2) {
      // iOS sometimes says "no notch" even though the app reaches the top: use the real notch height
      if (m.top < 1 && (vh >= sh - 1 || sh - vh <= 140)) topFb = notchFor(sh);
      if (m.bottom < 1 && sh >= 812 && (vh >= sh - 1 || sh - vh <= 140)) bottomFb = 21;
      // iOS sometimes makes the app shorter than the screen (by about the notch height)
      // while still drawing it from the very top: stretch it to the full screen,
      // so the tab bar sits at the bottom.
      stretch = vh < sh - 1 && sh - vh <= 140;
    }
    h.classList.toggle('fit-stretch', stretch);
    h.style.setProperty('--screen-h', sh + 'px');
    h.style.setProperty('--safe-top-fb', topFb + 'px');
    h.style.setProperty('--safe-bottom-fb', bottomFb + 'px');
    h.style.setProperty('--app-h', vh + 'px');

    window.PPFit = { insets: m, fallbackTop: topFb, fallbackBottom: bottomFb, stretched: stretch, viewport: vw + ' × ' + vh, screen: sw + ' × ' + sh };
  }

  // Asking iOS to re-read the page's viewport makes it work out the screen edges again
  function nudge() {
    var meta = document.querySelector('meta[name=viewport]');
    if (!meta || !isIPhone) return;
    var c = meta.getAttribute('content');
    meta.setAttribute('content', c + ', maximum-scale=1');
    setTimeout(function () { meta.setAttribute('content', c); fit(); }, 30);
  }

  function refit() { fit(); setTimeout(fit, 120); setTimeout(fit, 500); }

  document.addEventListener('DOMContentLoaded', function () {
    fit(); nudge();
    // iOS can take a moment to report the right edges after launch
    [150, 400, 900, 1600, 3000].forEach(function (t) { setTimeout(fit, t); });
  });
  window.addEventListener('load', refit);
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', refit);
  window.addEventListener('pageshow', function () { nudge(); refit(); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { nudge(); refit(); } });
  if (window.visualViewport) visualViewport.addEventListener('resize', fit);
})();
