import * as admin from "firebase-admin";

// Obtenha este JSON no painel do Firebase
// Você também pode armazenar os valores em variáveis ​​de ambiente
import serviceAccount from "./serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin };
