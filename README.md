# Paw Paradise Lovedean – app

The phone app for Paw Paradise Lovedean. It does everything the website does, laid out and behaving like an app: a tab bar along the bottom, screens that slide in and out, pop-ups from the bottom of the screen, swipe-back, pull-to-refresh, and it works offline. People install it from its own web address onto their home screen (iPhone and Android). No App Store needed.

It is completely separate from the website. Nothing in this folder changes the website, and nothing in the website folder is needed to run it.

## What's in it

| Tab | What it does |
|---|---|
| **Home** | The key details: opening date (after opening day: today's opening hours), 50-minute sessions, prices, opening hours, finding us, and a Book button |
| **Book** | The Acuity booking page, filling the screen. The ↗ button at the top opens it in the browser instead |
| **Gallery** | Photo and video grid with a full-screen swipeable viewer, approved visitor photos, and "Send us your photos" (staff approve before anything shows) |
| **More** | Add app to your phone, Information & FAQs, News, Contact, appearance (light/dark/auto), accessibility, Privacy Policy, Terms, Staff login |

**Add app to your phone:** share `https://app.pawparadiselovedean.co.uk/?install` (on the website, in booking emails, or as a QR code). It opens the app with an iPhone / Android choice: Android installs in one tap, and iPhone shows step-by-step Add to Home Screen instructions. Apple doesn't let websites install themselves, so iPhone always needs Safari's Share → Add to Home Screen.

**Staff area** (More → Staff login): same login as the website. Read and delete suggestions sent from the website, approve or delete visitor photos, and write or delete news posts.

**What syncs with the website:** news/blog posts and visitor photos (same database). The main gallery photos and videos are files in each folder, so add new ones to both.

## How it's built

- Plain HTML, CSS and JavaScript, no build step. Same approach as the website.
- **Supabase**: the same project as the website, using the same public key and the same security rules. Reviews, suggestions, gallery photos and news are shared with the website. Nothing in the database was changed.
- **Acuity**: the same booking pages as the website, shown inside the app.
- **Works offline**: the app and the gallery thumbnails are saved on the phone (`sw.js`). News shows the last copy it loaded.

```
index.html             The app (one page; screens are swapped in by JavaScript)
manifest.webmanifest   App name, icons and colours for installing
sw.js                  Saves the app on the phone so it opens instantly and works offline
_headers               Cloudflare settings
css/app.css            All styles (same colours and fonts as the website)
js/config.js           Supabase, Acuity links, email, phone, socials, opening date
js/content.js          The words on each screen. Edit text here
js/legal.js            Privacy Policy and Terms text
js/features.js         Gallery list, photo sharing, news, add-to-phone, pop-ups
js/staff.js            Staff login and staff tools
js/ui.js               Pop-ups, photo viewer, pull-to-refresh
js/app.js              Tabs, screens, Book tab, back button, swipe-back
js/vendor/supabase.js  Supabase library (v2.119.0), kept locally so it works offline
images/                Logo, app icons, gallery photos/videos (+ small thumbnails)
```

## Running it on your computer

From this folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Use your browser's phone view (in Chrome, open DevTools and turn on the device toolbar) to see it at phone size.

## Putting it online (separate from the website)

1. Push this folder to its **own** GitHub repository (not the website's).
2. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, pick the new repository. Build command: none. Output folder: `/`.
3. Add a custom domain such as `app.pawparadiselovedean.co.uk` (**Custom domains** tab).
4. **Supabase (needed for staff password resets):** Authentication → URL Configuration → add `https://app.pawparadiselovedean.co.uk` to **Redirect URLs**. Everything else already works.

Then on a phone, open the address and:
- **iPhone:** Safari → Share → **Add to Home Screen**
- **Android:** Chrome → **Install app** (or ⋮ → Install app)

The More tab also has an "Add the app to your home screen" card that shows these steps.

## Making changes

- **Words:** `js/content.js` (Privacy and Terms are in `js/legal.js`)
- **Prices, email, phone, Acuity links, opening date:** `js/config.js` and `js/content.js`
- **Gallery:** add the file to `images/gallery/` (plus a small square copy in `images/gallery/thumbs/`) and add a line to the `GALLERY` list in `js/features.js`
- **After any change:** open `sw.js` and bump `VERSION` (e.g. `pp-app-v2` → `pp-app-v3`) so installed phones fetch the new files

The opening banner hides itself after the opening day set in `js/config.js`.

## Tested

- Every screen at phone size, in light, dark and high-contrast modes and with large text
- Accessibility (axe-core, WCAG 2.2 AA): no violations on any screen in any colour mode
- Book tab, pop-ups, settings, add-to-phone, photo viewer, photo sending, news, and the whole staff flow (sign in, approve, delete, publish, sign out), using test stand-ins for Supabase and Acuity
- Installable (Chrome's install check passes), opens offline, Back button and swipe-back stay inside the app
