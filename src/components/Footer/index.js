// components/Header.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';
import Rotas from '../Config/Rotas';
import { AiFillFacebook,AiOutlineInstagram,AiOutlineYoutube } from 'react-icons/ai';

const Footer = () => {
  const router = useRouter();
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleMouseEnter = (iconName) => {
    setHoveredIcon(iconName);
  }

  const handleMouseLeave = () => {
    setHoveredIcon(null);
  }
  return (
    <div className={styles.container}>
      <div className={styles.chamada}>
        <h1>Cresci con noi</h1>
      </div>
      <div className={styles.bottomrow}>
      <div className={styles.links}>
       
        <div className={styles.logo}/>
        <Rotas href="/" active={router.pathname === '/'}>
          inizio
        </Rotas>
        <Rotas href="/Produtos" active={router.pathname === "/Produtos"}>
          Il mio Account
        </Rotas>
        <Rotas href="/SobreNois" active={router.pathname === "/SobreNois"}>
          Carrelo
        </Rotas>
              
      </div>
      <div className={styles.menu}>
        <div className={styles.icons}>
        <button><AiOutlineInstagram 
        size={35} 
        color={hoveredIcon === 'instagram' ? '#f47200' : '#fff'} 
        onMouseEnter={() => handleMouseEnter('instagram')}
        onMouseLeave={handleMouseLeave}
      />
      </button>
      <button>
        <AiFillFacebook 
          size={35} 
          color={hoveredIcon === 'facebook' ? '#f47200' : '#fff'} 
          onMouseEnter={() => handleMouseEnter('facebook')}
          onMouseLeave={handleMouseLeave}
        />
      </button>
      <button>
      <AiOutlineYoutube 
        size={35} 
        color={hoveredIcon === 'youtube' ? '#f47200' : '#fff'} 
        onMouseEnter={() => handleMouseEnter('youtube')}
        onMouseLeave={handleMouseLeave}
      />
      </button>
        </div>
        <Rotas href="/port" active={router.pathname === "/port"}>
          termini di utilizzo
        </Rotas>
        <Rotas href="/contati" active={router.pathname === "/contati"}>
         politica della privacy
        </Rotas>   
      </div>
      </div>
      <div className={styles.bol}>
          <h1>lhweb51@gmail.com</h1>
      </div>
    </div>
  );
};

export default Footer;