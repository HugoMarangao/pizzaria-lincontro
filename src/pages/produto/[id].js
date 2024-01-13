import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Header from '@/components/Header';
import ApresentacaoProduto from '@/components/ApresentacaoProduto';
import Footer from '@/components/Footer';

const ProdutoDetalhes = () => {
  const [produto, setProduto] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchProduto = async () => {
        const db = getFirestore();
        const docRef = doc(db, 'produtos', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduto({ id: docSnap.id, ...docSnap.data() });
        }
      };

      fetchProduto();
    }
  }, [id]);

  if (!produto) return <div>Carregando...</div>;

  return (
    <>
      <Header/>
      <ApresentacaoProduto produto={produto} />
      <Footer/>
    </>
  );
};

export default ProdutoDetalhes;
