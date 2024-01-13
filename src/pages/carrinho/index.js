
import ApresentacaoCarrinho from "@/components/Carrinho";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export default function Carinho() {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STIPE);
  return (
    <>
      <Header/>
      <Elements stripe={stripePromise}>
      <ApresentacaoCarrinho/>
      </Elements>
      <Footer/>
    </>
  )
}
