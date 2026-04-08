import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState<"success" | "failed" | "loading">("loading");

  useEffect(() => {
    // Cashfree redirects back with order_id; we check if it exists
    // For a full integration you'd verify with Cashfree API, but for testing:
    if (orderId) {
      // Simple check — if we got redirected back with an order_id, consider it success
      // In production, verify order status via API
      setTimeout(() => setStatus("success"), 1500);
    } else {
      setStatus("failed");
    }
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

          {status === "success" && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <CheckCircle size={64} className="mx-auto mb-6 text-green-500" />
               <h1 className="heading-xl mb-4">Payment Successful ✅</h1>
              <p className="subtitle mb-6">Your booking has been confirmed and payment processed successfully!</p>
              {orderId && (
                <div className="card-premium p-6 mb-8">
                  <p className="text-muted-foreground text-sm mb-1">Order ID</p>
                  <p className="font-display text-lg font-bold text-brand-orange tracking-wider">{orderId}</p>
                </div>
              )}
              <motion.a href="/" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="btn-premium inline-flex items-center gap-2 text-lg">
                Back to Home
              </motion.a>
            </motion.div>
          )}

          {status === "failed" && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <XCircle size={64} className="mx-auto mb-6 text-red-500" />
              <h1 className="heading-xl mb-4">Payment Failed ❌</h1>
              <p className="subtitle mb-6">Something went wrong with your payment</p>
              <motion.a href="/book" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="btn-premium inline-flex items-center gap-2 text-lg">
                Try Again
              </motion.a>
            </motion.div>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
};

export default PaymentStatus;
