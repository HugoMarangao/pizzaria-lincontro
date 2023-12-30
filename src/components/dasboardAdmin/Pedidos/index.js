import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Rotas from '../../Config/Rotas';
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import CustomModal from '@/components/Config/Modale';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pedidosPerPage] = useState(10);
  const db = getFirestore();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      const querySnapshot = await getDocs(collection(db, "pedidos"));
      const pedidosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPedidos(pedidosData);
    };
    fetchPedidos();
  }, []);

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
                <th>ID Ordine</th>
                <th>Cliente</th>
                <th>Indirizzo</th>
                <th>Totale</th>
                <th>Stato</th>
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
                      <option value="preparazione">In Preparazione</option>
                      <option value="pronto">Pronto</option>
                      <option value="inviato">Inviato</option>
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
                  <th>Quantità</th>
                  <th>Desiderio</th>
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
          <h1>Uscire</h1>
        </div>
      </Rotas>
    </div>
  );
}
