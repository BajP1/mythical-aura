# Manual Deployment Guide — Project `czjrlnpckeeejakcumkb`

Everything below must be applied to **`czjrlnpckeeejakcumkb`** (the project the
frontend already talks to). Do NOT switch to any other project.

Prereqs (one-time on your machine):

```bash
npm i -g supabase
supabase login
supabase link --project-ref czjrlnpckeeejakcumkb
```

---

## 1. Secrets (Edge Function env)

Set these on `czjrlnpckeeejakcumkb` (Production Cashfree credentials):

```bash
supabase secrets set \
  CASHFREE_APP_ID="<your production app id>" \
  CASHFREE_SECRET_KEY="<your production secret key>" \
  --project-ref czjrlnpckeeejakcumkb
```

Verify:

```bash
supabase secrets list --project-ref czjrlnpckeeejakcumkb
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by Supabase — do not set them yourself.

---

## 2. SQL migration — `bookings` columns + realtime

Run this once against `czjrlnpckeeejakcumkb` (SQL Editor in Supabase Studio, or `psql`):

```sql
-- Columns needed by PaymentStatus.tsx
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS cashfree_order_id text,
  ADD COLUMN IF NOT EXISTS payment_id        text;

-- Idempotency: prevent duplicate booking for the same Cashfree order
CREATE UNIQUE INDEX IF NOT EXISTS bookings_cashfree_order_id_key
  ON public.bookings (cashfree_order_id)
  WHERE cashfree_order_id IS NOT NULL;

-- Realtime: full row payloads + publication membership
ALTER TABLE public.bookings REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'bookings'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings';
  END IF;
END $$;
```

No GRANT/RLS changes needed — existing policies already cover insert/select/update for `authenticated`.

---

## 3. Edge Functions to deploy

Both function source files are already in the repo at:

- `supabase/functions/create-cashfree-order/index.ts`
- `supabase/functions/verify-cashfree-payment/index.ts`

Deploy them to `czjrlnpckeeejakcumkb`:

```bash
supabase functions deploy create-cashfree-order      --project-ref czjrlnpckeeejakcumkb --no-verify-jwt
supabase functions deploy verify-cashfree-payment    --project-ref czjrlnpckeeejakcumkb --no-verify-jwt
```

> Note: the frontend currently calls `create-order` (legacy name) AND
> `verify-cashfree-payment`. If your old `create-order` function on
> `czjrlnpckeeejakcumkb` is still the one being used by BookNow.tsx, leave it
> alone — only `verify-cashfree-payment` is the missing one causing the
> post-payment failure. Deploying `create-cashfree-order` as well is harmless.

Verify:

```bash
curl -i -X OPTIONS \
  https://czjrlnpckeeejakcumkb.supabase.co/functions/v1/verify-cashfree-payment
# expect: HTTP/2 200
```

---

## 4. Frontend — already correct, no changes needed

- `src/integrations/supabase/client.ts` → `czjrlnpckeeejakcumkb` ✅
- `src/pages/PaymentStatus.tsx` → calls `https://czjrlnpckeeejakcumkb.supabase.co/functions/v1/verify-cashfree-payment` ✅
- Insert payload includes `cashfree_order_id` + `payment_id` ✅ (columns added in step 2)
- Realtime subscriptions in `BookNow.tsx`, `History.tsx`, `AdminDashboard.tsx` ✅ (publication updated in step 2)

---

## 5. End-to-end test

1. Book a slot → Pay Online.
2. Complete payment on Cashfree (production card / UPI).
3. Cashfree redirects to `/payment-status?order_id=MGS_...`.
4. `verify-cashfree-payment` returns `{ status: "PAID", payment_id: "..." }`.
5. Booking row is inserted into `public.bookings` with `payment_status='paid'`.
6. Admin Dashboard receives realtime INSERT → beep plays.
7. User `/history` shows the new booking.
8. Success page displays Entry Number + Order ID.

If anything fails, tail logs:

```bash
supabase functions logs verify-cashfree-payment --project-ref czjrlnpckeeejakcumkb --tail
```
