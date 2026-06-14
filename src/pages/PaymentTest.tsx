import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ScrollReveal from "@/components/ScrollReveal";

const PaymentTest = () => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://czjrlnpckeeejakcumkb.supabase.co/functions/v1/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6anJsbnBja2VlZWpha2N1bWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTU3NzIsImV4cCI6MjA5MDYzMTc3Mn0.Crm8AMmEfCi-McOiX6PNwTU1qAmZ8TLYXRATZzHQmuA",
        },
        body: JSON.stringify({
          amount: 1,
          customer_phone: "9999999999",
        }),
      });

      const data = await response.json();
      console.log("Cashfree order response:", data);

      if (!response.ok || data?.error) {
        throw new Error(data.error || "Failed to create order");
      }

      if (!data?.payment_session_id) {
        throw new Error("payment_session_id missing from gateway response");
      }

      const CashfreeCtor = (window as any).Cashfree;
      if (typeof CashfreeCtor !== "function") {
        throw new Error("Cashfree SDK failed to load. Please refresh and try again.");
      }
      const cashfree = CashfreeCtor({ mode: "production" });
      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      });
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(err.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-16 section-padding">
      <div className="container mx-auto max-w-lg text-center">
        <ScrollReveal>
          <CreditCard size={48} className="mx-auto mb-6 text-brand-orange" />
          <h1 className="heading-xl mb-4">Payment Test</h1>
          <p className="subtitle mb-8">Test Cashfree payment gateway integration</p>

          <div className="card-premium p-8 mb-8">
            <p className="text-muted-foreground text-sm mb-2">Test Amount</p>
            <p className="font-display text-5xl font-bold text-brand-orange mb-6">₹1</p>
            <p className="text-muted-foreground text-xs mb-6">
              This is a test payment using Cashfree sandbox mode. No real money will be charged.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePay}
              disabled={loading}
              className="btn-premium text-lg flex items-center gap-3 mx-auto disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Pay ₹1 Test
                </>
              )}
            </motion.button>
          </div>

          <p className="text-muted-foreground text-xs">
            🔒 Sandbox mode — no real charges
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default PaymentTest;
