// ─────────────────────────────────────────────
//  Paw Paradise app - settings
//  Same Supabase project and Acuity account as the website.
//  The Supabase key below is the public "anon" key: it can only do
//  what the database's security rules allow (same as the website).
// ─────────────────────────────────────────────
var PP_CONFIG = {
  supabaseUrl: 'https://jtzuklfpkkvmhnobypjb.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0enVrbGZwa2t2bWhub2J5cGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMjA3NjcsImV4cCI6MjA5Mjg5Njc2N30._X8k5eRr6L7MbX-5VoS6JQFof1T3CcNF6Del7ks-U8M',

  // Acuity booking pages (shown inside the app on the Book tab)
  acuity: {
    all:      'https://app.acuityscheduling.com/schedule.php?owner=40722415',
    standard: 'https://app.acuityscheduling.com/schedule.php?owner=40722415&appointmentType=99841024',
    large:    'https://app.acuityscheduling.com/schedule.php?owner=40722415&appointmentType=99841025'
  },

  email: 'pawparadiselovedean@gmail.com',
  phone: '02394 222052',
  phoneLink: 'tel:+442394222052',
  what3words: 'display.sway.liberated',
  postcode: 'PO8 0QN',
  website: 'https://pawparadiselovedean.co.uk',

  social: {
    instagram: 'https://www.instagram.com/pawparadiselovedean/',
    facebook:  'https://www.facebook.com/profile.php?id=61590981381275',
    tiktok:    'https://www.tiktok.com/@pawparadiselovedeanltd',
    linkedin:  'https://www.linkedin.com/company/paw-paradise-lovedean/'
  },

  reviews: {
    googleRead:  'https://g.page/r/CUw3uVAX6gPIEBM',
    googleWrite: 'https://g.page/r/CUw3uVAX6gPIEBM/review',
    facebook:    'https://www.facebook.com/profile.php?id=61590981381275&sk=reviews'
  },

  // Opening banner. It hides itself automatically after openingDay.
  openingDate: 'Monday 16 November 2026',
  openingDay: '2026-11-16',
  version: '1.0.0'
};
