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
      const { data, error } = await supabase.functions.invoke("create-cashfree-order", {
        body: {
          amount: 1,
          customerName: "Test User",
          customerEmail: "test@example.com",
          customerPhone: "9876543210",
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.payment_session_id) {
        // Redirect to Cashfree hosted checkout
        const checkoutUrl = `https://sandbox.cashfree.com/pg/orders/sessions/${data.payment_session_id}`;
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No payment session received");
      }
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
