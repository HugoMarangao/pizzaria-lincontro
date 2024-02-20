import React, { useState, useEffect, useContext } from 'react';
import { UseContext } from '@/hooks/useAuth';
import { db } from '@/components/Config/Sever/firebaseConfig';
import { collection, addDoc, query, onSnapshot, orderBy, where } from 'firebase/firestore';
import styles from './styles.module.scss';

export default function Suporte() {
    const { user } = useContext(UseContext);
    const [mensagem, setMensagem] = useState('');
    const [mensagens, setMensagens] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [mensagensNaoVistas, setMensagensNaoVistas] = useState({});

    // UseEffect para carregar todas as mensagens ordenadas por timestamp
    useEffect(() => {
        const q = query(collection(db, "mensagens"), orderBy("timestamp"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setMensagens(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, []);

    // UseEffect para carregar todos os usuários
    useEffect(() => {
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const usersArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsuarios(usersArray);
        });

        return () => unsubscribe();
    }, []);

    // UseEffect para contar mensagens não vistas
    useEffect(() => {
        if (user.identifi) {
            const qMensagensNaoVistas = query(
                collection(db, "mensagens"),
                where("vistoPorAdmin", "==", false),
                where("para", "in", [user.identifi, "admin"])
            );
            const unsubscribeMensagensNaoVistas = onSnapshot(qMensagensNaoVistas, (querySnapshot) => {
                const mensagensPorUsuario = {};
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.para === user.identifi) {
                        mensagensPorUsuario[data.enviadoPor] = (mensagensPorUsuario[data.enviadoPor] || 0) + 1;
                    } else {
                        mensagensPorUsuario["admin"] = 1;
                    }
                });
                setMensagensNaoVistas(mensagensPorUsuario);
            });

            return () => unsubscribeMensagensNaoVistas();
        }
    }, [user.identifi]);

    // UseEffect para carregar mensagens baseadas no clienteSelecionado
    useEffect(() => {
        if (clienteSelecionado) {
            const q = query(collection(db, "mensagens"), orderBy("timestamp"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                setMensagens(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(msg => (msg.enviadoPor === user.identifi && msg.para === clienteSelecionado) ||
                        (msg.para === user.identifi && msg.enviadoPor === clienteSelecionado)));
            });

            return () => unsubscribe();
        } else {
            // Se nenhum cliente for selecionado, carregue todas as mensagens
            const q = query(collection(db, "mensagens"), orderBy("timestamp"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                setMensagens(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });

            return () => unsubscribe();
        }
    }, [clienteSelecionado, user.identifi]);

    const enviarMensagem = async (e) => {
        e.preventDefault();
        if (mensagem.trim() === '') return;
    
        const mensagemData = {
            texto: mensagem,
            enviadoPor: user.identifi,
            para: clienteSelecionado || 'admin', // Use o clienteSelecionado ou 'admin' como destinatário
            timestamp: new Date()
        };
    
        await addDoc(collection(db, "mensagens"), mensagemData);
        setMensagem('');
    };
    
    return (
        <div className={styles.container}>
            {user.identifi === 'admin' && (
                    <div className={styles.listaClientes}>
                        {usuarios.map(usuario => (
                            <div
                                key={usuario.id}
                                onClick={() => setClienteSelecionado(usuario.id)}
                                className={`${styles.cliente} ${clienteSelecionado === usuario.id ? styles.clienteSelecionado : ''}`}
                            >
                                {usuario.nome}
                                {mensagensNaoVistas[usuario.id] && (
                                    <span className={styles.alertaMensagens}>
                                        {mensagensNaoVistas[usuario.id]} nova(s)
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            <div className={styles.chatContainer}>
                

                <div className={styles.mensagens}>
                    {mensagens.map((msg) => (
                        <div key={msg.id} className={msg.enviadoPor === user.identifi ? styles.minhaMensagem : styles.suaMensagem}>
                            {msg.texto}
                        </div>
                    ))}
                </div>
                <form onSubmit={enviarMensagem} className={styles.formMensagem}>
                    <input
                        type="text"
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        placeholder="Escreva uma mensagem..."
                    />
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </div>
    );
}
