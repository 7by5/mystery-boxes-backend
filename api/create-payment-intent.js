import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { boxes } = req.body || {};

    if (!Array.isArray(boxes) || boxes.length < 1) {
      return res.status(400).json({ error: "No boxes selected" });
    }

    const PRICE_USD = 3;
    const amount = boxes.length * PRICE_USD * 100; // cents

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { boxes: boxes.join(",") },
    });

    return res.status(200).json({ clientSecret: intent.client_secret });
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}
