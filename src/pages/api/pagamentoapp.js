import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handlePaymentapp = async (req, res) => {
    const { amount, paymentMethodId } = req.body;
    
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ statusCode: 400, message: "Invalid amount." });
    }

    try {
        // Ajusta a criação do PaymentIntent aqui
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount , // Garantir que o amount seja em centavos
            currency: 'brl',
            payment_method: paymentMethodId,
            confirm: true, // Tenta confirmar o pagamento imediatamente
            automatic_payment_methods: { // Configuração sugerida pelo erro
                enabled: true,
                allow_redirects: "never"
            },
        });
        
        res.status(200).json({ 
            success: true, 
            message: 'Pagamento efetuado com sucesso.', 
            client_secret: paymentIntent.client_secret 
        });
    } catch (err) {
        console.error("Erro ao processar o pagamento:", err.message);
        res.status(500).json({ statusCode: 500, message: err.message });
    }
};


export default handlePaymentapp;
