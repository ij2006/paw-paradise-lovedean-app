// ─────────────────────────────────────────────
//  Screen content. Edit the words here to change what the app shows.
//  Links: "#/screen" opens a screen; data-sheet="privacy|terms|a11y|install"
//  opens a pop-up.
// ─────────────────────────────────────────────
(function () {
  var C = PP_CONFIG;
  var ICONS = {"instagram": "<path d=\"M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.265.069 1.645.069 4.851s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.265.058-1.645.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038C23.986 15.668 24 15.259 24 12s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z\"/>", "facebook": "<path d=\"M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z\"/>", "tiktok": "<path d=\"M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z\"/>"};

  // ── Small building blocks ──────────────────
  function chevron() {
    return '<svg class="cell-chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function icon(emoji, tone) {
    return '<span class="cell-icon' + (tone ? ' cell-icon--' + tone : '') + '" aria-hidden="true">' + emoji + '</span>';
  }
  // A tappable row in a grouped list
  function cell(o) {
    var tag = o.href ? 'a' : 'button';
    var attrs = o.href ? ' href="' + o.href + '"' + (o.external ? ' target="_blank" rel="noopener"' : '') : ' type="button"' + (o.attrs ? ' ' + o.attrs : '');
    return '<' + tag + ' class="cell"' + attrs + (o.label ? ' aria-label="' + o.label + '"' : '') + '>' +
      (o.icon || '') +
      '<span class="cell-main"><span class="cell-title">' + o.title + '</span>' + (o.sub ? '<span class="cell-sub">' + o.sub + '</span>' : '') + '</span>' +
      (o.value ? '<span class="cell-value">' + o.value + '</span>' : '') +
      (o.external ? '<svg class="cell-chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : chevron()) +
    '</' + tag + '>';
  }
  function group(title, rows, foot) {
    return (title ? '<h2 class="group-title">' + title + '</h2>' : '') +
      '<div class="group">' + rows.join('') + '</div>' +
      (foot ? '<p class="group-foot">' + foot + '</p>' : '');
  }
  function brand(name) {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">' + ICONS[name] + '</svg>';
  }
  function faq(q, a) {
    return '<details class="faq"><summary><span>' + q + '</span><span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-a">' + a + '</div></details>';
  }
  function w3wLink() {
    return 'https://what3words.com/' + C.what3words;
  }

  window.PPC = {
    group: group, cell: cell, icon: icon,

    // ── HOME: just the key details ───────────
    home: function () {
      return '' +
      '<header class="home-head">' +
        '<img src="images/logo.png" alt="" width="64" height="64" />' +
        '<div><h1 class="home-title">Paw Paradise</h1><p>Secure, private dog field in Lovedean</p></div>' +
      '</header>' +

      '<div class="status-card" id="status-card">' +
        '<p class="status-label" data-opening>Opening</p>' +
        '<p class="status-big" data-opening>' + C.openingDateShort + '</p>' +
        '<p class="status-sub" data-opening>Bookings are open now for sessions from the 16th</p>' +
        '<p class="status-label" data-after-opening id="today-label">Today</p>' +
        '<p class="status-big" data-after-opening id="today-hours"></p>' +
        '<p class="status-sub" data-after-opening>Open every day, including bank holidays</p>' +
        '<a class="btn btn-on-dark btn-block" href="#/book">Book a session</a>' +
      '</div>' +

      '<div class="facts">' +
        '<div class="fact"><span class="fact-big">50 min</span><span class="fact-small">Private sessions, the whole field to yourself</span></div>' +
        '<div class="fact"><span class="fact-big">£12</span><span class="fact-small">1–4 dogs</span></div>' +
        '<div class="fact"><span class="fact-big">£15</span><span class="fact-small">5–8 dogs</span></div>' +
      '</div>' +

      group('Opening hours', [
        '<div class="cell cell--static"><span class="cell-main"><span class="cell-title">April – October</span><span class="cell-sub">Monday to Saturday</span></span><span class="cell-value">7am – 9pm</span></div>',
        '<div class="cell cell--static"><span class="cell-main"><span class="cell-title">April – October</span><span class="cell-sub">Sundays &amp; bank holidays</span></span><span class="cell-value">8am – 9pm</span></div>',
        '<div class="cell cell--static"><span class="cell-main"><span class="cell-title">November – March</span><span class="cell-sub">Every day</span></span><span class="cell-value">8am – 9pm</span></div>'
      ], 'Your session must end by closing time.') +

      group('Find us', [
        cell({ href: w3wLink(), external: true, icon: icon('📍'), title: '<span class="w3w-slashes" aria-hidden="true">///</span>' + C.what3words + '<span class="sr-only"> on what3words</span>', sub: 'Tagdell Lane, Lovedean · ' + C.postcode })
      ], 'Postcodes aren\'t precise out here, so use what3words to find the gate.');
    },

    // ── BOOK: Acuity only (built in app.js) ──

    // ── GALLERY header ───────────────────────
    galleryHead: '<h1 class="large-title">Gallery</h1>',

    // ── MORE ─────────────────────────────────
    more: function () {
      return '' +
      '<h1 class="large-title">More</h1>' +
      '<div class="group group--profile">' +
        '<div class="cell cell--static cell--profile"><img src="images/logo.png" alt="" width="56" height="56" />' +
          '<span class="cell-main"><span class="cell-title">Paw Paradise Lovedean</span><span class="cell-sub">Secure, private dog field</span></span></div>' +
      '</div>' +
      '<div class="group install-group" id="install-card">' +
        cell({ attrs: 'data-sheet="install"', icon: icon('📲', 'gold'), title: 'Add app to your phone', sub: 'iPhone or Android' }) +
      '</div>' +
      group('', [
        cell({ href: '#/info', icon: icon('❓', 'green'), title: 'Information &amp; FAQs' }),
        cell({ href: '#/news', icon: icon('📰', 'green'), title: 'News' }),
        cell({ href: '#/contact', icon: icon('✉️', 'green'), title: 'Contact' })
      ]) +
      group('Settings', [
        '<div class="cell cell--static cell--wrap">' + icon('🌗', 'grey') + '<span class="cell-main"><span class="cell-title" id="theme-label">Appearance</span></span>' +
          '<div class="segmented" role="radiogroup" aria-labelledby="theme-label">' +
            '<button type="button" role="radio" data-theme-set="light">Light</button>' +
            '<button type="button" role="radio" data-theme-set="dark">Dark</button>' +
            '<button type="button" role="radio" data-theme-set="auto">Auto</button>' +
          '</div></div>',
        cell({ attrs: 'data-sheet="a11y"', icon: icon('♿', 'grey'), title: 'Accessibility' })
      ]) +
      group('', [
        cell({ attrs: 'data-sheet="privacy"', icon: icon('🔐', 'grey'), title: 'Privacy Policy' }),
        cell({ attrs: 'data-sheet="terms"', icon: icon('📄', 'grey'), title: 'Terms &amp; Conditions' })
      ]) +
      group('', [
        cell({ href: '#/staff', icon: icon('🔑', 'grey'), title: '<span id="staff-row-label">Staff login</span>' })
      ]) +
      '<p class="app-foot">Paw Paradise Lovedean · Version ' + C.version + '<br><a href="' + C.website + '" target="_blank" rel="noopener">pawparadiselovedean.co.uk</a></p>';
    },

    // ── INFORMATION & FAQS ───────────────────
    info: function () {
      function g(title, items) { return '<h2 class="group-title">' + title + '</h2><div class="group">' + items.join('') + '</div>'; }
      return '' +
      '<h1 class="sr-only">Information &amp; FAQs</h1>' +
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
      '<p class="group-foot">Still have a question? <a href="#/contact">Contact us</a>.</p>';
    },

    // ── CONTACT ──────────────────────────────
    contact: function () {
      return '' +
      '<h1 class="sr-only">Contact</h1>' +
      group('', [
        cell({ href: 'mailto:' + C.email, icon: icon('✉️', 'green'), title: 'Email us', sub: C.email })
      ], 'For any questions about visiting or booking. We\'ll reply as soon as we can.') +
      group('Emergencies only', [
        cell({ href: C.phoneLink, icon: icon('📞', 'red'), title: 'Call ' + C.phone, sub: 'Problem at the field during your session' })
      ]) +
      group('Find us', [
        cell({ href: w3wLink(), external: true, icon: icon('📍', 'green'), title: '<span class="w3w-slashes" aria-hidden="true">///</span>' + C.what3words + '<span class="sr-only"> on what3words</span>', sub: 'Tagdell Lane, Lovedean · ' + C.postcode })
      ]) +
      group('Follow us', [
        cell({ href: C.social.instagram, external: true, icon: '<span class="cell-icon cell-icon--brand cell-icon--ig" aria-hidden="true">' + brand('instagram') + '</span>', title: 'Instagram' }),
        cell({ href: C.social.facebook, external: true, icon: '<span class="cell-icon cell-icon--brand cell-icon--fb" aria-hidden="true">' + brand('facebook') + '</span>', title: 'Facebook' }),
        cell({ href: C.social.tiktok, external: true, icon: '<span class="cell-icon cell-icon--brand cell-icon--tt" aria-hidden="true">' + brand('tiktok') + '</span>', title: 'TikTok' })
      ]);
    },

    // ── NEWS header ──────────────────────────
    newsHead: '<h1 class="sr-only">News</h1>'
  };
})();
