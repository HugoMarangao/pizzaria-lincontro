import React, { useState, useEffect, useContext } from 'react';
import styles from './styles.module.scss';
import { UseContext } from '@/hooks/useAuth';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

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
       <Swiper
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
            >
        {produto.imagens.map((imagem, index) => (
          <SwiperSlide key={index}>
            <div style={{ backgroundImage: `url(${imagem})`, backgroundSize: 'cover', height: '500px', backgroundPosition:"center",borderRadius:15 }} />
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
