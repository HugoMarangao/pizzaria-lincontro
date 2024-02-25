import { admin } from "@/components/Config/Sever/firebaseAdmin";

export default async function handler(req, res) {
  // Extrair 'tokens' juntamente com outros dados do corpo da requisição
  const { title, body, image, icon, tokens } = req.body;

  // Construir a mensagem com os 'tokens' recebidos
  const message = {
    notification: {
      title: title,
      body: body,
      image: encodeURI(image)
    },
    data: {
      icon: encodeURI(icon)
    },
    tokens: tokens, // Usar os 'tokens' aqui
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log("Notificação enviada com sucesso!");
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
