const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/portal", async (req, res) => {
  const { customerId } = req.body;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.PUBLIC_BASE_URL}/billing.html`
  });

  res.json({ url: session.url });
});

module.exports = router;
