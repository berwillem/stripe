import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "../src/components/CheckouForm";

const options = {
  mode: "payment",
  amount: 1099,
  currency: "usd",
};

const App = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

  return (
    <div className="flex container mt-8">
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default App;
