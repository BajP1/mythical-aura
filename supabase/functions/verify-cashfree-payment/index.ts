const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// LIVE Cashfree endpoint
const CASHFREE_API = "https://api.cashfree.com/pg/orders";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const orderId = body.order_id;

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "Missing order_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const appId = Deno.env.get("CASHFREE_APP_ID");
    const secretKey = Deno.env.get("CASHFREE_SECRET_KEY");
    if (!appId || !secretKey) {
      return new Response(
        JSON.stringify({ error: "Cashfree credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch order
    const orderRes = await fetch(`${CASHFREE_API}/${orderId}`, {
      method: "GET",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
      },
    });
    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      console.error("Cashfree order fetch error:", orderData);
      return new Response(
        JSON.stringify({ error: orderData.message || "Failed to fetch order", status: "FAILED" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch payments to grab a payment id when available
    let paymentId: string | null = null;
    try {
      const payRes = await fetch(`${CASHFREE_API}/${orderId}/payments`, {
        method: "GET",
        headers: {
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "x-api-version": "2023-08-01",
        },
      });
      if (payRes.ok) {
        const payments = await payRes.json();
        if (Array.isArray(payments) && payments.length > 0) {
          const success = payments.find((p: any) => p.payment_status === "SUCCESS") || payments[0];
          paymentId = success?.cf_payment_id ? String(success.cf_payment_id) : (success?.payment_id || null);
        }
      }
    } catch (e) {
      console.warn("Payments fetch failed:", e);
    }

    // Normalise status -> PAID | PENDING | FAILED
    const raw = (orderData.order_status || "").toString().toUpperCase();
    let status: "PAID" | "PENDING" | "FAILED";
    if (raw === "PAID") status = "PAID";
    else if (raw === "ACTIVE" || raw === "PENDING") status = "PENDING";
    else status = "FAILED";

    return new Response(
      JSON.stringify({
        status,
        order_id: orderData.order_id,
        order_status: orderData.order_status,
        order_amount: orderData.order_amount,
        payment_id: paymentId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Verify error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Internal server error", status: "FAILED" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
