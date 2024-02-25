import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from "firebase/firestore";
import { db } from '../components/Config/Sever/firebaseConfig';
// Crie o contexto do usuário logado
export const UseContext = React.createContext({
  isLoggedIn: false, 
  user: null, 
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {}
});


// Crie um componente de provedor que envolve a aplicação
export const UseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);


  const addToCart = (produto, quantidade, desejo) => {
    const novoItem = {
      ...produto,
      quantidade,
      desejo,
      uniqueId: Date.now() + Math.random() // Cria um ID único para cada item
    };
    setCartItems(currentItems => [...currentItems, novoItem]);
  };
  

  const updateQuantityInCart = (produtoId, quantidade) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === produtoId ? { ...item, quantidade: parseInt(quantidade, 10) } : item
      )
    );
  };
  
  const clearCart = () => {
    setCartItems([]); // Isso esvazia o carrinho
  };

  const removeFromCart = (uniqueId) => {
    setCartItems(currentItems => currentItems.filter(item => item.uniqueId !== uniqueId));
  };
  

  const authInstance = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("Usuário logado detectado:", firebaseUser);
        // Usuário está logado, pegue as informações do usuário do Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          // Atualize o estado do usuário com as informações do Firestore
          setUser({
            ...userDoc.data(), // Dados do documento Firestore
            uid: firebaseUser.uid // Certifique-se de incluir o UID aqui!
          });
        } else {
          console.log("Usuário não está logado");
          // Handle the case where the document does not exist
          console.log("No such document!");
        }
      } else {
        // Usuário não está logado, limpe o estado do usuário
        setUser(null);
      }
      setIsLoggedIn(!!firebaseUser);
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UseContext.Provider value={{ user, isLoggedIn, cartItems, addToCart, removeFromCart,updateQuantityInCart,clearCart }}>
      {children}
    </UseContext.Provider>
  );
};
