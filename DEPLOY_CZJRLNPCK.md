# Manual deploy to czjrlnpckeeejakcumkb

## EXACT BREAK POINT FOUND

**File:** `src/pages/PaymentStatus.tsx`
**Line:** 122–126 — `supabase.from("bookings").insert(insertPayload)`

`insertPayload` spreads `pending` (which contains `cashfree_order_id`, set in
`src/pages/BookNow.tsx` line 229) and adds `payment_id`. The live `bookings`
table in `czjrlnpckeeejakcumkb` has **neither column**, so PostgREST returns:

```
Could not find the 'cashfree_order_id' column of 'bookings' in the schema cache
```

`insertErr` is truthy → `setStatus("failed")` → "Payment Failed" page. No
booking row → no realtime event → no admin beep → no history entry.

`verify-cashfree-payment` itself is fine and returns `status: "PAID"`. The
failure is strictly the booking insert.

## 1. Run this SQL in the czjrlnpckeeejakcumkb SQL Editor

```sql
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS cashfree_order_id text,
  ADD COLUMN IF NOT EXISTS payment_id text;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_cashfree_order_id_key
  ON public.bookings (cashfree_order_id)
  WHERE cashfree_order_id IS NOT NULL;
```

Safe to re-run. No duplicate columns, no realtime changes, no RLS changes.

## 2. Required secrets on czjrlnpckeeejakcumkb (already set)

- `CASHFREE_APP_ID`
- `CASHFREE_SECRET_KEY`

## 3. Edge Function `verify-cashfree-payment`

Already deployed. Updated code is in
`supabase/functions/verify-cashfree-payment/index.ts` (now includes detailed
logging — re-deploy to pick it up). `verify_jwt = false`.

## 4. After SQL is applied

Trigger a real payment. In browser console you will see:

```
[PaymentStatus] verify response JSON: { status: "PAID", payment_id: "...", ... }
[PaymentStatus] booking insert result: { inserted: { id: "..." }, insertErr: null }
```

Then: realtime fires → admin dashboard updates → beep plays → History shows
the booking → "Payment Successful / Booking Confirmed" page renders.
