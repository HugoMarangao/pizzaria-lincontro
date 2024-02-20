import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Rotas from '../../Config/Rotas';
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import CustomModal from '@/components/Config/Modale';
import { toast } from 'react-toastify';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [produtosPerPage] = useState(10);
  const db = getFirestore();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  

  const editarProduto = (produto) => {
    // Esta linha prepara o conteúdo da modal com o ProdutoForm, passando o produto e setModalOpen corretamente
    setModalContent(<ProdutoForm produto={produto} setModalOpen={setModalOpen} />);
    setModalOpen(true);
  };
  
  
  
  const deletarProduto = async (id) => {
    await deleteDoc(doc(db, "produtos", id));
    // Atualiza a lista de produtos após a exclusão
    setProdutos(produtos.filter((produto) => produto.id !== id));
  };

  useEffect(() => {
    const fetchprodutos = async () => {
      const querySnapshot = await getDocs(collection(db, "produtos"));
      const produtosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProdutos(produtosData);
    };

    fetchprodutos();
  }, []);

  const indexOfLastProduto = (currentPage + 1) * produtosPerPage;
  const indexOfFirstProduto = indexOfLastProduto - produtosPerPage;
  const currentprodutos = produtos.slice(indexOfFirstProduto, indexOfLastProduto);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      <div className={styles.box1}>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>ID Produtti</th>
                <th>Nome</th>
                <th>Descrizione</th>
                <th>Prezzo</th>
                <th>Modifica</th>
                <th>Elimina</th>
              </tr>
            </thead>
            <tbody>
              {currentprodutos.map((produto) => (
                <tr key={produto.id} >
                  <td>{produto.id}</td>
                  <td>{produto.nome}</td>
                  <td>{produto.descricao}</td>
                  <td>€ {produto.preco}</td>
                  <td>
                    <button onClick={() => editarProduto(produto)}>Modifica</button>
                  </td>
                  <td>
                    <button onClick={() => deletarProduto(produto.id)}>Elimina</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
          {Array.from(Array(Math.ceil(produtos.length / produtosPerPage)), (item, index) => {
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
      <CustomModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
  {modalContent}
</CustomModal>

    </div>
  );

  
}
const ProdutoForm = ({ produto, setModalOpen  }) => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagens, setImagens] = useState([]);
  useEffect(() => {
    if (produto) { // Verifique se `produto` não é null ou undefined
      setCategorias([...categorias, produto.categoria]);
      setCategoriaSelecionada(produto.categoria);
      setNomeProduto(produto.nome);
      setPreco(produto.preco);
      setDescricao(produto.descricao);
      setImagens(produto.imagens); // Certifique-se de ajustar isso conforme necessário
    }
  }, [produto]);
  const db = getFirestore();
  useEffect(() => {
    const fetchCategorias = async () => {
      
      const querySnapshot = await getDocs(collection(db, "categorias"));
      const categoriasFetched = [];
      querySnapshot.forEach((doc) => {
        categoriasFetched.push({ id: doc.id, ...doc.data() });
      });
      setCategorias(categoriasFetched);
    };

    fetchCategorias();
  }, []);

  const handleImageChange = (event) => {
    setImagens([...event.target.files]);
  };
  
  const handleSave = async () => {
    if (!nomeProduto || !preco || imagens.length === 0) {
      toast.error("Preencha todos os campos e selecione pelo menos uma imagem.");
      return;
    }
  
    try {
      // Atualizar produto existente
      if (produto && produto.id) {
        const produtoRef = doc(db, "produtos", produto.id);
        await updateDoc(produtoRef, {
          nome: nomeProduto,
          preco,
          categoria: categoriaSelecionada,
          descricao
          // imagens: imageUrls, // Assumindo que você vai lidar com as imagens separadamente
        });
  
        // Supondo que você tenha uma lógica separada para lidar com imagens
        // Aqui você faria o upload das novas imagens e atualizaria o documento com as novas URLs das imagens
  
        toast.success("Produto atualizado com sucesso!");
      } else {
        // Este bloco não deveria ser necessário se estamos apenas editando produtos existentes
        console.error("Produto não possui ID. Ação de edição não pode ser concluída.");
      }
  
      setModalOpen(false); // Fecha a modal após a edição
    } catch (error) {
      toast.error("Erro ao atualizar o produto.");
      console.error("Error ao atualizar produto: ", error);
    }
  };
  
  

  return (
    <div className={styles.ContainerModal}>
      <input
        type="text"
        placeholder="Nome do Produto"
        className={styles.inputText}
        value={nomeProduto}
        onChange={(e) => setNomeProduto(e.target.value)}
      />
      <input
        type="number"
        placeholder="Preço"
        className={styles.inputText}
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
      />
      <select
        value={categoriaSelecionada}
        className={styles.inputSelect}
        onChange={(e) => setCategoriaSelecionada(e.target.value)}
      >
        <option value="">Selecione uma categoria</option>
        {categorias.map(categoria => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nome}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className={styles.inputTextarea}
      ></textarea>
      <button className={styles.button} onClick={handleSave}>Salvar</button>
    </div>
  );
};