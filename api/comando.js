import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { mensagem } = req.body;
  if (!mensagem) {
    return res.status(400).json({ error: "Mensagem vazia" });
  }

  // Sua chave virá do ambiente seguro da Vercel
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(configuration);

  try {
    const chat = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente para controle de baldes de cerveja. Sempre responda APENAS com JSON no formato: { \"acao\": \"adicionar_balde\", \"pessoa\": \"João\", \"cerveja\": \"Heineken\" }"
        },
        { role: "user", content: mensagem }
      ]
    });

    const resposta = chat.data.choices[0].message.content.trim();
    res.status(200).send(resposta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro na OpenAI" });
  }
}
