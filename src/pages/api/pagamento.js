import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handlePayment = async (req, res) => {
    const { amount, id: paymentMethodId } = req.body;
    
    if (req.method === 'POST') {
        const { amount } = req.body;

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ statusCode: 400, message: "Invalid amount." });
        }

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'brl',
                payment_method: paymentMethodId,
                confirm: true,
                automatic_payment_methods: {
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
            if (err.type === 'StripeCardError') {
                // Tratar erros relacionados ao cartão aqui
                console.error("StripeCardError:", err.message);
            }
            res.status(500).json({ statusCode: 500, message: err.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
};

export default handlePayment;
