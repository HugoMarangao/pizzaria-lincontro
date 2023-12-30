import React, { useContext,useState,useEffect } from 'react';
import { UseContext } from '@/hooks/useAuth';
import styles from './styles.module.scss';
import Rotas from '../Config/Rotas';
import { useRouter } from 'next/router';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import CustomModal from '../Config/Modale';
import { toast } from 'react-toastify';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

export default function ApresentacaoCarrinho() {

  const { cartItems, removeFromCart, updateQuantityInCart,isLoggedIn,user,clearCart } = useContext(UseContext);
  const total = cartItems.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  const router = useRouter();

  const stripe = useStripe();
  const elements = useElements();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item.uniqueId); // Agora usa uniqueId em vez de id
  };
  

  const handleChangeQuantity = (produtoId, quantity) => {
    updateQuantityInCart(produtoId, parseInt(quantity, 10));
  };

  const processCartItemsForOrder = (cartItems) => {
    return cartItems.map(({ imagens, ...item }) => item);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements) {
      toast.error("Stripe ainda não foi carregado. Por favor, tente novamente.");
      return;
    }
  
    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);
    
    // A seguir, você pode usar cardNumberElement para criar o paymentMethod
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,  // Use o CardNumberElement aqui
    });
    
  
    if (error) {
      console.error(error);
      if (error.type === 'validation_error') {
        toast.error("Detalhes do cartão são inválidos.");
      } else {
        toast.error("Erro ao criar o método de pagamento. Por favor, verifique os detalhes do cartão.");
      }
      return;
    }
  
    // Caso contrário, continue com a parte de processamento de pagamento
    const {id} = paymentMethod;
  
    try {
      const response = await fetch('/api/pagamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100,
          id: id  // Use o ID do paymentMethod aqui
        }), 
      });
      const responseText = await response.text();
      console.log(responseText);
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { success: false, client_secret: responseText };
      }
      console.log(data);
    if (typeof data === 'object' && data.success) { // Supondo que a resposta da API tenha uma propriedade 'success'.
        toast.success('Obrigado por fazer parte da LH WEB');
        setModalOpen(false);
        try {
          const db = getFirestore();
          const processedItems = processCartItemsForOrder(cartItems);
          await addDoc(collection(db, "pedidos"), {
            cliente: user?.nome,
            itens: processedItems,
            total: total,
            statusPgamento: "Pago",
            status: "preparando",
            data: new Date()
          });
          clearCart(); 
          router.push('/'); 
        } catch (error) {
          console.error("Erro ao salvar pedido:", error);
        }
     } else {
        toast.error('Erro no pagamento. Por favor, tente novamente.');
     }
  } catch (err) {
      console.log(err);
  }
  };
  

  return (
    <div className={styles.container}>
      <h1>Meu Carrinho</h1>
      <p style={{textAlign:"end",marginRight:10}}>preco</p>
      {cartItems.length > 0 ? (
        <div className={styles.itemsContainer}>
          {cartItems.map((item, index) => (
            <div key={index} className={styles.cartItem}>
              <div className={styles.itemImage} style={{ backgroundImage: `url(${item.imagens[0]})` }}></div>
              <div className={styles.itemDetails}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <p className={styles.itemName}>{item.nome}</p>
                  <p className={styles.itemPrice}>R$ {item.preco}</p>
                </div>
                <p >desejo: {item.desejo}</p>
                <div className={styles.itemQuantity}>
                  <p>quantidade:</p>
                <input 
                  type="number" 
                  value={item.quantidade} 
                  className={styles.itemQuantity}
                  onChange={(e) => handleChangeQuantity(item.id, e.target.value)}
                  min="1" 
                />
                <button 
                  className={styles.removeButton}
                  onClick={() => handleRemoveItem(item)}
                >
                  Remover
                </button>
                </div>
                
               
              </div>
            </div>
          ))}
          <div className={styles.total}>
            <h2>Valor Total: R$ {total.toFixed(2)}</h2>
            {isLoggedIn ? 
            <button className={styles.button} onClick={() => openModal()}>Finalizar Compra</button> : 
            <Rotas href={'/Login/logar'} >
                
                  <h1 className={styles.buttonRota}>
                    Fazer Login
                  </h1>
                
            </Rotas>
            }
          </div>
          <CustomModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
          <div className={styles.container}>
            <div className={styles.box}>
                {/* Renderizar o CardElement para coleta segura de detalhes */}
                <form className={styles.form} onSubmit={handleSubmit}>                                      
                        {/* Número do Cartão */}
                        <CardNumberElement 
                            className={`${styles.cardElement} ${styles.overlayElement}`}
                          
                        />
                                          
                        {/* Data de Validade */}
                        <CardExpiryElement 
                            className={`${styles.cardElement} ${styles.overlayElement}`}
                      
                        />
                    
                        {/* CVC */}
                        <CardCvcElement 
                            className={`${styles.cardElement} ${styles.overlayElement}`}
                            
                        />
                    
                    
                    <button type="submit" disabled={!stripe}>Pagar</button>
                </form>
            </div>
          </div>
          </CustomModal>
        </div>
      ) : (
        <div className={styles.itemsContainer}>
        <p className={styles.itemName} style={{padding:10,}}>Seu carrinho está vazio.</p>
        </div>
      )}
    </div>
  );
}
