import styles from './styles.module.scss';
import React, {useState,useEffect} from 'react';
import { db } from '../Config/Sever/firebaseConfig';
import { IoIosSync } from 'react-icons/io'; // Importe o ícone de spinner
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRouter } from 'next/router';

export default function Catalogo() {
  const [categorias, setCategorias] = useState([]);
  const [nomesCategorias, setNomesCategorias] = useState([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(''); // Estado para a categoria selecionada

  const handleProdutoClick = (produtoId) => {
    router.push(`/produto/${produtoId}`);
  };

  const handleCategoriaClick = (nomeCategoria) => {
    if (categoriaSelecionada === nomeCategoria) {
      setCategoriaSelecionada(''); // Desmarcar a categoria se já estiver selecionada
    } else {
      setCategoriaSelecionada(nomeCategoria);
    }
  };

  useEffect(() => {
    const fetchCategoriasEProdutos = async () => {
      setIsLoading(true);
      const db = getFirestore();

      // Buscar categorias
      const categoriasSnapshot = await getDocs(collection(db, "categorias"));
      const categoriasMap = {};
      categoriasSnapshot.forEach(doc => {
        categoriasMap[doc.id] = doc.data().nome;
      });

      // Buscar produtos
      const produtosSnapshot = await getDocs(collection(db, "produtos"));
      const produtos = [];
      produtosSnapshot.forEach(doc => {
        const produtoData = doc.data();
        produtos.push({ id: doc.id, ...produtoData, categoriaNome: categoriasMap[produtoData.categoria] });
      });

      // Agrupar produtos por categoria
      const categoriasProdutos = produtos.reduce((acc, produto) => {
        const categoriaNome = produto.categoriaNome;
        acc[categoriaNome] = acc[categoriaNome] || [];
        acc[categoriaNome].push(produto);
        return acc;
      }, {});

      // Transformar o objeto em array
      const categoriasArray = Object.keys(categoriasProdutos).map(nome => {
        return { nome, produtos: categoriasProdutos[nome] };
      });

      setCategorias(categoriasArray);
      setIsLoading(false);
    };

    fetchCategoriasEProdutos();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      setIsLoading(true);
      const db = getFirestore();
  
      // Buscar categorias
      const categoriasSnapshot = await getDocs(collection(db, "categorias"));
      const categoriasFetched = [];
      categoriasSnapshot.forEach(doc => {
        categoriasFetched.push(doc.data().nome);
      });
  
      // Ordenar as categorias em ordem alfabética
      categoriasFetched.sort((a, b) => a.localeCompare(b));
  
      setNomesCategorias(categoriasFetched);
      setIsLoading(false);
    };
  
    fetchCategorias();
  }, []);
  
  
  const Spinner = () => (
    <div className={styles.spinnerContainer}>
      <IoIosSync className={styles.spinnerIcon} />
    </div>
  );


  return (
    <div className={styles.imageBanner}>
      {isLoading ? (
        <Spinner />
      ) : (
      <div className={styles.catalogoContainer}>
        <div className={styles.filtro}>
          <h1>Categorie -</h1>
          {nomesCategorias.map((nomeCategoria, index) => (
            <p key={index} onClick={() => handleCategoriaClick(nomeCategoria)}
               className={nomeCategoria === categoriaSelecionada ? styles.categoriaSelecionada : ''}>
              {nomeCategoria}
              <div className={styles.LinhacategoriaTitulo}/>
            </p>           
          ))}
          
        </div>
  
        <div className={styles.swiperContainer}>
        {categorias.filter(categoria => categoriaSelecionada === '' || categoria.nome === categoriaSelecionada).map((categoria) => (
            <div key={categoria.nome}>
              <h2 className={styles.categoriaTitulo}>{categoria.nome}</h2>
              <div className={styles.LinhacategoriaTitulo}/>
              <Swiper
                    spaceBetween={30}
                    slidesPerView={3.5}
                    breakpoints={{
                      320: { slidesPerView: 1.2, spaceBetween: 10 },
                      480: { slidesPerView: 2.2, spaceBetween: 15 },
                      768: { slidesPerView: 3.5, spaceBetween: 30 },
                    }}
                   
                    
                  >
                {categoria.produtos.map((produto) => (
                  <SwiperSlide key={produto.id} className={styles.swiperSlide} onClick={() => handleProdutoClick(produto.id)}>
                    <div className={styles.produtoBox}>
                      <div className={styles.produtoImagem} style={{ backgroundImage: `url(${produto.imagens[0]})` }}>
                      </div>
                      <div className={styles.produtoInfo}>
                      <span className={styles.produtoCodigo}>{produto.nome}</span>
                        <h2 className={styles.produtoNome}>{produto.descricao}</h2>
                        <span className={styles.produtoPreco}>{produto.preco}€</span>
                        
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
  
}
