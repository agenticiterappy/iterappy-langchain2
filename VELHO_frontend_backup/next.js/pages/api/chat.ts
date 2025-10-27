// frontend/next.js/pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createLangChainMCPAgent } from "../../../src/agents/langchainMCPAgent";

let agentPromise = createLangChainMCPAgent();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: "Mensagem é obrigatória" });
    return;
  }

  try {
    const agent = await agentPromise;
    const response = await agent.invoke({
      messages: [{ role: "user", content: message }],
    });
    res.status(200).json({ response: response.content });
  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}
