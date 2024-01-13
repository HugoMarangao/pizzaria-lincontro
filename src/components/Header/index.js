// components/Header.js
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';
import Rotas from '../Config/Rotas';
import { UseContext } from '@/hooks/useAuth';
import { FiUser,FiSearch } from "react-icons/fi";
import { GiShoppingBag } from "react-icons/gi";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore,collection, setDoc, doc,getDocs,addDoc,updateDoc } from "firebase/firestore";
import Link from 'next/link';
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const { user, isLoggedIn } = useContext(UseContext);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const { cartItems } = useContext(UseContext);
  

  const renderMyAccountLink = () => {
    if (isLoggedIn) {
      const dashboardPath = user && user.identifi === "admin" ? '/Login/dashboardAdmin' : '/Login/dashboardUser';
      return (
        <Rotas href={dashboardPath} active={router.pathname === dashboardPath}>
          <div style={{display:"flex", alignItems:"center",justifyContent:"center"}}>
            <FiUser size={35}/> Il Mio Account
          </div>
          
        </Rotas>
      );
    } else {
      return (
        <Rotas href="/Login/logar" active={router.pathname === '/Login/logar'}>
          <div style={{display:"flex", alignItems:"center",justifyContent:"center"}}>
            <FiUser size={35}/> Il Mio Account
          </div>
        </Rotas>
      );
    }
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    if (event.target.value) {
      // Lógica para buscar produtos, talvez utilizando debounce para melhor performance
      searchProducts(event.target.value);
    } else {
      setSearchResults([]); // Limpa os resultados se o campo de busca estiver vazio
    }
  };

  const searchProducts = async (searchTerm) => {
    const db = getFirestore();
    const productsRef = collection(db, "produtos");
    const querySnapshot = await getDocs(productsRef);
    const results = [];
    
    querySnapshot.forEach((doc) => {
      const productData = doc.data();
      // Converta os valores para minúsculo para a busca ser case-insensitive
      const productName = productData.nome?.toLowerCase() || '';
      const productCategory = productData.categoria?.toLowerCase() || '';
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
      // Verifique se o termo de busca corresponde ao nome ou à categoria do produto
      if (productName.includes(lowerCaseSearchTerm) || productCategory.includes(lowerCaseSearchTerm)) {
        results.push({ id: doc.id, ...productData });
      }
    });
  
    setSearchResults(results);
  };
  
  

  useEffect(() => {
    console.log("Estado do usuário no Header:", { isLoggedIn, user });
  }, [isLoggedIn, user]);

  const router = useRouter();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if ( currentScrollY > 10) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }

      // Passo 2
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
    <header className={`${styles.header} ${scrolling ? styles.scrolling : ''} ${scrollDirection === 'up' ? styles.showHeader : ''}`}> {/* Passo 4 */}
      <Rotas href="/" active={router.pathname === '/'}>
        <div className={styles.logo}/>
      </Rotas> 
    <div>
      <div style={{display:"flex", alignItems:"center",justifyContent:"center"}}>
        <FiSearch size={30}/>
          <input
            placeholder='Cerca prodotto'
            value={searchValue}
            onChange={handleSearchChange}
            className={styles.busca}
          />
        </div>
        
      </div>

      <div className={styles.menuIcon} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <nav className={`${styles.nav} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
      {renderMyAccountLink()}
      <Rotas href="/carrinho" active={router.pathname === '/carrinho'} >
        <div style={{display:"flex", alignItems:"center",justifyContent:"center"}}>
          <GiShoppingBag size={35}/> ({cartItems.length})
        </div>
      </Rotas>    
      </nav>
      
    </header>
    {searchValue && (
      <div className={styles.searchResults}>
            {searchResults.length > 0 ? (
              searchResults.map((product) => (
                <Link key={product.id} href={`/produto/${product.id}`} passHref>
                  <div className={styles.searchItem}>
                    <img src={product.imagens[0]} alt={product.nome} className={styles.productImage} />
                    <div>
                      <h3 className={styles.productName}>{product.nome}</h3>
                      <p className={styles.productDescription}>{product.descricao}</p>
                      <p className={styles.productPrice}>R$ {product.preco}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className={styles.searchItem}>Nessun articolo trovato</div>
            )}
          </div>
    
          )}
</>
    
  );
};

export default Header;