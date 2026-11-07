// ─────────────────────────────────────────────
//  Screen content. Text matches the website.
//  Edit the words here to change what the app shows.
//  Links: "#/screen" opens a screen, data-book="standard|large|all"
//  opens booking, data-sheet="privacy|terms|horses|a11y|install" opens a pop-up.
// ─────────────────────────────────────────────
(function () {
  var C = PP_CONFIG;
  var ICONS = {"instagram": "<path d=\"M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.265.069 1.645.069 4.851s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.265.058-1.645.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038C23.986 15.668 24 15.259 24 12s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z\"/>", "facebook": "<path d=\"M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z\"/>", "tiktok": "<path d=\"M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z\"/>"};

  function social(name, label) {
    return '<a class="social-btn social-btn--' + name + '" href="' + C.social[name] + '" target="_blank" rel="noopener" aria-label="' + label + '">' +
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">' + ICONS[name] + '</svg></a>';
  }
  function socialRow() {
    return '<div class="social-row">' + social('instagram', 'Instagram') + social('facebook', 'Facebook') + social('tiktok', 'TikTok') + '</div>';
  }
  function w3w(big) {
    return '<a class="w3w' + (big ? ' w3w--big' : '') + '" href="https://what3words.com/' + C.what3words + '" target="_blank" rel="noopener" aria-label="what3words: ' + C.what3words + ' (opens what3words)"><span class="w3w-slashes" aria-hidden="true">///</span>' + C.what3words + '</a>';
  }
  function faq(q, a) {
    return '<details class="faq"><summary><span>' + q + '</span><span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-a">' + a + '</div></details>';
  }
  function chevron() {
    return '<svg class="row-chevron" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function row(href, emoji, label, sub, attrs) {
    return '<a class="list-row" href="' + href + '"' + (attrs || '') + '><span class="row-icon" aria-hidden="true">' + emoji + '</span>' +
      '<span class="row-text"><span class="row-label">' + label + '</span>' + (sub ? '<span class="row-sub">' + sub + '</span>' : '') + '</span>' + chevron() + '</a>';
  }
  function btnRow(attrs, emoji, label, sub) {
    return '<button type="button" class="list-row" ' + attrs + '><span class="row-icon" aria-hidden="true">' + emoji + '</span>' +
      '<span class="row-text"><span class="row-label">' + label + '</span>' + (sub ? '<span class="row-sub">' + sub + '</span>' : '') + '</span>' + chevron() + '</button>';
  }
  function openingBanner() {
    if (!C.openingDate) return '';
    return '<a class="opening-banner" href="#/book" data-opening><span class="ob-tag">Opening</span><span><strong>' + C.openingDate + '</strong><br>Bookings are open now for sessions from the 16th</span>' + chevron() + '</a>';
  }

  var HOURS_HTML =
    '<p><strong>April – October:</strong> 7:00am – 9:00pm Monday to Saturday, 8:00am – 9:00pm Sundays and bank holidays.</p>' +
    '<p><strong>November – March:</strong> 8:00am – 9:00pm every day.</p>';

  window.PPC = {
    socialRow: socialRow,
    w3w: w3w,
    chevron: chevron,

    // ── HOME ─────────────────────────────────
    home: function () {
      return '' +
      openingBanner() +
      '<section class="hero">' +
        '<img class="hero-logo" src="images/logo.png" alt="Paw Paradise Lovedean logo" width="132" height="132" />' +
        '<p class="eyebrow">South Downs National Park, Hampshire</p>' +
        '<h1 class="hero-title">Paw Paradise Lovedean – secure, private dog paddock</h1>' +
        '<p class="hero-sub">A large, fully enclosed private dog field in the South Downs National Park, designed so all dogs can truly relax off-lead, whether they\'re reactive, rescue, sensitive, have selective recall, or just want some space to run around on their own or with their friends.</p>' +
        '<a class="btn btn-primary btn-block" href="#/book">Book now</a>' +
      '</section>' +

      '<div class="quick-grid">' +
        '<a class="quick" href="#/book"><span aria-hidden="true">📅</span>Book</a>' +
        '<a class="quick" href="#/info"><span aria-hidden="true">❓</span>FAQs</a>' +
        '<a class="quick" href="#/gallery"><span aria-hidden="true">📸</span>Gallery</a>' +
        '<a class="quick" href="#/contact"><span aria-hidden="true">✉️</span>Contact</a>' +
      '</div>' +

      '<section class="section">' +
        '<p class="eyebrow">Why choose us</p>' +
        '<h2>A secure, private dog field in Lovedean</h2>' +
        '<p>Every 50-minute session is exclusive use, so the whole field is yours: no other dogs, no surprises. Open seven days a week, all year round, on the edge of Lovedean in the South Downs National Park.</p>' +
        '<div class="h-scroll" role="list">' +
          '<a role="listitem" class="feature-card" href="#/book"><span class="feature-icon" aria-hidden="true">🔒</span><h3>Exclusive use</h3><p>Book the whole field for you and your dogs. No shared sessions and no unexpected dogs.</p></a>' +
          '<a role="listitem" class="feature-card" href="#/info"><span class="feature-icon" aria-hidden="true">🚧</span><h3>Fully enclosed</h3><p>6-foot deer fencing all the way round and a double-gated entrance, so even determined escape artists stay safely inside.</p></a>' +
          '<a role="listitem" class="feature-card" href="#/gallery"><span class="feature-icon" aria-hidden="true">🌿</span><h3>More than a flat field</h3><p>Trees, wildflowers, a sandpit and rustic obstacles made from our own resources, for zoomies, sniffing and recall practice.</p></a>' +
          '<a role="listitem" class="feature-card" href="#/gallery"><span class="feature-icon" aria-hidden="true">🛖</span><h3>Shelter and facilities</h3><p>A field shelter for showers and quiet breaks, with seating, fresh water and bowls, bins and poo bags on site.</p></a>' +
          '<a role="listitem" class="feature-card" href="#/book"><span class="feature-icon" aria-hidden="true">🕐</span><h3>Long opening hours</h3>' + HOURS_HTML + '</a>' +
          '<a role="listitem" class="feature-card" href="#/info"><span class="feature-icon" aria-hidden="true">🚗</span><h3>Parking by the field</h3><p>Off-road parking inside the gate, right next to the paddock, for up to two cars per booking.</p></a>' +
        '</div>' +
      '</section>' +

      '<section class="section section--tint">' +
        '<p class="eyebrow">Who it\'s for</p>' +
        '<h2>Somewhere every dog can relax off-lead</h2>' +
        '<p>Some dogs find busy parks too much. Others just need space to run. Paw Paradise Lovedean is for both.</p>' +
        '<ul class="tick-list">' +
          '<li>Reactive, nervous or rescue dogs who need space away from other dogs</li>' +
          '<li>Dogs with selective recall who can\'t be let off the lead elsewhere</li>' +
          '<li>High-energy dogs who need a safe place to sprint</li>' +
          '<li>Owners working on recall and training without distractions</li>' +
          '<li>Friends and families wanting a private space to enjoy time with their dogs</li>' +
        '</ul>' +
        '<p class="tagline">If you\'ve ever cut a walk short because a loose dog appeared from nowhere, this is for you.</p>' +
        '<div class="stat-row">' +
          '<a class="stat" href="#/book"><strong>50 min</strong><span>private sessions, from £12</span></a>' +
          '<a class="stat" href="#/book"><strong>Up to 8</strong><span>dogs per booking</span></a>' +
          '<a class="stat" href="#/info"><strong>7 days</strong><span>a week, including bank holidays</span></a>' +
        '</div>' +
        '<a class="btn btn-gold btn-block" href="#/book">Book a session</a>' +
      '</section>' +

      '<section class="section">' +
        '<div class="note-card"><span class="note-icon" aria-hidden="true">🐾</span><div>' +
          '<p class="eyebrow">Family business</p>' +
          '<h2>Built by dog owners, for dog owners</h2>' +
          '<p>We\'re a family business and we live right next to the field. We have dogs and horses of our own, and we care deeply about animal welfare.</p>' +
          '<p>We set out to create somewhere we\'d genuinely want to bring our own dogs, and we\'re committed to investing in the things that make a real difference: the features, the facilities and the little details that clients actually want to see and use.</p>' +
          '<a class="text-link" href="#/about">Meet the team</a>' +
        '</div></div>' +
      '</section>' +

      '<section class="section">' +
        '<p class="eyebrow">All breeds welcome</p>' +
        '<h2>Every dog deserves a paradise</h2>' +
        '<p>We welcome dogs of all breeds and sizes, including XL Bullies and dogs subject to the Dangerous Dogs Act, providing they are handled responsibly and in line with current legislation.</p>' +
        '<div class="chips">' +
          ['XL Bullies','BSL breeds','Puppies','Senior dogs','Small breeds','Giant breeds','Working dogs','Crossbreeds'].map(function (b) { return '<span class="chip">' + b + '</span>'; }).join('') +
        '</div>' +
        '<p>If you have any questions about bringing your dog, please <a href="#/contact">get in touch</a> before booking.</p>' +
      '</section>' +

      '<section class="section section--tint">' +
        '<p class="eyebrow">Simple process</p>' +
        '<h2>How it works</h2>' +
        '<ol class="steps">' +
          '<li><a href="#/book"><span class="step-num">1</span><span><strong>Pick your time</strong>Choose a 50-minute session at a time that suits you within our opening hours.</span></a></li>' +
          '<li><a href="#/book"><span class="step-num">2</span><span><strong>Book online</strong>Pay online and get instant confirmation with your gate code, directions and what3words.</span></a></li>' +
          '<li><a href="#/info"><span class="step-num">3</span><span><strong>Arrive and enjoy</strong>Drive into the parking area inside the gate, close and padlock it, then let your dog off-lead to explore.</span></a></li>' +
          '<li><a href="#/info"><span class="step-num">4</span><span><strong>Leave it as you found it</strong>Pick up after your dogs, take your belongings and make sure the gate is closed and padlocked for the next visitor.</span></a></li>' +
        '</ol>' +
      '</section>' +

      '<section class="section">' +
        '<p class="eyebrow">Common questions</p>' +
        '<h2>Everything you need to know</h2>' +
        '<div class="faq-list">' +
          faq('How many dogs can I bring?', '<p>Standard sessions are for 1-4 dogs. If you would like to bring 5-8, choose the large pack session when booking. The maximum is 8 dogs per booking.</p>') +
          faq('Are all breeds welcome?', '<p>Yes, all breeds are welcome, including XL Bullies and breeds listed under the Dangerous Dogs Act. Owners of listed breeds must comply with current legislation. If you have any questions about your dog, please <a href="#/contact">get in touch</a> before booking.</p>') +
          faq('Are puppies welcome?', '<p>Yes, we welcome dogs of all ages, as long as they are up to date with their vaccinations and worming, or have valid, up-to-date titer test results. Kennel cough vaccination is strongly recommended.</p>') +
          faq('Are dogs in season welcome?', '<p>Yes. Because every session is exclusive use with no other dogs on site, dogs in season are welcome without any issues.</p>') +
          faq('What are your opening hours?', '<p>We\'re open every day, including weekends and bank holidays. April to October: 7:00am – 9:00pm Monday to Saturday, and 8:00am – 9:00pm on Sundays and bank holidays. November to March: 8:00am – 9:00pm every day.</p>') +
        '</div>' +
        '<a class="btn btn-secondary btn-block" href="#/info">See all FAQs</a>' +
      '</section>' +

      '<section class="section section--forest">' +
        '<p class="eyebrow">Stay connected</p>' +
        '<h2>Follow us for field updates &amp; happy dogs</h2>' +
        '<p>We share field updates, dog photos and behind-the-scenes progress across our socials. Come and say hello.</p>' +
        socialRow() +
      '</section>' +

      '<section class="section">' +
        '<p class="eyebrow">Find us</p>' +
        '<h2>Lovedean, Hampshire</h2>' +
        '<p>We\'re on Tagdell Lane, just off Lovedean Lane. Find our exact entrance with what3words:</p>' +
        '<p class="center">' + w3w(true) + '</p>' +
        '<p class="small">Nearest postcode: <strong>' + C.postcode + '</strong>. Postcodes aren\'t precise out here, so please use what3words to find the gate.</p>' +
        '<p>We\'re within the South Downs National Park, in easy reach of Horndean, Clanfield, Cowplain, Waterlooville, Petersfield and Portsmouth. Full directions and parking instructions come with your booking confirmation.</p>' +
        '<a class="btn btn-primary btn-block" href="#/book">Book your session today</a>' +
      '</section>';
    },

    // ── BOOK ─────────────────────────────────
    book: function () {
      return '' +
      '<section class="section section--first">' +
        '<p class="eyebrow">Book online</p>' +
        '<h1 class="screen-h1">Booking &amp; sessions</h1>' +
        (C.openingDate ? '<p class="opening-pill" data-opening><span>Opening</span> Monday 16 November</p>' : '') +
        '<p>We keep things simple, flexible and fair. Choose your session, pick your time and you\'re good to go.</p>' +
        '<div class="banner-card"><span aria-hidden="true">⏱</span><div><h2>50-minute sessions</h2><p>A full 50 minutes of exclusive use for proper decompression walks, training and relaxed exploration across the whole field.</p></div></div>' +
      '</section>' +

      '<section class="section">' +
        '<p class="eyebrow">Pricing</p>' +
        '<h2>Dogs per booking &amp; pricing</h2>' +
        '<p>We offer two simple options:</p>' +
        '<div class="price-card">' +
          '<div class="price-head"><div><h3>Standard session</h3><p>1-4 dogs</p></div><p class="price">£12</p></div>' +
          '<p>50 minutes of exclusive use. Ideal for most households or small groups.</p>' +
          '<ul class="tick-list tick-list--compact"><li>Large dog field, yours alone</li><li>1-4 dogs</li><li>50 minutes</li><li>Off-road parking for up to 2 cars</li></ul>' +
          '<button type="button" class="btn btn-primary btn-block" data-book="standard">Book now</button>' +
        '</div>' +
        '<div class="price-card price-card--alt">' +
          '<div class="price-head"><div><h3>Large pack session</h3><p>5-8 dogs</p></div><p class="price">£15</p></div>' +
          '<p>Perfect if you have more dogs at home or are meeting with a trusted group.</p>' +
          '<ul class="tick-list tick-list--compact"><li>Large dog field, yours alone</li><li>5-8 dogs</li><li>50 minutes</li><li>Off-road parking for up to 2 cars</li></ul>' +
          '<button type="button" class="btn btn-primary btn-block" data-book="large">Book now</button>' +
        '</div>' +
        '<div class="banner-card banner-card--gold"><span aria-hidden="true">🎟</span><div><h3>Block bookings: 10 sessions for the price of 9</h3><p>£108 for 1-4 dogs, or £135 for 5-8 dogs. Book each session whenever suits you, with no expiry date. You\'ll get a code to enter each time you book.</p><button type="button" class="text-link" data-book="all">Buy a block booking</button></div></div>' +
      '</section>' +

      '<section class="section section--tint">' +
        '<div class="note-card"><span class="note-icon" aria-hidden="true">🎁</span><div>' +
          '<p class="eyebrow">Gift certificates</p>' +
          '<h2>Give a dog a field day</h2>' +
          '<p>A gift certificate covers 2 sessions: £24 for 1-4 dogs, or £30 for 5-8 dogs. The recipient can use them any time within 12 months.</p>' +
          '<button type="button" class="text-link" data-book="all">Buy a gift certificate</button>' +
        '</div></div>' +
      '</section>' +

      '<section class="section">' +
        '<p class="eyebrow">Before you arrive</p>' +
        '<h2>What to bring</h2>' +
        '<div class="mini-grid">' +
          '<a class="mini-card" href="#/info"><span aria-hidden="true">💧</span><h3>Water</h3><p>We provide fresh water and bowls on site, but feel free to bring your own if your dog is particular.</p></a>' +
          '<a class="mini-card" href="#/info"><span aria-hidden="true">🦺</span><h3>Long lead or training line</h3><p>Great for working on recall in a safe environment before going fully off-lead.</p></a>' +
          '<a class="mini-card" href="#/info"><span aria-hidden="true">🎾</span><h3>Toys &amp; treats</h3><p>Bring whatever motivates your dog. The field is yours, so make the most of it.</p></a>' +
          '<a class="mini-card" href="#/info"><span aria-hidden="true">👟</span><h3>Suitable footwear</h3><p>It\'s a countryside field, so wellies or walking boots are recommended in wet weather.</p></a>' +
        '</div>' +
      '</section>' +

      '<section class="section">' +
        '<div class="card">' +
          '<h3>Before you book: dog requirements</h3>' +
          '<ul class="tick-list tick-list--compact">' +
            '<li>We welcome dogs of all ages</li>' +
            '<li>All dogs must be up to date with vaccinations and worming, or have valid titer test results. Kennel cough vaccination is strongly recommended</li>' +
            '<li>Dogs in season are welcome</li>' +
            '<li>Dogs must be monitored by someone at all times</li>' +
            '<li>XL Bullies and other listed breeds are welcome. Please ensure you comply with current legislation</li>' +
            '<li>Maximum 8 dogs per booking</li>' +
          '</ul>' +
        '</div>' +
        '<div class="card">' +
          '<h3><span aria-hidden="true">🚗 </span>Cars &amp; parking</h3>' +
          '<p>To keep access safe and the lane clear:</p>' +
          '<ul class="tick-list tick-list--compact">' +
            '<li>A maximum of 2 cars is allowed for any booking</li>' +
            '<li>All cars must park inside the gate in the designated parking area</li>' +
            '<li>There is no parking outside on the lane or verge</li>' +
          '</ul>' +
          '<p>Please arrange to arrive in no more than two vehicles per session.</p>' +
        '</div>' +
      '</section>' +

      '<section class="section section--tint">' +
        '<p class="eyebrow">Opening hours</p>' +
        '<h2>When we\'re open</h2>' +
        '<p>Sessions can be booked within the following hours. Last session must end by closing time.</p>' +
        '<div class="hours-card"><span aria-hidden="true">☀️</span><div><h3>April – October</h3><p>Mon – Sat: 7:00am – 9:00pm</p><p>Sunday &amp; Bank Holidays: 8:00am – 9:00pm</p></div></div>' +
        '<div class="hours-card"><span aria-hidden="true">🍂</span><div><h3>November – March</h3><p>All days: 8:00am – 9:00pm</p></div></div>' +
      '</section>' +

      '<section class="section">' +
        '<div class="note-card"><span class="note-icon" aria-hidden="true">🐴</span><div>' +
          '<h3>A note about the surrounding land</h3>' +
          '<p>Paw Paradise sits alongside working countryside where horses are kept. Here\'s what to expect before you book.</p>' +
          '<button type="button" class="btn btn-secondary btn-sm" data-sheet="horses">Read more</button>' +
        '</div></div>' +
      '</section>' +

      '<section class="section section--forest">' +
        '<p class="eyebrow">Ready to book?</p>' +
        '<h2>Choose your session</h2>' +
        (C.openingDate ? '<p data-opening>We open on <strong>' + C.openingDate + '</strong>. You can book now. The first available sessions are on the 16th.</p>' : '') +
        '<button type="button" class="btn btn-light btn-block" data-book="standard">1-4 dogs · £12</button>' +
        '<button type="button" class="btn btn-light btn-block" data-book="large">5-8 dogs · £15</button>' +
        '<p class="center"><button type="button" class="text-link text-link--light" data-book="all">Block bookings and gift certificates</button></p>' +
        '<p class="small center">By booking a session you agree to our <button type="button" class="text-link text-link--light" data-sheet="terms">Terms &amp; Conditions</button>, including our 24-hour cancellation policy.</p>' +
      '</section>';
    },

    horses: '<p>Yes, horses are kept in the surrounding fields, though they do not graze immediately adjacent to the paddock fence line. You may also occasionally see horse riders walking past along the track during your session (typically no more than once during a slot, if at all). The field fencing is fully secure, but if your dog is reactive to horses or livestock, please keep this in mind and maintain extra supervision during your visit.</p>',

    // ── REVIEWS ──────────────────────────────
    reviews: function () {
      return '' +
      '<section class="section section--first">' +
        '<p class="eyebrow">What our visitors say</p>' +
        '<h1 class="screen-h1">Reviews</h1>' +
        '<p>Read what visitors say about Paw Paradise Lovedean, or leave a review of your own, on Google and Facebook.</p>' +
      '</section>' +
      '<section class="section">' +
        '<div class="card review-card">' +
          '<div class="review-head"><span class="review-logo review-logo--google" aria-hidden="true">G</span><h2>Google</h2></div>' +
          '<p>Read our Google reviews, or leave one after your visit. It only takes a minute and really helps a small business.</p>' +
          '<a class="btn btn-primary btn-block" href="' + C.reviews.googleRead + '" target="_blank" rel="noopener">Read Google reviews</a>' +
          '<a class="btn btn-secondary btn-block" href="' + C.reviews.googleWrite + '" target="_blank" rel="noopener">Leave a Google review</a>' +
        '</div>' +
        '<div class="card review-card">' +
          '<div class="review-head"><span class="review-logo review-logo--facebook" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">' + ICONS.facebook + '</svg></span><h2>Facebook</h2></div>' +
          '<p>See recommendations from our Facebook community, or recommend us yourself from the Reviews tab on our page.</p>' +
          '<a class="btn btn-primary btn-block" href="' + C.reviews.facebook + '" target="_blank" rel="noopener">Read Facebook reviews</a>' +
        '</div>' +
        '<p class="small center">Reviews open on Google and Facebook, so you always see them in full, exactly as visitors wrote them.</p>' +
      '</section>';
    },

    // ── MORE ─────────────────────────────────
    more: function () {
      return '' +
      '<div class="more-head">' +
        '<img src="images/logo.png" alt="" width="72" height="72" />' +
        '<div><h1 class="screen-h1">Paw Paradise Lovedean</h1><p>Secure, private dog field in Lovedean</p></div>' +
      '</div>' +
      '<div class="install-card" id="install-card"><span aria-hidden="true">📲</span><div><strong>Add the app to your home screen</strong><span>Opens full screen, like any other app.</span></div><button type="button" class="btn btn-primary btn-sm" data-sheet="install">How</button></div>' +

      '<h2 class="list-title">Visiting</h2>' +
      '<div class="list">' +
        row('#/info', '❓', 'Information &amp; FAQs', 'Facilities, rules, directions') +
        row('#/about', '👋', 'Meet the team', 'The Jewitt family (and dogs)') +
        row('#/news', '📰', 'News', 'Updates from the field') +
      '</div>' +

      '<h2 class="list-title">Get in touch</h2>' +
      '<div class="list">' +
        row('#/suggestions', '💡', 'Suggestions', 'Ideas, concerns or praise') +
        row('#/contact', '✉️', 'Contact us', C.email) +
      '</div>' +

      '<h2 class="list-title">Settings</h2>' +
      '<div class="list">' +
        '<div class="list-row list-row--static"><span class="row-icon" aria-hidden="true">🌗</span><span class="row-text"><span class="row-label" id="theme-label">Appearance</span></span>' +
          '<div class="segmented" role="radiogroup" aria-labelledby="theme-label">' +
            '<button type="button" role="radio" data-theme-set="light">Light</button>' +
            '<button type="button" role="radio" data-theme-set="dark">Dark</button>' +
            '<button type="button" role="radio" data-theme-set="auto">Auto</button>' +
          '</div></div>' +
        btnRow('data-sheet="a11y"', '♿', 'Accessibility', 'Text size, contrast, font, motion') +
      '</div>' +

      '<h2 class="list-title">Legal</h2>' +
      '<div class="list">' +
        btnRow('data-sheet="privacy"', '🔐', 'Privacy Policy') +
        btnRow('data-sheet="terms"', '📄', 'Terms &amp; Conditions') +
      '</div>' +

      '<h2 class="list-title">Staff</h2>' +
      '<div class="list">' +
        row('#/staff', '🔑', '<span id="staff-row-label">Staff login</span>', 'Family only') +
      '</div>' +

      '<div class="more-foot">' +
        socialRow() +
        '<p>Paw Paradise Lovedean · Lovedean, Hampshire · ' + w3w(false) + '</p>' +
        '<p class="small">© 2026 Paw Paradise Lovedean (Emma &amp; Adam Jewitt). All rights reserved.</p>' +
        '<p class="small"><a href="' + C.website + '" target="_blank" rel="noopener">pawparadiselovedean.co.uk</a> · App version ' + C.version + '</p>' +
      '</div>';
    },

    // ── INFORMATION & FAQS ───────────────────
    info: function () {
      function group(title, items) { return '<h2 class="faq-group-title">' + title + '</h2><div class="faq-list">' + items.join('') + '</div>'; }
      return '' +
      '<section class="section section--first">' +
        '<p class="eyebrow">Everything you need to know</p>' +
        '<h1 class="screen-h1">Information &amp; FAQs</h1>' +
        '<p>Find answers to common questions about visiting Paw Paradise Lovedean, from security and facilities to directions and rules.</p>' +
      '</section>' +
      '<section class="section">' +
        group('Planning your visit', [
          (C.openingDate ? faq('When do you open?', '<p>We open on <strong>' + C.openingDate + '</strong>. Bookings are open now. The first sessions available are on the 16th. <a href="#/book">Book your session</a>.</p>').replace('<details class="faq"', '<details class="faq" data-opening') : ''),
          faq('When are you open?', '<p>Sessions run within the following hours:</p><ul class="tick-list tick-list--compact"><li><strong>April – October, Monday to Saturday:</strong> 7:00am – 9:00pm</li><li><strong>April – October, Sundays &amp; Bank Holidays:</strong> 8:00am – 9:00pm</li><li><strong>November – March, all days:</strong> 8:00am – 9:00pm</li></ul><p>Your last session must end by the closing time for that day.</p>'),
          faq('How long is each session?', '<p>Each session is 50 minutes, giving your dog plenty of time to explore, play, train and let off steam.</p>'),
          faq('Can we book a 25 or 30 minute session?', '<p>Not currently. Our planning permission requires sessions to be 50 minutes. We know shorter slots are popular and we\'d love to offer them in the future. Watch this space.</p>'),
          faq('How many dogs can I bring?', '<p>The maximum is 8 dogs per booking. There are two session sizes:</p><ul class="tick-list tick-list--compact"><li><strong>1-4 dogs</strong>: £12 per session</li><li><strong>5-8 dogs</strong>: £15 per session</li></ul>'),
          faq('Where are you located?', '<p>We\'re on Tagdell Lane, just off Lovedean Lane in Lovedean, Hampshire, within the South Downs National Park. The easiest way to find our exact entrance is what3words:</p><p>' + w3w(false) + '</p><p>Nearest postcode: <strong>' + C.postcode + '</strong>. Postcodes aren\'t precise in the countryside, so please use what3words rather than the postcode for the gate.</p><p>Full directions, parking instructions and arrival guidance are sent with your booking confirmation.</p>'),
          faq('Is the field really secure?', '<p>Yes. Paw Paradise Lovedean is fully enclosed with 6-foot deer fencing around the entire perimeter and a double-gated entrance. We regularly check the fencing and gates to help keep even determined escape artists safely contained.</p>'),
          faq('What facilities are on site?', '<p>You\'ll find:</p><ul class="tick-list tick-list--compact"><li>Large, fully-enclosed countryside dog field</li><li>A field shelter for rainy days and quiet breaks</li><li>Fresh water and bowls for dogs</li><li>Seating for humans</li><li>Waste bins and poo bags</li></ul><p>We recommend bringing your own towels, toys and anything specific your dog needs.</p>'),
          faq('What should I bring?', '<p>We provide fresh water, bowls, seating, a field shelter and waste bins. Please bring anything else you and your dog require for your visit.</p>'),
          faq('Are reactive or nervous dogs welcome?', '<p>Absolutely. Paw Paradise Lovedean is designed with reactive, nervous and rescue dogs in mind. Sessions are exclusive use, so you won\'t need to worry about other dogs entering the field during your slot.</p>')
        ]) +
        group('Arrival, access &amp; facilities', [
          faq('How do I access the paddock when I arrive?', '<p>You will receive a unique gate access code via email and text message prior to your slot. When you arrive, park on the hard-standing car park, open and safely secure the gate, drive in, and keep your dogs secured in your vehicle until the car park vehicle gate is fully closed and padlocked behind you.</p><p>The site is unstaffed and accessed via a coded keypad on the locked gate.</p>'),
          faq('What should I do if someone is still in the field when I arrive?', '<p>Please remain outside in your vehicle on Tagdell Lane without blocking the track until the previous user has safely loaded their dogs, locked the gate, and completely exited. Never enter the car park area while another vehicle or dog is still inside.</p>'),
          faq('How many cars can I bring?', '<p>Each booking permits a maximum of 2 cars. All vehicles must park strictly within the designated hard-standing car park area. Parking on the entrance track or along the verges of Tagdell Lane is strictly prohibited.</p><p>If you\'re visiting with others, please car-share where possible.</p>'),
          faq('Is there lighting for evening or early morning bookings?', '<p>To comply with local South Downs planning regulations and preserve the natural surroundings, the field has no floodlighting. If you book during hours of darkness, please bring a torch and use a light-up collar or harness on your dog.</p>'),
          faq('Are there horses nearby, and will they disrupt our session?', PPC_HORSES()),
          faq('What do I need to do at the end of my session?', '<p>Please:</p><ul class="tick-list tick-list--compact"><li>Leave promptly at the end of your 50-minute slot so the next visitor can start on time</li><li>Pick up after your dogs and use the bins provided</li><li>Take all toys, leads and belongings with you</li><li>Make sure the vehicle gate is fully closed and padlocked</li></ul>')
        ]) +
        group('Field rules, safety &amp; biodiversity', [
          faq('What is your policy on dog waste and cleanliness?', '<p>You are fully responsible for cleaning up after your dog(s) immediately. All waste must be securely bagged and placed in the designated bins provided on site. Leaving dog mess behind poses health risks and may result in booking privileges being revoked.</p>'),
          faq('What is your policy on digging?', '<p>To protect the field and prevent escape hazards, dogs are strictly prohibited from digging anywhere on the premises except inside our designated sandpit area. If your dog attempts to dig elsewhere, please redirect them immediately. Please report any boundary or fence holes to us on <a href="' + C.phoneLink + '">' + C.phone + '</a>.</p>'),
          faq('What biodiversity measures are in place, and how can I help protect them?', '<p>We are actively working to enhance local wildlife and site ecology! You will notice areas around the field where grass has been removed. These sections have been sown with native wildflower seeds to establish vibrant wildflower borders. We have also recently planted 32 new trees across the site. To help these natural habitats thrive and keep the paddock beautiful for everyone, please monitor your dog(s) and ensure they do not dig in or disturb the newly planted trees and wildflower borders.</p>'),
          faq('Can children or adults use the agility and play equipment?', '<p>No. All play, ramp, and agility equipment on site is strictly for canine use only. Humans are strictly prohibited from climbing, sitting, or playing on any apparatus. All equipment is used entirely at your dog\'s own risk.</p>'),
          faq('Is smoking allowed on site?', '<p>No. Paw Paradise is a strictly non-smoking facility to prevent litter, fire risks, and dangerous debris that dogs might ingest.</p>'),
          faq('What happens in wet or bad weather?', '<p>After periods of heavy or constant rain, the grass and equipment may be wet, slippery, and muddy. Please wear suitable footwear. In cases of extreme or unsafe weather conditions, we reserve the right to temporarily suspend or reschedule sessions for safety.</p>')
        ]) +
        group('Dog health &amp; breed guidelines', [
          faq('Can I bring an XL Bully or a dog subject to Banned Breed Legislation?', '<p>Yes, provided you strictly adhere to current UK legislation. Your dog must have a valid Certificate of Exemption, third-party public liability insurance, and be neutered and microchipped. The dog must remain muzzled and on a lead until securely locked inside the paddock. Unless specific multi-dog exemptions apply, these dogs can only be exercised solo by members of the same household.</p><p>If you have questions about your specific dog, please contact us before booking.</p>'),
          faq('What vaccinations or health checks do you require?', '<p>All visiting dogs must be up to date on vaccinations, worming, or have valid, up-to-date titer test results confirming immunity. Kennel cough vaccination is strongly recommended.</p><p>We welcome dogs of all ages. Dogs in season are welcome.</p>'),
          faq('What if my dog is unwell?', '<p>If your dog exhibits any signs of illness (such as coughing, vomiting, or diarrhoea), please do not bring them to the field. Reschedule your slot for when they are completely symptom-free.</p>')
        ]) +
        group('Bookings, cancellations &amp; commercial use', [
          faq('What is your cancellation and reschedule policy?', '<p>You can change or cancel your appointment directly through our online booking system up to 24 hours before your start time for a full refund or to reschedule. Because slots are booked for specific dates and times, cancellations made within 24 hours or no-shows are non-refundable.</p>'),
          faq('How do refunds work for block bookings or gift certificates?', '<p>You can cancel an unused block booking or gift certificate within 14 days of purchase for a full refund by emailing <a href="mailto:' + C.email + '">' + C.email + '</a>. Once 14 days have passed, or once any session from a block booking has been redeemed, they become non-refundable.</p>'),
          faq('Can I bring more than the standard number of dogs?', '<p>We are currently running a high-capacity trial permitting bookings of up to 8 dogs. Please ensure your booking reflects the exact number of dogs and vehicles attending. High-capacity slots require handlers to strictly manage waste and behaviour to ensure the trial remains open.</p>'),
          faq('Are professional dog walkers or trainers allowed to book?', '<p>Yes! Commercial users are welcome, but you must hold valid commercial public liability insurance covering the full number and specific types of dogs under your care during the session.</p>')
        ]) +
      '</section>' +
      '<section class="section section--forest">' +
        '<p>Still have a question? Email us at <a href="mailto:' + C.email + '">' + C.email + '</a>, or drop us a message on Instagram, Facebook or TikTok.</p>' +
        '<a class="btn btn-light btn-block" href="#/contact">Get in touch</a>' +
      '</section>';
    },

    // ── MEET THE TEAM ────────────────────────
    about: function () {
      function person(name, role, photos, bios) {
        return '<article class="team-card">' +
          '<div class="team-photos' + (photos.length > 1 ? ' team-photos--two' : '') + '">' +
            photos.map(function (p) { return '<img src="images/team/' + p[0] + '.jpg" alt="' + p[1] + '" loading="lazy" />'; }).join('') +
          '</div>' +
          '<div class="team-body"><h3>' + name + '</h3><p class="team-role">' + role + '</p>' + bios.map(function (b) { return '<p>' + b + '</p>'; }).join('') + '</div>' +
        '</article>';
      }
      return '' +
      '<section class="section section--first">' +
        '<p class="eyebrow">The Jewitt family</p>' +
        '<h1 class="screen-h1">Meet the team</h1>' +
        '<p>A family living and working on site. We built this place because we wanted it ourselves. Meet the people (and dogs) behind Paw Paradise Lovedean.</p>' +
      '</section>' +
      '<section class="section">' +
        '<img class="story-photo" src="images/team/family.jpg" alt="The Jewitt family" />' +
        '<p class="eyebrow">Our story</p>' +
        '<h2>Why we built Paw Paradise</h2>' +
        '<p>For nearly two decades, Hill Cottage on Lovedean Lane has been home to our family. When the field became available in 2022, we jumped at the chance to preserve this beautiful stretch of the South Downs National Park while giving it a wonderful new purpose.</p>' +
        '<p>As passionate animal lovers, we knew a dog park was the perfect fit for us and the field.</p>' +
        '<p>Over the last four years, from planting the first grass seed to building this website, Paw Paradise has truly been a family effort. We\'re proud to share our piece of Lovedean with you and your dogs!</p>' +
      '</section>' +
      '<section class="section">' +
        '<div class="team-head"><h2>The team</h2><span class="chip">4 people</span></div>' +
        person('Emma Jewitt', 'Co-owner', [['emma', 'Emma Jewitt'], ['emma-dog', 'Emma Jewitt with a dog']],
          ['Paw Paradise started as Emma\'s idea: a safe, private space where dogs can run free and dog lovers can properly relax in the beauty of the South Downs National Park. She is immensely proud of the beautiful space that the Paw Paradise team have created. Bringing that vision into reality has been a labour of love! Now Emma runs the business, overseeing everything from the field and facilities to bookings and the day-to-day running of the site. Emma is at the heart of everything Paw Paradise!']) +
        person('Adam Jewitt', 'Co-owner', [['adam-dog', 'Adam Jewitt with a dog'], ['adam', 'Adam Jewitt']],
          ['Paw Paradise literally could not have happened without Adam&rsquo;s support and enthusiasm for making the idea become reality.',
           'Alongside his day job working in the tech industry, he has (almost!) willingly given up several weekends to do the majority of the &ldquo;blue&rdquo; jobs, especially when they involved big shiny machines (the chainsawing and new mower definitely helped to encourage him!).',
           'Adam is immensely proud of the space that the Paw Paradise team have created together, and is keen to find out what new machines he can justify buying as the paddock evolves.']) +
        person('Amelie Jewitt', 'Director', [['amelie', 'Amelie Jewitt at her graduation'], ['amelie-dog', 'Amelie Jewitt with a dog']],
          ['Amelie is part of the family team behind Paw Paradise and lends a hand on site wherever she\'s needed. Alongside the business, she graduated from the University of Brighton in 2026 with a degree in English Language and Linguistics, and is now training to become a teacher with a PGCE at the University of Chichester.']) +
        person('India Jewitt', 'Director &amp; Digital Lead', [['india-dog', 'India Jewitt with a dog in the field'], ['india', 'India Jewitt']],
          ['India built this website from scratch and manages Paw Paradise across all social media channels, as well as helping make key design decisions for the park. Alongside the business, she\'s in her third and final year studying Computer Science at Newcastle University, where she\'s on the equestrian club committee and rides for the A team in BUCS competitions. She\'s also part of the university gymnastics club and a peer mentor.']) +
      '</section>' +
      '<section class="section">' +
        '<div class="team-head"><h2>The dogs</h2><span class="chip">2 good boys</span></div>' +
        person('Red', 'Head of Human Relations · Irish Setter, 8 years old', [['red', 'Red']],
          ['Red conducts all background checks personally, by nose. Eight years of experience means he can vet a new visitor in under three seconds. No formal qualifications, but an impeccable record.']) +
        person('Bono', 'Chief Obstacle Officer · Golden Retriever, 2 years old', [['bono', 'Bono']],
          ['Bono personally road-tests every tunnel, agility feature and obstacle on site. He takes this responsibility very seriously, often requiring multiple test runs before signing off. Appointed COO at age 2.']) +
      '</section>';
    },

    // ── CONTACT ──────────────────────────────
    contact: function () {
      return '' +
      '<section class="section section--first">' +
        '<p class="eyebrow">Say hello</p>' +
        '<h1 class="screen-h1">Contact Paw Paradise Lovedean</h1>' +
        '<p>Have a question before you book? Drop us an email.</p>' +
      '</section>' +
      '<section class="section">' +
        '<div class="card">' +
          '<h2>Email us</h2>' +
          '<a class="contact-email" href="mailto:' + C.email + '">pawparadiselovedean<wbr>@gmail.com</a>' +
          '<p>For any questions about visiting or booking. We\'ll reply as soon as we can.</p>' +
          '<a class="btn btn-primary btn-block" href="mailto:' + C.email + '">Send an email</a>' +
        '</div>' +
        '<div class="card">' +
          '<h2>Find us</h2>' +
          '<p>Tagdell Lane, Lovedean, Hampshire</p>' +
          '<p class="center">' + w3w(true) + '</p>' +
          '<p class="small">Nearest postcode: <strong>' + C.postcode + '</strong>. Please use what3words to find the gate.</p>' +
        '</div>' +
        '<div class="card">' +
          '<h2>Follow us</h2>' +
          '<p>Field updates, dog photos and behind-the-scenes progress.</p>' +
          socialRow() +
        '</div>' +
        '<div class="emergency" role="note">' +
          '<span class="emergency-tag">Emergencies only</span>' +
          '<p>Problem at the field during your session? Call <a href="' + C.phoneLink + '">' + C.phone + '</a></p>' +
        '</div>' +
      '</section>';
    },

    // ── GALLERY (photos are listed in features.js) ──
    galleryIntro:
      '<section class="section section--first">' +
        '<p class="eyebrow">See the space</p>' +
        '<h1 class="screen-h1">Gallery</h1>' +
        '<p>Take a look around Paw Paradise Lovedean: the field, the shelter, the fencing and, most importantly, the dogs.</p>' +
      '</section>',

    galleryOutro: function () {
      return '' +
      '<section class="section section--tint">' +
        '<p class="eyebrow">Share your visit</p>' +
        '<h2>Got a great photo?</h2>' +
        '<p>Send us up to 3 photos from your visit. We check every photo before it goes on the website.</p>' +
        '<button type="button" class="btn btn-primary btn-block" data-sheet="share-photos">Send your photos</button>' +
      '</section>' +
      '<section class="section">' +
        '<p class="eyebrow">Follow along</p>' +
        '<h2>The latest from the field</h2>' +
        '<p>Happy dogs, muddy paws and countryside mornings. Follow us for updates.</p>' +
        '<div class="pill-links">' +
          '<a class="btn btn-secondary btn-sm" href="' + C.social.instagram + '" target="_blank" rel="noopener">Instagram</a>' +
          '<a class="btn btn-secondary btn-sm" href="' + C.social.facebook + '" target="_blank" rel="noopener">Facebook</a>' +
          '<a class="btn btn-secondary btn-sm" href="' + C.social.tiktok + '" target="_blank" rel="noopener">TikTok</a>' +
          '<a class="btn btn-secondary btn-sm" href="' + C.social.linkedin + '" target="_blank" rel="noopener">LinkedIn</a>' +
        '</div>' +
      '</section>';
    },

    // ── SUGGESTIONS ──────────────────────────
    suggestions: function () {
      return '' +
      '<section class="section section--first">' +
        '<p class="eyebrow">Your voice matters</p>' +
        '<h1 class="screen-h1">Suggestions</h1>' +
        '<p>Ideas, concerns or something we\'ve got right: tell us. You don\'t need to leave your name. Every suggestion is read by the family.</p>' +
      '</section>' +
      '<section class="section">' +
        '<div class="card" id="sg-success" hidden>' +
          '<div class="success-tick" aria-hidden="true">✓</div>' +
          '<h2 class="center">Thank you!</h2>' +
          '<p class="center">We\'ve got your suggestion. We read every one.</p>' +
          '<button type="button" class="btn btn-secondary btn-block" id="sg-another">Send another</button>' +
        '</div>' +
        '<form class="card form" id="sg-form" novalidate>' +
          '<div class="field"><label for="sg-text">Your suggestion</label>' +
            '<textarea id="sg-text" rows="6" maxlength="1000" placeholder="Type here…"></textarea>' +
            '<span class="field-hint"><span id="sg-count">0</span> / 1000</span></div>' +
          '<div class="field"><label for="sg-category">Topic <span class="opt">(optional)</span></label>' +
            '<select id="sg-category"><option value="">Choose a topic…</option><option value="facilities">Field &amp; facilities</option><option value="booking">Booking &amp; sessions</option><option value="website">Website or app</option><option value="dogs">Dogs &amp; welfare</option><option value="other">Other</option></select></div>' +
          '<div class="field"><label for="sg-name">Name <span class="opt">(optional)</span></label><input type="text" id="sg-name" autocomplete="name" maxlength="60" /></div>' +
          '<div class="field"><label for="sg-email">Email <span class="opt">(optional)</span></label><input type="email" id="sg-email" autocomplete="email" inputmode="email" maxlength="120" placeholder="Only if you\'d like a reply" /></div>' +
          '<div class="hp-field" aria-hidden="true"><label for="sg-website">Leave this empty</label><input type="text" id="sg-website" tabindex="-1" autocomplete="off" /></div>' +
          '<p class="form-msg" id="sg-msg" role="status" hidden></p>' +
          '<button type="submit" class="btn btn-primary btn-block" id="sg-submit">Send suggestion</button>' +
          '<p class="small center">No account needed. <button type="button" class="text-link" data-sheet="privacy">Privacy Policy</button></p>' +
        '</form>' +
      '</section>';
    },

    // ── NEWS (blog) ──────────────────────────
    newsIntro:
      '<section class="section section--first">' +
        '<p class="eyebrow">From the team</p>' +
        '<h1 class="screen-h1">News</h1>' +
        '<p>Updates, stories and news from the family behind Paw Paradise Lovedean.</p>' +
        '<button type="button" class="btn btn-primary btn-block" id="news-write" hidden>Write a post</button>' +
      '</section>'
  };

  function PPC_HORSES() { return window.PPC ? window.PPC.horses : ''; }
})();
