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

Deno.serve(async (req) => {
  let payload: any;
  try { payload = await req.json(); } catch { return new Response("Bad request", { status: 400 }); }
  if (payload?.type !== "INSERT") return new Response("ignored");
  const r = payload.record ?? {};

  let msg: { title: string; body: string; url: string; tag: string } | null = null;
  if (payload.table === "suggestions") {
    msg = { title: "New suggestion", body: "", url: "/#/staff/suggestions", tag: "suggestion-" + r.id };
  } else if (payload.table === "gallery_submissions" && !r.approved) {
    // Several photos sent together show as one notification
    msg = { title: "New gallery submission", body: "", url: "/#/staff/photos", tag: "photos" };
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
