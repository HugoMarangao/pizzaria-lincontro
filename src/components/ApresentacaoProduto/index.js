import React, { useState, useEffect, useContext } from 'react';
import styles from './styles.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { UseContext } from '@/hooks/useAuth';
import 'swiper/css';

const ApresentacaoProduto = ({ produto,onAddToCart }) => {
    const { addToCart } = useContext(UseContext);
    const [quantidade, setQuantidade] = useState(1);
    const [desejo, setDesejo] = useState("");

    if (!produto) return <div>Carregando...</div>;
  
    const handleAddToCart = () => {
        addToCart(produto, quantidade, desejo);
    };

  return (
    <div className={styles.apresentacaoProduto}>
      <Swiper autoplay={true} spaceBetween={30} slidesPerView={1}>
        {produto.imagens.map((imagem, index) => (
          <SwiperSlide key={index}>
            <div style={{ backgroundImage: `url(${imagem})`, backgroundSize: 'cover', height: '500px', backgroundPosition:"center" }} />
          </SwiperSlide>
        ))}
      </Swiper>
      <h1 className={styles.NomeProduto}>{produto.nome}</h1>
      <h2 className={styles.DescricaoProduto}>{produto.descricao}</h2>
      <p className={styles.precoProduto}>{produto.preco}€</p>
      <textarea
                className={styles.textarea}
                placeholder="osservazioni" 
                value={desejo}
                onChange={(e) => setDesejo(e.target.value)}
     ></textarea>
      <div>
        <input 
          className={styles.inputNumber}
          type="number" 
          value={quantidade} 
          onChange={(e) => setQuantidade(e.target.value)} 
          min="1"
        />
        <button  className={styles.button} onClick={handleAddToCart}>Aggiungi al Carrello</button>
      </div>
    </div>
  );
};

export default ApresentacaoProduto;
