// CheckoutForm.jsx

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const backendUrl = import.meta.env.VITE_STRIPE_PK_AIRCODE_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    // Create a token with card details
    const cardElement = elements.getElement(CardElement);
    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    const price = 15;

    // Send token and payment data to backend
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: price * 100,
        token,
        email: emailInput,
      }),
    });

    if (res.ok) {
      setErrorMessage("Payment successful!");
    } else {
      const { message } = await res.json();
      setErrorMessage(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4">
      <div className="mb-3">
        <label htmlFor="email-input">Email</label>
        <div>
          <input
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            type="email"
            id="email-input"
            placeholder="johndoe@gmail.com"
          />
        </div>
      </div>
      <CardElement />
      <button type="submit" disabled={!stripe || !elements}>
        Pay
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};
