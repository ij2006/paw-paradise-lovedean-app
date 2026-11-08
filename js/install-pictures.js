// ─────────────────────────────────────────────
//  Picture guides for adding the app on iPhone.
//  Simple drawings of Safari's buttons, with the one to tap circled.
//  Current iPhones (Safari 26+): ••• > Share > Add to Home Screen > Add.
//  Older iPhones: Share > Add to Home Screen > Add.
// ─────────────────────────────────────────────
var PPPics = (function () {
  var FONT = "font-family=\"-apple-system, system-ui, sans-serif\"";
  var RING = '#D9922E';

  function frame(inner, h) {
    h = h || 150;
    return '<svg class="pic" viewBox="0 0 320 ' + h + '" role="img" aria-hidden="true" ' + FONT + '>' +
      '<rect x="1" y="1" width="318" height="' + (h - 2) + '" rx="18" fill="#F2F2F7" stroke="#D8D8DE"/>' + inner + '</svg>';
  }
  function ring(cx, cy, r) {
    return '<circle class="pic-ring" cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + RING + '" stroke-width="3.5"/>' +
      '<circle class="pic-pulse" cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + RING + '" stroke-width="2"/>';
  }
  function ringRect(x, y, w, h) {
    return '<rect class="pic-ring" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" fill="none" stroke="' + RING + '" stroke-width="3.5"/>';
  }
  var SHARE = function (x, y, s, c) { // square with an arrow
    s = s || 1; c = c || '#0A84FF';
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="none" stroke="' + c + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M0 -9v11M-4 -5l4 -4 4 4M-7 -1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1 -1v-9"/></g>';
  };
  var PLUS_BOX = function (x, y) {
    return '<g transform="translate(' + x + ' ' + y + ')" fill="none" stroke="#1C1C1E" stroke-width="1.8" stroke-linecap="round">' +
      '<rect x="-8" y="-8" width="16" height="16" rx="4"/><path d="M0 -4v8M-4 0h8"/></g>';
  };

  // 1 (new Safari): the ••• button beside the address bar at the bottom
  function moreButton() {
    return frame(
      '<text x="160" y="34" text-anchor="middle" font-size="12" fill="#8E8E93">Bottom of the screen in Safari</text>' +
      '<rect x="18" y="62" width="284" height="56" rx="28" fill="#fff" stroke="#E0E0E6"/>' +
      '<circle cx="48" cy="90" r="18" fill="#F2F2F7"/><path d="M52 82l-8 8 8 8" fill="none" stroke="#1C1C1E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<rect x="76" y="76" width="168" height="28" rx="14" fill="#F2F2F7"/>' +
      '<text x="160" y="95" text-anchor="middle" font-size="12.5" fill="#1C1C1E">paw-paradise…pages.dev</text>' +
      '<circle cx="272" cy="90" r="18" fill="#F2F2F7"/>' +
      '<g fill="#1C1C1E"><circle cx="264" cy="90" r="2.4"/><circle cx="272" cy="90" r="2.4"/><circle cx="280" cy="90" r="2.4"/></g>' +
      ring(272, 90, 24));
  }

  // 2 (new Safari): the menu, with Share circled
  function menuShare() {
    return frame(
      '<rect x="70" y="14" width="200" height="122" rx="16" fill="#fff" stroke="#E0E0E6"/>' +
      '<text x="88" y="45" font-size="14" fill="#1C1C1E">Share</text>' + SHARE(248, 41, 0.95, '#1C1C1E') +
      '<line x1="88" y1="60" x2="252" y2="60" stroke="#E5E5EA"/>' +
      '<text x="88" y="85" font-size="14" fill="#8E8E93">Add to Bookmarks</text>' +
      '<line x1="88" y1="100" x2="252" y2="100" stroke="#E5E5EA"/>' +
      '<text x="88" y="124" font-size="14" fill="#8E8E93">New Tab</text>' +
      ringRect(76, 20, 188, 36));
  }

  // 1 (older Safari): the toolbar, with Share circled
  function oldToolbar() {
    return frame(
      '<text x="160" y="34" text-anchor="middle" font-size="12" fill="#8E8E93">Bottom of the screen in Safari</text>' +
      '<rect x="18" y="62" width="284" height="56" rx="14" fill="#fff" stroke="#E0E0E6"/>' +
      '<g fill="none" stroke="#0A84FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M50 82l-8 8 8 8"/><path d="M96 82l8 8-8 8" stroke="#C7C7CC"/>' +
        '<path d="M200 82c-6-3-14-3-18 0v16c4-3 12-3 18 0 6-3 14-3 18 0V82c-4-3-12-3-18 0zM200 82v16"/>' +
        '<rect x="246" y="82" width="14" height="14" rx="3"/><path d="M251 79h10a3 3 0 0 1 3 3v10"/></g>' +
      SHARE(150, 92, 1.1) +
      ring(150, 90, 20));
  }

  // 3: the share sheet, with Add to Home Screen circled
  function shareSheet() {
    return frame(
      '<rect x="14" y="14" width="292" height="122" rx="14" fill="#fff" stroke="#E0E0E6"/>' +
      '<text x="30" y="44" font-size="14" fill="#8E8E93">Copy</text>' +
      '<line x1="30" y1="58" x2="290" y2="58" stroke="#E5E5EA"/>' +
      '<text x="30" y="83" font-size="14" fill="#8E8E93">Add to Reading List</text>' +
      '<line x1="30" y1="97" x2="290" y2="97" stroke="#E5E5EA"/>' +
      '<text x="30" y="122" font-size="14" font-weight="600" fill="#1C1C1E">Add to Home Screen</text>' + PLUS_BOX(282, 117) +
      ringRect(20, 101, 280, 31));
  }

  // 4: the confirm screen, with Add circled
  function addDialog(withToggle) {
    var h = withToggle ? 170 : 140;
    return frame(
      '<text x="26" y="34" font-size="14" fill="#0A84FF">Cancel</text>' +
      '<text x="160" y="34" text-anchor="middle" font-size="13" font-weight="600" fill="#1C1C1E">Add to Home Screen</text>' +
      '<text x="292" y="34" text-anchor="end" font-size="14" font-weight="700" fill="#0A84FF">Add</text>' +
      ringRectXY(258, 16, 42, 26) +
      '<rect x="14" y="52" width="292" height="62" rx="12" fill="#fff" stroke="#E0E0E6"/>' +
      '<defs><clipPath id="pp-icon-clip"><rect x="26" y="61" width="44" height="44" rx="10"/></clipPath></defs>' +
      '<image href="images/icons/apple-touch-icon.png" x="26" y="61" width="44" height="44" preserveAspectRatio="xMidYMid slice" clip-path="url(#pp-icon-clip)"/>' +
      '<text x="84" y="80" font-size="14" fill="#1C1C1E">Paw Paradise</text>' +
      '<text x="84" y="99" font-size="11" fill="#8E8E93">paw-paradise…pages.dev</text>' +
      (withToggle
        ? '<rect x="14" y="122" width="292" height="38" rx="12" fill="#fff" stroke="#E0E0E6"/>' +
          '<text x="28" y="146" font-size="13.5" fill="#1C1C1E">Open as Web App</text>' +
          '<rect x="252" y="129" width="42" height="24" rx="12" fill="#34C759"/><circle cx="282" cy="141" r="10" fill="#fff"/>'
        : ''), h);
  }
  function ringRectXY(x, y, w, h) {
    return '<rect class="pic-ring" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="none" stroke="' + RING + '" stroke-width="3.5"/>';
  }

  return { moreButton: moreButton, menuShare: menuShare, oldToolbar: oldToolbar, shareSheet: shareSheet, addDialog: addDialog };
})();
