const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.secret);
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const app = express();
app.use(cors({ origin: true }));

app.post("/create-price", async (req, res) => {
  try {
    const productId = req.body.product_id;
    const currency = req.body.currency;
    const unitAmount = req.body.unit_amount;

    const newPrice = await stripe.prices.create({
      product: productId,
      currency: currency,
      unit_amount: unitAmount,
    });

    // Update Firestore document with the new price ID
    const docRef = admin.firestore().collection("stripePrices").doc(productId);
    await docRef.set({ price_id: newPrice.id }, { merge: true });

    res.status(200).send({ price: newPrice });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

exports.api = functions.https.onRequest(app);
