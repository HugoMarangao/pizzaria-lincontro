import React, { useEffect, useState,useContext } from 'react';
import styles from './styles.module.scss';
import Rotas from '../../Config/Rotas';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import CustomModal from '@/components/Config/Modale';
import { UseContext } from '@/hooks/useAuth';

export default function PedidosUser() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pedidosPerPage] = useState(10);
  const db = getFirestore();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const { user } = useContext(UseContext);
  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      if (user) {
        // Construir uma query que filtra os pedidos pelo nome do cliente
        const pedidosRef = collection(db, "pedidos");
        const q = query(pedidosRef, where("cliente", "==", user.nome)); // Assume que o nome do cliente está armazenado em user.nome
        const querySnapshot = await getDocs(q);
        const pedidosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPedidos(pedidosData);
      }
    };

    if (user && user.nome) { // Verifica se o usuário está logado e se o nome está disponível
      fetchPedidos();
    }
  }, [user]); // Dependência: usuário logado

  const atualizarStatus = async (pedidoId, novoStatus) => {
    const pedidoRef = doc(db, "pedidos", pedidoId);
    await updateDoc(pedidoRef, { status: novoStatus });
    setPedidos(pedidos.map(pedido => 
      pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
    ));
  };
// Evento de clique para selecionar um pedido e mostrar seus itens
const selecionarPedido = (pedido) => {
  setPedidoSelecionado(pedido);
  openModal();
};
  // Determina os pedidos para a página atual
  const indexOfLastPedido = (currentPage + 1) * pedidosPerPage;
  const indexOfFirstPedido = indexOfLastPedido - pedidosPerPage;
  const currentPedidos = pedidos.slice(indexOfFirstPedido, indexOfLastPedido);

  // Altera a página atual
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      <div className={styles.box1}>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>ID do Pedido</th>
                <th>Cliente</th>
                <th>Endereço</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentPedidos.map((pedido) => (
                <tr key={pedido.id} onClick={() => selecionarPedido(pedido)}>
                  <td>{pedido.id}</td>
                  <td>{pedido.cliente}</td>
                  <td>{pedido.endereco}</td>
                  <td>R$ {pedido.total}</td>
                  <td>
                    <select 
                      className="statusSelect" 
                      value={pedido.status} 
                      onChange={(e) => atualizarStatus(pedido.id, e.target.value)}
                    >
                      <option value="preparando">Preparando</option>
                      <option value="pronto">Pronto</option>
                      <option value="enviado">Enviado</option>
                    </select>
                  </td>
                </tr>
                
              ))}
              
            </tbody>
          </table>
        </div>
        <CustomModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
        {pedidoSelecionado && (
          <div className={styles.tableContainer}>
            <h3>Itens do Pedido</h3>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Quantidade</th>
                  <th>Desejo</th>
                </tr>
              </thead>
              <tbody>
                {pedidoSelecionado.itens.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nome}</td>
                    <td>{item.quantidade}</td>
                    <td>{item.desejo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CustomModal>
        <div className={styles.pagination}>
          {Array.from(Array(Math.ceil(pedidos.length / pedidosPerPage)), (item, index) => {
            return (
              <button 
                key={index} 
                onClick={() => paginate(index)}
                className={currentPage === index ? styles.active : ''}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
      <Rotas href={'/'}>
        <div className={styles.retornar}>
          <h1>Sair</h1>
        </div>
      </Rotas>
    </div>
  );
}
