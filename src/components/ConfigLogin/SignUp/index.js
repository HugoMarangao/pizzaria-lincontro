import { useState } from "react";
import styles from "./styles.module.scss";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../Config/Sever/firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/router"; 

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [endereco, setEndereco] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Registrazione riuscita:", userCredential.user);

      // Adicionar a nova empresa à coleção 'empresas'
      const userDocRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userDocRef, {
        nome: userName,
        endereco:endereco,
        identifi: "user",
      }).then(() => console.log("sucesso"))
      .catch((error) => console.error("Erro ao escrever documento:", error))

      

      router.push('/Login/dashboardUser');
      toast.success("Registrazione riuscita!");
      setIsLoading(false); 
    } catch (err) {
      setError(err.message);
      console.log(err.message);
      toast.error("Si è verificato un errore durante la creazione dell'account. Riprova.");
      setIsLoading(false); 
    }
  };

  return (
    <div className={styles.container}>
      <h1>Crea account</h1>
      <form onSubmit={handleSubmit}>
        <label>
         
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            placeholder=" Nome do Usuario:"
          />
        </label>
        <br />
        <label>
         
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder=" E-mail:"
          />
        </label>
        <br />
        <label>
         
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
            placeholder=" indirizzo"
          />
        </label>
        <br/>
        <label>
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password:"
          />
        </label>
        <br />
        <button type="submit">{isLoading ? "Caricamento..." : "Crea account"}</button>
      </form>
      <Link href={'/Login/logar'}>Hai già un account? Accedi!</Link>
    </div>
  );
};

export default SignUp;
