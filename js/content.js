// ─────────────────────────────────────────────
//  Screen content. Edit the words here to change what the app shows.
//  Links: "#/screen" opens a screen; data-sheet="privacy|terms|a11y|install"
//  opens a pop-up.
// ─────────────────────────────────────────────
(function () {
  var C = PP_CONFIG;
  var ICONS = {"instagram": "<path d=\"M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.265.069 1.645.069 4.851s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.265.058-1.645.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038C23.986 15.668 24 15.259 24 12s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z\"/>", "facebook": "<path d=\"M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z\"/>", "tiktok": "<path d=\"M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z\"/>"};

  // Simple line icons (no emojis)
  var G = {
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.5v.6"/><circle cx="12" cy="16.6" r=".9" fill="currentColor" stroke="none"/>',
    news: '<rect x="4" y="5" width="16" height="14" rx="2.5"/><path d="M8 9.5h8M8 12.5h8M8 15.5h5"/>',
    mail: '<rect x="3.5" y="6" width="17" height="12" rx="2.5"/><path d="M4.5 7.5l7.5 6 7.5-6"/>',
    appearance: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/>',
    a11y: '<circle cx="12" cy="5.5" r="1.8" fill="currentColor" stroke="none"/><path d="M5.5 9l6.5 1.5L18.5 9M12 10.5V15M12 15l-3 5M12 15l3 5"/>',
    lock: '<rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
    doc: '<path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7.5 3.5z"/><path d="M14 3.5V8h4M9 12h6M9 15.5h6"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l2.5 2.5M14 9l2 2"/>',
    addphone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M12 8.5v6M9 11.5h6"/>',
    camera: '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.5-2h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.5"/>',
    call: '<path d="M7.5 4h-2A1.5 1.5 0 0 0 4 5.6C4.5 13 11 19.5 18.4 20a1.5 1.5 0 0 0 1.6-1.5v-2.2l-3.8-1.6-2 2a12 12 0 0 1-5-5l2-2L9.6 6z"/>',
    pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
    calendar: '<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    paw: '<circle cx="7" cy="10" r="1.8"/><circle cx="10.5" cy="6.5" r="1.8"/><circle cx="14.5" cy="6.5" r="1.8"/><circle cx="18" cy="10" r="1.8"/><path d="M12 11.5c-3 0-5.5 4-5.5 6a2.5 2.5 0 0 0 3 2.3c1.6-.4 3.4-.4 5 0a2.5 2.5 0 0 0 3-2.3c0-2-2.5-6-5.5-6z"/>',
    pound: '<path d="M16 6.5A3.5 3.5 0 0 0 9.5 8.3V19M7 12.5h7M7 19h10"/>',
    rules: '<path d="M12 3.5l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9v-5z"/><path d="M9 12l2 2 4-4"/>',
    heart: '<path d="M12 19.5s-7-4.3-7-9.3A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.2c0 5-7 9.3-7 9.3z"/>',
    glass: '<rect x="4" y="4" width="16" height="16" rx="5"/><path d="M8 15.5l7.5-7.5M8 11l3-3" opacity=".9"/>',
    car: '<path d="M5 15.5V12l1.8-4.5h10.4L19 12v3.5M5 15.5h14M5 15.5V18M19 15.5V18"/><circle cx="8" cy="15.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="16" cy="15.5" r="1.3" fill="currentColor" stroke="none"/>'
  };
  function svg(name) {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + G[name] + '</svg>';
  }
  function icon(name, tone) {
    return '<span class="cell-icon cell-icon--' + (tone || 'grey') + '" aria-hidden="true">' + svg(name) + '</span>';
  }
  function brandIcon(name) {
    if (name === 'linkedin') return '<span class="cell-icon cell-icon--li" aria-hidden="true"><span class="li-mark">in</span></span>';
    var cls = { instagram: 'ig', facebook: 'fb', tiktok: 'tt' }[name];
    return '<span class="cell-icon cell-icon--' + cls + '" aria-hidden="true"><svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">' + ICONS[name] + '</svg></span>';
  }
  function chevron() {
    return '<svg class="cell-chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function external() {
    return '<svg class="cell-chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  // A tappable row in a grouped list
  function cell(o) {
    var tag = o.href ? 'a' : 'button';
    var attrs = o.href ? ' href="' + o.href + '"' + (o.external ? ' target="_blank" rel="noopener"' : '') : ' type="button"' + (o.attrs ? ' ' + o.attrs : '');
    return '<' + tag + ' class="cell"' + attrs + (o.extra ? ' ' + o.extra : '') + '>' +
      (o.icon || '') +
      '<span class="cell-main"><span class="cell-title">' + o.title + '</span>' + (o.sub ? '<span class="cell-sub">' + o.sub + '</span>' : '') + '</span>' +
      (o.value ? '<span class="cell-value">' + o.value + '</span>' : '') +
      (o.external ? external() : chevron()) +
    '</' + tag + '>';
  }
  // A plain information row (not tappable)
  function info(title, value, o) {
    o = o || {};
    return '<div class="cell cell--static"' + (o.extra ? ' ' + o.extra : '') + '>' + (o.icon || '') +
      '<span class="cell-main"><span class="cell-title">' + title + '</span>' + (o.sub ? '<span class="cell-sub">' + o.sub + '</span>' : '') + '</span>' +
      (value ? '<span class="cell-value"' + (o.valueId ? ' id="' + o.valueId + '"' : '') + '>' + value + '</span>' : '') + '</div>';
  }
  function group(title, rows, foot) {
    return (title ? '<h2 class="group-title">' + title + '</h2>' : '') +
      '<div class="group">' + rows.join('') + '</div>' +
      (foot ? '<p class="group-foot">' + foot + '</p>' : '');
  }
  function faq(q, a) {
    return '<details class="faq"><summary><span>' + q + '</span><span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-a">' + a + '</div></details>';
  }
  function w3wLink() { return 'https://what3words.com/' + C.what3words; }
  function w3wTitle() { return '<span class="w3w-slashes" aria-hidden="true">///</span>' + C.what3words + '<span class="sr-only"> on what3words</span>'; }

  var FAQ_ICONS = { planning: ['calendar', 'green'], arrival: ['car', 'blue'], rules: ['rules', 'amber'], health: ['heart', 'red'], bookings: ['pound', 'grey'] };

  window.PPC = {
    group: group, cell: cell, icon: icon, row: info,

    // ── HOME ─────────────────────────────────
    home: function () {
      return '' +
      '<header class="home-head">' +
        '<img src="images/logo.png" alt="" width="48" height="48" />' +
        '<h1 class="large-title home-title">Paw Paradise</h1>' +
      '</header>' +
      '<figure class="hero">' +
        '<img src="images/hero.jpg" alt="Aerial view of the Paw Paradise dog field surrounded by woodland" width="1200" height="640" />' +
        '<figcaption><strong>Secure, private dog field</strong><span>Lovedean · South Downs National Park</span></figcaption>' +
      '</figure>' +
      '<div class="group home-status">' +
        info('Opening ' + C.openingDateShort, '', { icon: icon('calendar', 'green'), sub: 'Bookings are open now', extra: 'data-opening' }) +
        '<div class="cell cell--static" data-after-opening>' + icon('clock', 'green') +
          '<span class="cell-main"><span class="cell-title">Open today <span id="today-hours"></span></span><span class="cell-sub">Every day, including bank holidays</span></span></div>' +
      '</div>' +
      '<div class="home-book"><a class="btn btn-primary btn-block" href="#/book">Book a session</a></div>' +
      group('Sessions', [
        info('Session length', '50 minutes'),
        info('1–4 dogs', '£12'),
        info('5–8 dogs', '£15'),
        cell({ href: '#/offers', title: 'Block bookings &amp; gift certificates' })
      ]) +
      group('Opening hours', [
        info('April – October', '7am – 9pm', { sub: 'Monday to Saturday' }),
        info('April – October', '8am – 9pm', { sub: 'Sundays &amp; bank holidays' }),
        info('November – March', '8am – 9pm', { sub: 'Every day' })
      ]) +
      '<div class="section-head"><h2 class="group-title">Take a look</h2><a class="see-all" href="#/gallery">See all</a></div>' +
      '<div class="photo-strip" id="home-strip"></div>' +
      '<div id="home-news"></div>' +
      group('Find us', [
        cell({ href: w3wLink(), external: true, icon: icon('pin', 'green'), title: w3wTitle(), sub: 'Tagdell Lane, Lovedean' })
      ]) +
      group('', [
        cell({ href: '#/info', icon: icon('info', 'green'), title: 'Information &amp; FAQs' })
      ]);
    },

    // ── BLOCK BOOKINGS & GIFT CERTIFICATES ──
    offers: function () {
      var buy = function (label) {
        return '<div class="home-book"><a class="btn btn-primary btn-block" href="#/book">' + label + '</a></div>';
      };
      return '<h1 class="sr-only">Block bookings and gift certificates</h1>' +
        group('Block bookings', [
          info('10 sessions for the price of 9', '', { sub: 'No expiry. Book each session whenever suits you.' }),
          info('1–4 dogs', '£108'),
          info('5–8 dogs', '£135')
        ], 'You\'ll get a code to enter each time you book a session.') +
        buy('Buy a block booking') +
        group('Gift certificates', [
          info('Covers 2 sessions', '', { sub: 'Can be used any time within 12 months' }),
          info('1–4 dogs', '£24'),
          info('5–8 dogs', '£30')
        ], 'A lovely present for any dog owner.') +
        buy('Buy a gift certificate') +
        group('Refunds', [
          cell({ href: 'mailto:' + C.email + '?subject=Block%20booking%20or%20gift%20certificate%20refund', icon: icon('mail', 'green'), title: 'Email us about a refund', sub: C.email })
        ], 'You can cancel an unused block booking or gift certificate within 14 days of purchase for a full refund. After 14 days, or once a session from a block booking has been used, they can\'t be refunded.') +
        '<p class="group-foot">Both are bought on the Book tab: choose the block booking or gift certificate option on the booking page.</p>';
    },

    // ── GALLERY ──────────────────────────────
    galleryHead: '<h1 class="large-title">Gallery</h1>',
    galleryFoot: function () {
      return group('', [cell({ attrs: 'data-sheet="share-photos"', icon: icon('camera', 'green'), title: 'Send us your photos', sub: 'Up to 3 from your visit' })]);
    },

    // ── MORE ─────────────────────────────────
    more: function () {
      return '' +
      '<h1 class="large-title">More</h1>' +
      '<div class="group install-group" id="install-card">' +
        cell({ attrs: 'data-sheet="install"', icon: icon('addphone', 'amber'), title: 'Add app to your phone' }) +
      '</div>' +
      group('', [
        cell({ href: '#/info', icon: icon('info', 'green'), title: 'Information &amp; FAQs' }),
        cell({ href: '#/news', icon: icon('news', 'green'), title: 'News' }),
        cell({ href: '#/contact', icon: icon('mail', 'green'), title: 'Contact' })
      ]) +
      group('App settings', [
        '<div class="cell cell--static cell--wrap">' + icon('appearance', 'grey') + '<span class="cell-main"><span class="cell-title" id="theme-label">Appearance</span></span>' +
          '<div class="segmented" role="radiogroup" aria-labelledby="theme-label">' +
            '<button type="button" role="radio" data-theme-set="light">Light</button>' +
            '<button type="button" role="radio" data-theme-set="dark">Dark</button>' +
            '<button type="button" role="radio" data-theme-set="auto">Auto</button>' +
          '</div></div>',
        cell({ attrs: 'data-sheet="a11y"', icon: icon('a11y', 'blue'), title: 'Accessibility' })
      ]) +
      group('', [
        cell({ attrs: 'data-sheet="privacy"', icon: icon('lock', 'grey'), title: 'Privacy Policy' }),
        cell({ attrs: 'data-sheet="terms"', icon: icon('doc', 'grey'), title: 'Terms &amp; Conditions' })
      ]) +
      group('', [
        cell({ href: '#/staff', icon: icon('key', 'grey'), title: '<span id="staff-row-label">Staff login</span>' })
      ]) +
      '<p class="app-foot">Paw Paradise Lovedean · Version ' + C.version + '<br><a href="' + C.website + '" target="_blank" rel="noopener">pawparadiselovedean.co.uk</a></p>';
    },

    // FAQs grouped by subject. Each subject gets its own screen.
    faqGroups: function () {
      var groups = [];
      function g(title, items) { groups.push({ title: title, items: items.filter(Boolean) }); return ''; }
      var _ = '' +
      g('Planning your visit', [
        faq('When do you open?', '<p>We open on <strong>' + C.openingDate + '</strong>. Bookings are open now. The first sessions available are on the 16th. <a href="#/book">Book your session</a>.</p>').replace('<details class="faq"', '<details class="faq" data-opening'),
        faq('When are you open?', '<p>Sessions run within these hours:</p><ul><li><strong>April – October, Monday to Saturday:</strong> 7:00am – 9:00pm</li><li><strong>April – October, Sundays &amp; Bank Holidays:</strong> 8:00am – 9:00pm</li><li><strong>November – March, all days:</strong> 8:00am – 9:00pm</li></ul><p>Your last session must end by the closing time for that day.</p>'),
        faq('How long is each session?', '<p>Each session is 50 minutes, giving your dog plenty of time to explore, play, train and let off steam.</p>'),
        faq('Can we book a 25 or 30 minute session?', '<p>Not currently. Our planning permission requires sessions to be 50 minutes. We know shorter slots are popular and we\'d love to offer them in the future. Watch this space.</p>'),
        faq('How many dogs can I bring?', '<p>The maximum is 8 dogs per booking. There are two session sizes:</p><ul><li><strong>1-4 dogs</strong>: £12 per session</li><li><strong>5-8 dogs</strong>: £15 per session</li></ul>'),
        faq('Do you offer block bookings or gift certificates?', '<p>Yes. <strong>Block bookings:</strong> 10 sessions for the price of 9 (£108 for 1-4 dogs, £135 for 5-8 dogs), with no expiry date. <strong>Gift certificates</strong> cover 2 sessions (£24 for 1-4 dogs, £30 for 5-8 dogs) and can be used any time within 12 months. Both are on the <a href="#/book">Book</a> tab.</p>'),
        faq('Where are you located?', '<p>We\'re on Tagdell Lane, just off Lovedean Lane in Lovedean, Hampshire, within the South Downs National Park. The easiest way to find our exact entrance is what3words: <a class="w3w" href="' + w3wLink() + '" target="_blank" rel="noopener"><span class="w3w-slashes" aria-hidden="true">///</span>' + C.what3words + '</a></p><p>Nearest postcode: <strong>' + C.postcode + '</strong>. Postcodes aren\'t precise in the countryside, so please use what3words rather than the postcode for the gate.</p><p>Full directions, parking instructions and arrival guidance are sent with your booking confirmation.</p>'),
        faq('Is the field really secure?', '<p>Yes. Paw Paradise Lovedean is fully enclosed with 6-foot deer fencing around the entire perimeter and a double-gated entrance. We regularly check the fencing and gates to help keep even determined escape artists safely contained.</p>'),
        faq('What facilities are on site?', '<p>You\'ll find:</p><ul><li>Large, fully-enclosed countryside dog field</li><li>A field shelter for rainy days and quiet breaks</li><li>Fresh water and bowls for dogs</li><li>Seating for humans</li><li>Waste bins and poo bags</li></ul><p>We recommend bringing your own towels, toys and anything specific your dog needs.</p>'),
        faq('Are reactive or nervous dogs welcome?', '<p>Absolutely. Paw Paradise Lovedean is designed with reactive, nervous and rescue dogs in mind. Sessions are exclusive use, so you won\'t need to worry about other dogs entering the field during your slot.</p>')
      ]) +
      g('Arrival &amp; access', [
        faq('How do I access the paddock when I arrive?', '<p>You will receive a unique gate access code via email and text message prior to your slot. When you arrive, park on the hard-standing car park, open and safely secure the gate, drive in, and keep your dogs secured in your vehicle until the car park vehicle gate is fully closed and padlocked behind you.</p><p>The site is unstaffed and accessed via a coded keypad on the locked gate.</p>'),
        faq('What if someone is still in the field when I arrive?', '<p>Please remain outside in your vehicle on Tagdell Lane without blocking the track until the previous user has safely loaded their dogs, locked the gate, and completely exited. Never enter the car park area while another vehicle or dog is still inside.</p>'),
        faq('How many cars can I bring?', '<p>Each booking permits a maximum of 2 cars. All vehicles must park strictly within the designated hard-standing car park area. Parking on the entrance track or along the verges of Tagdell Lane is strictly prohibited.</p><p>If you\'re visiting with others, please car-share where possible.</p>'),
        faq('Is there lighting for evening or early morning bookings?', '<p>To comply with local South Downs planning regulations and preserve the natural surroundings, the field has no floodlighting. If you book during hours of darkness, please bring a torch and use a light-up collar or harness on your dog.</p>'),
        faq('Are there horses nearby?', '<p>Yes, horses are kept in the surrounding fields, though they do not graze immediately adjacent to the paddock fence line. You may also occasionally see horse riders walking past along the track during your session (typically no more than once during a slot, if at all). The field fencing is fully secure, but if your dog is reactive to horses or livestock, please keep this in mind and maintain extra supervision during your visit.</p>'),
        faq('What do I need to do at the end of my session?', '<p>Please:</p><ul><li>Leave promptly at the end of your 50-minute slot so the next visitor can start on time</li><li>Pick up after your dogs and use the bins provided</li><li>Take all toys, leads and belongings with you</li><li>Make sure the vehicle gate is fully closed and padlocked</li></ul>')
      ]) +
      g('Field rules &amp; safety', [
        faq('What is your policy on dog waste?', '<p>You are fully responsible for cleaning up after your dog(s) immediately. All waste must be securely bagged and placed in the designated bins provided on site. Leaving dog mess behind poses health risks and may result in booking privileges being revoked.</p>'),
        faq('What is your policy on digging?', '<p>To protect the field and prevent escape hazards, dogs are strictly prohibited from digging anywhere on the premises except inside our designated sandpit area. If your dog attempts to dig elsewhere, please redirect them immediately. Please report any boundary or fence holes to us on <a href="' + C.phoneLink + '">' + C.phone + '</a>.</p>'),
        faq('How can I help protect the wildflowers and trees?', '<p>We are actively working to enhance local wildlife and site ecology! You will notice areas around the field where grass has been removed. These sections have been sown with native wildflower seeds to establish vibrant wildflower borders. We have also recently planted 32 new trees across the site. To help these natural habitats thrive and keep the paddock beautiful for everyone, please monitor your dog(s) and ensure they do not dig in or disturb the newly planted trees and wildflower borders.</p>'),
        faq('Can people use the agility and play equipment?', '<p>No. All play, ramp, and agility equipment on site is strictly for canine use only. Humans are strictly prohibited from climbing, sitting, or playing on any apparatus. All equipment is used entirely at your dog\'s own risk.</p>'),
        faq('Is smoking allowed on site?', '<p>No. Paw Paradise is a strictly non-smoking facility to prevent litter, fire risks, and dangerous debris that dogs might ingest.</p>'),
        faq('What happens in wet or bad weather?', '<p>After periods of heavy or constant rain, the grass and equipment may be wet, slippery, and muddy. Please wear suitable footwear. In cases of extreme or unsafe weather conditions, we reserve the right to temporarily suspend or reschedule sessions for safety.</p>')
      ]) +
      g('Dog health &amp; breeds', [
        faq('Can I bring an XL Bully or a banned breed?', '<p>Yes, provided you strictly adhere to current UK legislation. Your dog must have a valid Certificate of Exemption, third-party public liability insurance, and be neutered and microchipped. The dog must remain muzzled and on a lead until securely locked inside the paddock. Unless specific multi-dog exemptions apply, these dogs can only be exercised solo by members of the same household.</p><p>If you have questions about your specific dog, please contact us before booking.</p>'),
        faq('What vaccinations do you require?', '<p>All visiting dogs must be up to date on vaccinations, worming, or have valid, up-to-date titer test results confirming immunity. Kennel cough vaccination is strongly recommended.</p><p>We welcome dogs of all ages. Dogs in season are welcome.</p>'),
        faq('What if my dog is unwell?', '<p>If your dog exhibits any signs of illness (such as coughing, vomiting, or diarrhoea), please do not bring them to the field. Reschedule your slot for when they are completely symptom-free.</p>')
      ]) +
      g('Bookings &amp; cancellations', [
        faq('What is your cancellation policy?', '<p>You can change or cancel your appointment directly through our online booking system up to 24 hours before your start time for a full refund or to reschedule. Because slots are booked for specific dates and times, cancellations made within 24 hours or no-shows are non-refundable.</p>'),
        faq('Can I get a refund on a block booking or gift certificate?', '<p>You can cancel an unused block booking or gift certificate within 14 days of purchase for a full refund by emailing <a href="mailto:' + C.email + '">' + C.email + '</a>. Once 14 days have passed, or once any session from a block booking has been redeemed, they become non-refundable.</p>'),
        faq('Can I bring more than the standard number of dogs?', '<p>We are currently running a high-capacity trial permitting bookings of up to 8 dogs. Please ensure your booking reflects the exact number of dogs and vehicles attending. High-capacity slots require handlers to strictly manage waste and behaviour to ensure the trial remains open.</p>'),
        faq('Can dog walkers or trainers book?', '<p>Yes! Commercial users are welcome, but you must hold valid commercial public liability insurance covering the full number and specific types of dogs under your care during the session.</p>')
      ]) +
      '';
      groups.forEach(function (gr, i) { gr.slug = ['planning', 'arrival', 'rules', 'health', 'bookings'][i]; });
      return groups;
    },

    // ── INFORMATION & FAQS: search or pick a subject ───
    info: function () {
      var groups = this.faqGroups();
      var DESC = {
        planning: 'Opening times, sessions, location and facilities',
        arrival: 'Gate codes, parking, lighting and leaving',
        rules: 'Dog waste, digging, equipment and weather',
        health: 'Vaccinations, breeds and unwell dogs',
        bookings: 'Cancellations, refunds, block bookings and gifts'
      };
      return '<h1 class="large-title">FAQs</h1>' +
        '<div class="search"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
          '<input type="search" id="faq-search" placeholder="Search questions" aria-label="Search questions" autocomplete="off" enterkeyhint="search" /></div>' +
        '<div id="faq-results" hidden></div>' +
        '<div id="faq-subjects">' +
          group('', groups.map(function (g) {
            var ic = FAQ_ICONS[g.slug] || ['info'];
            return cell({ href: '#/faq/' + g.slug, icon: icon(ic[0], 'green'), title: g.title, sub: DESC[g.slug] || '' });
          })) +
          group('', [cell({ href: '#/contact', icon: icon('mail', 'green'), title: 'Still have a question?', sub: 'Get in touch' })]) +
        '</div>';
    },
    faqSearch: function (query) {
      var q = query.trim().toLowerCase();
      if (!q) return null;
      var hits = [];
      this.faqGroups().forEach(function (g) {
        g.items.forEach(function (html) {
          var text = html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').toLowerCase();
          if (text.indexOf(q) !== -1) hits.push(html);
        });
      });
      return hits.length
        ? '<div class="group group--faq">' + hits.join('') + '</div><p class="group-foot">' + hits.length + ' matching question' + (hits.length === 1 ? '' : 's') + '</p>'
        : '<p class="empty">No questions match "' + query.replace(/[<>&"]/g, '') + '".</p>';
    },
    faqTitle: function (slug) {
      var g = this.faqGroups().filter(function (x) { return x.slug === slug; })[0];
      return g ? g.title.replace(/&amp;/g, '&') : 'FAQs';
    },
    faqSubject: function (slug) {
      var g = this.faqGroups().filter(function (x) { return x.slug === slug; })[0];
      if (!g) return '<h1 class="sr-only">FAQs</h1><p class="empty">Subject not found.</p>';
      return '<h1 class="sr-only">' + g.title + '</h1><div class="group group--faq">' + g.items.join('') + '</div>' +
        '<p class="group-foot">Tap a question to see the answer.</p>';
    },

    // ── CONTACT ──────────────────────────────
    contact: function () {
      return '' +
      '<h1 class="sr-only">Contact</h1>' +
      group('', [
        cell({ href: 'mailto:' + C.email, icon: icon('mail', 'green'), title: 'Email us', sub: C.email })
      ], 'For any questions about visiting or booking. We\'ll reply as soon as we can.') +
      group('Emergencies only', [
        cell({ href: C.phoneLink, icon: icon('call', 'red'), title: 'Call ' + C.phone, sub: 'Problem at the field during your session' })
      ]) +
      group('Find us', [
        cell({ href: w3wLink(), external: true, icon: icon('pin', 'red'), title: w3wTitle(), sub: 'Tagdell Lane, Lovedean' })
      ]) +
      group('Follow us', [
        cell({ href: C.social.instagram, external: true, icon: brandIcon('instagram'), title: 'Instagram' }),
        cell({ href: C.social.facebook, external: true, icon: brandIcon('facebook'), title: 'Facebook' }),
        cell({ href: C.social.tiktok, external: true, icon: brandIcon('tiktok'), title: 'TikTok' }),
        cell({ href: C.social.linkedin, external: true, icon: brandIcon('linkedin'), title: 'LinkedIn' })
      ]);
    },

    // ── NEWS header ──────────────────────────
    newsHead: '<h1 class="sr-only">News</h1>'
  };
})();
