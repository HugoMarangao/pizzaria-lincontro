import React, { useState, useContext,useEffect } from 'react';
import { UseContext } from '@/hooks/useAuth'; // Substitua pelo caminho correto até o seu hook de contexto
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import styles from './styles.module.scss';
import Rotas from '../../Config/Rotas';
import { toast } from 'react-toastify';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export default function PrincipalUser() {
  const db = getFirestore();
  const { user } = useContext(UseContext); // Obtenha o usuário logado do seu contexto
  const [name, setName] = useState(user?.nome || '');
  const [phone, setPhone] = useState(user?.telefone || '');
  const [address, setAddress] = useState(user?.endereco || '');

  const updateUser = async () => {
    // Use 'user.identifi' se esta for a propriedade que contém o UID do usuário
    const userRef = doc(db, "users", user.uid);
    
    if (!user.identifi) {
      console.error("UID do usuário é undefined");
      toast.error("Erro interno. UID do usuário não encontrado.");
      return;
    }
  
    try {
      await updateDoc(userRef, {
        nome: name,
        telefone: phone,
        endereco: address
      });
      toast.success("Informações atualizadas com sucesso!");
    } catch (error) {
      toast.error("Falha ao atualizar informações. Tente novamente.");
      console.error("Erro ao atualizar usuário: ", error);
    }
  };
  useEffect(() => {
    // Certifique-se de que o usuário está logado
    if (user) {
      // Inicializar o Firebase Messaging e obter o token
      const messaging = getMessaging();
      getToken(messaging, { vapidKey: 'BCvHkj-SwXmLLVEQjHYnumfK46nLpA_DBddolD-k3pQfIOi0e-phTb93NeF5Vxiw31tlJcqp3YJcvEWG64D2RX8' }) // Substitua 'your-vapid-key' com sua chave VAPID
        .then((currentToken) => {
          if (currentToken) {
            console.log('Token de notificação:', currentToken);
            // Salvar o token no Firestore
            saveTokenToFirestore(user.uid, user.nome, currentToken);
          } else {
            console.log('Nenhum token disponível. Solicite permissão para gerar um.');
          }
        }).catch((err) => {
          console.log('Erro ao obter o token', err);
        });

      // Ouvir mensagens enquanto a aplicação está aberta
      onMessage(messaging, (payload) => {
        console.log('Mensagem recebida!', payload);
        // Tratar a mensagem recebida
      });
    }
  }, [user]);

  const saveTokenToFirestore = async (uid, nome, token) => {
    try {
      const userRef = doc(getFirestore(), "users", uid);
      await updateDoc(userRef, {
        notificationToken: token,
        nome: nome // Supondo que o nome do usuário já está no documento e não mudou
      });
      toast.success("Token de notificação salvo com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar o token de notificação.");
      console.error("Erro ao atualizar o documento do usuário:", error);
    }
  };

  return (
    <div className={styles.container}>
    <div className={styles.box}>
      <h2 className={styles.title}>Atualize suas Informações</h2>
      <div className={styles.inputGroup}>
        <input
          className={styles.input}
          type="text"
          placeholder="Digite seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={styles.input}
          type="tel"
          placeholder="Digite seu telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Digite seu endereço"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <button className={styles.button} onClick={updateUser}>Salvar Alterações</button>
    </div>
    
    <Rotas href={'/'}>
        <div className={styles.retornar}>
          <h1>Sair</h1>
        </div>
    </Rotas>
  </div>
);
}
