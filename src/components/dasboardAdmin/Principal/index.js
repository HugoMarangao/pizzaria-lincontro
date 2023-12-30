import React, { useState, useEffect, useContext } from 'react';
import styles from './styles.module.scss';
import Rotas from '../../Config/Rotas';
import CustomModal from '@/components/Config/Modale';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore,collection, setDoc, doc,getDocs,addDoc,updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';

export default function Principal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.containerbox}>
          <div className={styles.box}>
            <h1>Adicione um novo Banner</h1>
            <button onClick={() => openModal('banner')}>Adicionar Banner</button>
        </div>
        <div className={styles.box}>
            <h1>Adicione um novo Produto</h1>
            <button onClick={() => openModal('produto')}>Adicionar Produto</button>
        </div>
      </div>
      <div className={styles.containerbox}>
          <div className={styles.box1}>
            <h1>Adicione uma nova Categoria</h1>
            <button onClick={() => openModal('categoria')}>Adicionar Categoria</button>
        </div>
        <div className={styles.box1}>
            <h1>Envie uma notificacao</h1>
            <button >Envie</button>
        </div>
      </div>
      <Rotas href={'/'} >
        <div className={styles.retornar}>
          <h1>
           Sair
          </h1>
        </div>
      </Rotas>
      <CustomModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
        {modalContent === 'banner' && <BannerForm setModalOpen={setModalOpen} />}
        {modalContent === 'produto' && <ProdutoForm setModalOpen={setModalOpen}/>}
        {modalContent === 'categoria' && <CategoriaForm setModalOpen={setModalOpen}/>}
      </CustomModal>
    </div>
  );
}

const BannerForm = ({ setModalOpen }) => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSave = async () => {
    if (!file) return;

    const storage = getStorage();
    const storageRef = ref(storage, 'banner/banner.jpg'); // Caminho no Storage

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const db = getFirestore();
      await setDoc(doc(db, "banner", "current"), { url, text });
      toast.success("Banner criado com sucesso!!");
      setModalOpen(false)
    } catch (error) {
      toast.error("Erro na criacao do Banner");
      console.error("Error uploading file: ", error);
    }
  };

  return (
    <div className={styles.ContainerModal}>
      <input type="file" className={styles.inputImage} onChange={handleFileChange} />
      <input type="text" placeholder="Texto do Banner" className={styles.inputText} onChange={handleTextChange} />
      <button className={styles.button} onClick={handleSave}>Salvar</button>
    </div>
  );
};


const ProdutoForm = ({ setModalOpen }) => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagens, setImagens] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const db = getFirestore();
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
  
    const db = getFirestore();
  
    try {
      // Primeiro, salvar os dados básicos do produto no Firestore
      const docRef = await addDoc(collection(db, "produtos"), {
        nome: nomeProduto,
        preco,
        categoria: categoriaSelecionada,
        descricao
      });
  
      const storage = getStorage();
  
      // Fazer upload das imagens e obter seus URLs
      const imageUrls = await Promise.all(imagens.map(async (image) => {
        if (!image.name) {
          throw new Error("Nome da imagem não encontrado");
        }
        const imageRef = ref(storage, `produtos/${docRef.id}/${image.name}`);
        await uploadBytes(imageRef, image);
        return getDownloadURL(imageRef);
      }));
  
      // Atualizar o documento do produto com as URLs das imagens
      await updateDoc(doc(db, "produtos", docRef.id), {
        imagens: imageUrls
      });
  
      toast.success("Produto cadastrado com sucesso!");
      setModalOpen(false);
    } catch (error) {
      toast.error("Erro ao cadastrar o produto.");
      console.error("Error ao salvar produto: ", error);
    }
  };
  

  return (
    <div className={styles.ContainerModal}>
      <input
        type="file"
        multiple
        className={styles.inputImage}
        onChange={handleImageChange}
      />
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

const CategoriaForm = ({ setModalOpen }) => {
  const [nomeCategoria, setNomeCategoria] = useState("");

  const handleNomeCategoriaChange = (event) => {
    setNomeCategoria(event.target.value);
  };

  const handleSave = async () => {
    if (!nomeCategoria) {
      toast.error("Por favor, insira um nome para a categoria.");
      return;
    }
  
    const db = getFirestore();
    try {
      // Usando addDoc para criar um novo documento com um ID único
      await addDoc(collection(db, "categorias"), {
        nome: nomeCategoria
      });
      toast.success("Categoria cadastrada com sucesso!");
      setModalOpen(false); // Fecha a modal após o sucesso
    } catch (error) {
      toast.error("Erro ao cadastrar a categoria");
      console.error("Error ao salvar categoria: ", error);
    }
  };
  

  return (
    <div className={styles.ContainerModal}>
      <input
        type="text"
        placeholder="Nome da Categoria"
        className={styles.inputText}
        value={nomeCategoria}
        onChange={handleNomeCategoriaChange}
      />
      <button  className={styles.button} onClick={handleSave}>Salvar</button>
    </div>
  );
};
