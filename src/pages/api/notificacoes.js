import { admin } from "@/components/Config/Sever/firebaseAdmin";

export default async function handler(req, res) {
  const { title, body, tokens } = req.body;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    tokens: tokens,
  };

  console.log("Tentando enviar notificação:", message); // Log adicional para verificar a mensagem

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log("Resposta do envio:", response); // Log da resposta completa para diagnóstico

    // Inicializa arrays para tokens bem-sucedidos e com falhas
    const failedTokens = [];
    const successTokens = [];

    // Verifica cada resposta para determinar sucesso ou falha
    response.responses.forEach((resp, idx) => {
      if (resp.success) {
        successTokens.push(tokens[idx]); // Adiciona apenas tokens bem-sucedidos
        console.log(`Sucesso no token: ${tokens[idx]}`);
      } else {
        failedTokens.push(tokens[idx]); // Adiciona tokens que falharam
        console.log(`Falha no token: ${tokens[idx]} | Erro: ${resp.error}`);
      }
    });

    // Logs para ajudar a diagnosticar problemas
    console.log("Pessoas entregues:", response.successCount);
    console.log("Tokens com sucesso:", successTokens);
    console.log("Tokens com erro:", failedTokens);
    console.log("Falhas:", response.failureCount);

    res.status(200).json({
      status: "Notificação enviada com sucesso!",
      successCount: response.successCount,
      failedTokens: failedTokens, // Retorna os tokens com falha na resposta para diagnóstico
    });
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
    res.status(400).json({
      status: "Erro ao enviar",
      error: error.message,
    });
  }
}
