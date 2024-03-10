import { admin } from "@/components/Config/Sever/firebaseAdmin";

export default async function handler(req, res) {
  // Extrair 'tokens' juntamente com outros dados do corpo da requisição
  const { title, body, tokens } = req.body;

  // Construir a mensagem com os 'tokens' recebidos
  const message = {
    notification: {
      title: title,
      body: body,      
    },
    tokens: tokens, // Usar os 'tokens' aqui
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log("Notificação enviada com sucesso!");
    if (response.failureCount > 0) {
      const failedTokens = [];
  
      response.responses.forEach((resp, idx) => {
          if (!resp.success) {
              // Assume que `tokens` é o array de tokens que você tentou enviar
              failedTokens.push(tokens[idx]);
              console.log(`Token com erro: ${tokens[idx]} | Erro: ${resp.error}`);
          }
      });
  
      console.log('Tokens com erro:', failedTokens);
  
      // Aqui você pode decidir o que fazer com esses tokens com erro
      // Por exemplo, removê-los do seu banco de dados ou tentar atualizá-los
  }
    console.log("Pessoas entregues:", response.successCount);
    console.log("Tokens com erro:", response.failureCount);
    res.status(200).json({
      status: "Notificação enviada com sucesso!",
      successCount: response.successCount
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "Erro ao enviar",
      error: error.message,
    });
  }
}
