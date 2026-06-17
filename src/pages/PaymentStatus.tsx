import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Clock } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { PENDING_BOOKING_KEY } from "@/pages/BookNow";

const SUPABASE_FN_URL = "https://czjrlnpckeeejakcumkb.supabase.co/functions/v1";
const SUPABASE_FN_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6anJsbnBja2VlZWpha2N1bWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTU3NzIsImV4cCI6MjA5MDYzMTc3Mn0.Crm8AMmEfCi-McOiX6PNwTU1qAmZ8TLYXRATZzHQmuA";

type Status = "loading" | "success" | "failed" | "pending";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const run = async () => {
      if (!orderId) {
        setStatus("failed");
        setErrorMsg("Missing order id");
        return;
      }

      try {
        // 1. Verify payment server-side
        const res = await fetch(`${SUPABASE_FN_URL}/verify-cashfree-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_FN_ANON}`,
          },
          body: JSON.stringify({ order_id: orderId }),
        });
        const data = await res.json();
        console.log("Verify response:", data);

        if (!res.ok) {
          setStatus("failed");
          setErrorMsg(data?.error || "Could not verify payment");
          return;
        }

        if (data.status === "PENDING") {
          setStatus("pending");
          return;
        }

        if (data.status !== "PAID") {
          setStatus("failed");
          setErrorMsg("Payment was not successful");
          // Clean up any pending booking — slot must NOT be blocked
          sessionStorage.removeItem(PENDING_BOOKING_KEY);
          return;
        }

        // 2. Payment verified PAID → create booking now (idempotent)
        const raw = sessionStorage.getItem(PENDING_BOOKING_KEY);
        if (!raw) {
          // Already created on a previous visit, just succeed
          setStatus("success");
          return;
        }
        const pending = JSON.parse(raw);
        setBookingDetails(pending);

        // Guard against duplicates by Cashfree order id
        if (pending.cashfree_order_id) {
          const { data: existing } = await (supabase as any)
            .from("bookings")
            .select("id")
            .eq("cashfree_order_id", pending.cashfree_order_id)
            .maybeSingle();
          if (existing?.id) {
            setBookingId(existing.id);
            setStatus("success");
            sessionStorage.removeItem(PENDING_BOOKING_KEY);
            return;
          }
        }

        // Final conflict re-check
        const [{ data: blocked }, { data: clash }] = await Promise.all([
          supabase
            .from("blocked_slots")
            .select("id")
            .eq("date", pending.date)
            .eq("time", pending.time)
            .maybeSingle(),
          supabase
            .from("bookings")
            .select("id")
            .eq("date", pending.date)
            .eq("time", pending.time)
            .eq("cabin", pending.cabin)
            .maybeSingle(),
        ]);
        if (blocked || clash) {
          setStatus("failed");
          setErrorMsg(
            "Your payment went through but the slot was just taken. Please contact us for a refund or rebooking."
          );
          return;
        }

        const insertPayload: Record<string, any> = {
          ...pending,
          payment_status: "paid",
          payment_id: data.payment_id || null,
        };

        const { data: inserted, error: insertErr } = await supabase
          .from("bookings")
          .insert(insertPayload as any)
          .select("id")
          .single();

        if (insertErr) {
          console.error("Booking insert failed:", insertErr);
          setStatus("failed");
          setErrorMsg(insertErr.message);
          return;
        }

        sessionStorage.removeItem(PENDING_BOOKING_KEY);
        setBookingId(inserted?.id || null);
        setStatus("success");
      } catch (err: any) {
        console.error(err);
        setStatus("failed");
        setErrorMsg(err?.message || "Unexpected error");
      }
    };

    run();
  }, [orderId]);

  return (
    <div className="pt-28 pb-16 section-padding">
      <div className="container mx-auto max-w-lg text-center">
        <ScrollReveal>
          {status === "loading" && (
            <div>
              <Loader2 size={48} className="mx-auto mb-6 text-brand-orange animate-spin" />
              <h1 className="heading-xl mb-4">Verifying Payment...</h1>
              <p className="subtitle">Please wait while we confirm your payment</p>
            </div>
          )}

          {status === "pending" && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <Clock size={64} className="mx-auto mb-6 text-amber-400" />
              <h1 className="heading-xl mb-4">Payment Pending</h1>
              <p className="subtitle mb-6">
                Your payment is still being processed. Your booking will be confirmed once payment
                is received.
              </p>
              {orderId && (
                <div className="card-premium p-6 mb-8">
                  <p className="text-muted-foreground text-sm mb-1">Order ID</p>
                  <p className="font-display text-lg font-bold text-brand-orange tracking-wider">
                    {orderId}
                  </p>
                </div>
              )}
              <Link to="/history" className="btn-premium inline-flex items-center gap-2 text-lg">
                View My Bookings
              </Link>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <CheckCircle size={64} className="mx-auto mb-6 text-green-500" />
              <h1 className="heading-xl mb-4">Payment Successful ✅</h1>
              <p className="subtitle mb-6">Your booking has been confirmed!</p>
              {bookingId && (
                <div className="card-premium p-6 mb-4">
                  <p className="text-muted-foreground text-sm mb-1">Entry Number</p>
                  <p className="font-display text-lg font-bold text-brand-orange tracking-wider">
                    {bookingId.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              )}
              {orderId && (
                <div className="card-premium p-6 mb-8">
                  <p className="text-muted-foreground text-sm mb-1">Order ID</p>
                  <p className="font-display text-lg font-bold text-brand-orange tracking-wider">
                    {orderId}
                  </p>
                </div>
              )}
              <Link to="/" className="btn-premium inline-flex items-center gap-2 text-lg">
                Back to Home
              </Link>
            </motion.div>
          )}

          {status === "failed" && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <XCircle size={64} className="mx-auto mb-6 text-red-500" />
              <h1 className="heading-xl mb-4">Payment Failed ❌</h1>
              <p className="subtitle mb-2">
                {errorMsg || "Something went wrong with your payment."}
              </p>
              <p className="text-muted-foreground text-sm mb-6">
                No booking was created. You can safely try again.
              </p>
              <Link to="/book" className="btn-premium inline-flex items-center gap-2 text-lg">
                Try Again
              </Link>
            </motion.div>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
};

export default PaymentStatus;
