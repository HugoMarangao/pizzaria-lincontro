import { useState } from "react";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Novo estado para controle de carregamento
  const router = useRouter();
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const auth = getAuth();
    const db = getFirestore(); // Inicialize o Firestore

    try {
      await setPersistence(auth, browserLocalPersistence);
      console.log("Persistência definida para sessão");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      console.log("Login bem-sucedido:", userCredential.user);

      // Aqui você verifica o papel do usuário
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      console.log("Dados do usuário:", userDoc.data());

      if (userDoc.exists() && userDoc.data().identifi === "admin") {
        // Redirecionar para a página do admin
        
        router.push('/Login/dashboardAdmin');
      } else {
        // Redirecionar para a página do usuário normal
        
        router.push('/Login/dashboardUser');
      }

      toast.success("Login bem-sucedido!");
    } catch (err) {
      setError(err.message);
      toast.error("Ocorreu um erro durante o login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}/>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="E-mail"
          />
        </label>
        <br />
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Senha"
          />
        </label>
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Carregando..." : "Entrar"}
        </button> {/* Alteração do texto do botão com base no estado de carregamento */}
      </form>
      <Link href={"/Login/criarConta"}>Criar conta</Link>
    </div>
  );
};

export default SignIn;
