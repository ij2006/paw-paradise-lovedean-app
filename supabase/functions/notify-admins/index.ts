// Paw Paradise app: sends a notification to every admin phone that has turned
// notifications on, whenever a new suggestion or gallery photo is saved.
// Called by two Supabase Database Webhooks (one for each table).
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

webpush.setVapidDetails(
  "mailto:pawparadiselovedean@gmail.com",
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

function clip(text: unknown, n: number) {
  const s = String(text ?? "").trim();
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

Deno.serve(async (req) => {
  let payload: any;
  try { payload = await req.json(); } catch { return new Response("Bad request", { status: 400 }); }
  if (payload?.type !== "INSERT") return new Response("ignored");
  const r = payload.record ?? {};

  let msg: { title: string; body: string; url: string; tag: string } | null = null;
  if (payload.table === "suggestions") {
    msg = {
      title: "New suggestion",
      body: (r.name ? clip(r.name, 40) + ": " : "") + clip(r.suggestion, 140),
      url: "/#/staff/suggestions",
      tag: "suggestion-" + r.id,
    };
  } else if (payload.table === "gallery_submissions" && !r.approved) {
    msg = {
      title: "New photo to approve",
      body: (r.name ? clip(r.name, 40) : "A visitor") + (r.dog ? " and " + clip(r.dog, 30) : "") + " sent a photo for the gallery",
      url: "/#/staff/photos",
      tag: "photos", // several photos sent together show as one notification
    };
  }
  if (!msg) return new Response("ignored");

  const { data: subs, error } = await supabase.from("push_subscriptions").select("endpoint, p256dh, auth");
  if (error) return new Response(error.message, { status: 500 });

  let sent = 0;
  await Promise.all((subs ?? []).map(async (s) => {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify(msg),
        { TTL: 60 * 60 * 24, urgency: "high" },
      );
      sent++;
    } catch (e: any) {
      // The phone turned notifications off or removed the app: forget it
      if (e?.statusCode === 404 || e?.statusCode === 410) {
        await supabase.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
      }
    }
  }));

  return new Response(JSON.stringify({ sent }), { headers: { "Content-Type": "application/json" } });
});
