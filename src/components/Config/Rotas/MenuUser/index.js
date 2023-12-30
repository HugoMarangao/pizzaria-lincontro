import React, { useContext,useState } from 'react';
import styles from './styles.module.scss';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { UseContext } from '../../../../hooks/useAuth';
import { FaHome, FaBuilding, FaQuestionCircle, } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

export default function MenuUser({ activeComponent,setActiveComponent }) {
  const authInstance = getAuth();
  const router = useRouter();
  const { user } = useContext(UseContext);
  

  const handleSetActiveComponent = (component) => {
    setActiveComponent(component);
  };
  
  const handleLogout = async () => {
    try {
      await signOut(authInstance);
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
     <h1>Seja Bem-vindo(a) {user?.nome}</h1>
     <div 
        className={`${styles.Rotas} ${activeComponent === 'principal' ? styles.active : ''}`} 
        onClick={() => setActiveComponent('principal')}
      >
        <FaHome className={styles.icon}/>
        <span>Principal</span>
      </div>
      <div 
        className={`${styles.Rotas} ${activeComponent === 'pedidos' ? styles.active : ''}`} 
        onClick={() => handleSetActiveComponent('pedidos')}
      >
        <FaBuilding className={styles.icon}/>
        <span>Pedidos</span>
      </div>
      <div 
        className={`${styles.Rotas} ${activeComponent === 'suporte' ? styles.active : ''}`} 
        onClick={() => handleSetActiveComponent('suporte')}
      >
        <FaQuestionCircle className={styles.icon}/>
        <span>Suporte</span>
      </div>
      <div className={styles.logoutButton}>
        <button onClick={handleLogout}><FiLogOut/>Logout</button>
      </div>
    </div>
  );
}
