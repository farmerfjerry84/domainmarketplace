const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { loadListingsHealed } = require("../reflection");

router.post("/checkout", async (req, res) => {
  try {
    const { id } = req.body;
    const listings = loadListingsHealed();
    const item = listings.find(l => l.id === id);

    if (!item) return res.status(404).json({ error: "Listing not found" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Domain: ${item.domain}` },
            unit_amount: Math.round(item.price * 100)
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.PUBLIC_BASE_URL}/success.html?domain=${item.domain}`,
      cancel_url: `${process.env.PUBLIC_BASE_URL}/cancel.html?domain=${item.domain}`
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
});

module.exports = router;
