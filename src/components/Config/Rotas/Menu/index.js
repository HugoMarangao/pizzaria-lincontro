import React, { useContext, useState } from 'react';
import styles from './styles.module.scss';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { UseContext } from '../../../../hooks/useAuth';
import { FaHome, FaBuilding, FaQuestionCircle } from 'react-icons/fa';
import { FiLogOut, FiMenu } from 'react-icons/fi';

export default function Menu({ activeComponent, setActiveComponent }) {
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
     <h1>Benvenuto(a) {user?.nome}</h1>
     <div 
        className={`${styles.Rotas} ${activeComponent === 'principal' ? styles.active : ''}`} 
        onClick={() => setActiveComponent('principal')}
      >
        <FaHome className={styles.icon}/>
        <span>Principale</span>
      </div>
      <div 
        className={`${styles.Rotas} ${activeComponent === 'pedidos' ? styles.active : ''}`} 
        onClick={() => handleSetActiveComponent('pedidos')}
      >
        <FaBuilding className={styles.icon}/>
        <span>Ordini</span>
      </div>
      <div 
        className={`${styles.Rotas} ${activeComponent === 'suporte' ? styles.active : ''}`} 
        onClick={() => handleSetActiveComponent('suporte')}
      >
        <FaQuestionCircle className={styles.icon}/>
        <span>Supporto</span>
      </div>
      <div className={styles.logoutButton}>
        <button onClick={handleLogout}><FiLogOut/>Esci</button>
      </div>
    </div>
  );
}
