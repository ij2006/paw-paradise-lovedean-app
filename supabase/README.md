# Admin phone notifications – one-time Supabase setup

The app's Admin area has a **Notify me on this phone** switch. For the
notifications to actually be sent, Supabase needs the four things below. You
only do this once.

## 1. Create the table
Supabase → **SQL Editor** → **New query** → paste everything from
`notifications.sql` → **Run**.

## 2. Add the notification function
Supabase → **Edge Functions** → **Deploy a new function** → **Via Editor**.
- Name it `notify-admins`
- Replace the example code with everything from `functions/notify-admins/index.ts`
- Click **Deploy function**

## 3. Add the two keys
Supabase → **Edge Functions** → **Secrets** → add:

| Name | Value |
| --- | --- |
| `VAPID_PUBLIC_KEY` | `BEPFLzYigeZZ4hrXosUFgt-o_tRyuaWUC9N7r5ax5NBc60xIFWZZsCg-WG7v__WBOikegB9WFGoyYIyuiE6JFdc` |
| `VAPID_PRIVATE_KEY` | in `vapid-private-key.txt` in this folder (kept off GitHub) |

## 4. Run the function when something new comes in
Supabase → **Database** → **Webhooks** (turn webhooks on if asked) → **Create a new hook**, twice:

| | First hook | Second hook |
| --- | --- | --- |
| Name | `notify-suggestions` | `notify-photos` |
| Table | `suggestions` | `gallery_submissions` |
| Events | Insert | Insert |
| Type | Supabase Edge Functions | Supabase Edge Functions |
| Function | `notify-admins` | `notify-admins` |

In each, under **HTTP Headers**, click **Add auth header with service key**, then **Create webhook**.

## 5. On each admin's iPhone
Open the app from the home screen → **More** → **Admin login** → sign in →
turn on **Notify me on this phone** → **Allow**.
