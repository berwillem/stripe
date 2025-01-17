const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
app.post("/charge", async (req, res) => {
  const { amount, token } = req.body;

  try {
    const charge = await stripe.charges.create({
      amount,
      currency: "usd",
      source: token.id,
      description: "Charge for test@example.com",
    });

    res.send("Payment successful");
  } catch (err) {
    console.error("Error processing payment:", err);
    let message = "An error occurred while processing your payment.";

    if (err.type === "StripeCardError") {
      message = err.message;
    }

    res.status(500).send(message);
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});
