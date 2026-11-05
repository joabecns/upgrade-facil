const path = require("node:path");
const { setTimeout: esperar } = require("node:timers/promises");
const express = require("express");
require("dotenv").config({ path: path.join(__dirname, "../.env"), quiet: true });
const bitPrompt = require("./bitPrompt");

const app = express();
const raiz = path.join(__dirname, "..");
app.disable("x-powered-by");
app.use(express.json({ limit: "64kb" }));

// Publica apenas o HTML e as pastas do frontend, nunca a raiz inteira.
app.get("/", (req, res) => res.sendFile(path.join(raiz, "index.html")));
app.get("/index.html", (req, res) => res.sendFile(path.join(raiz, "index.html")));
for (const pasta of ["css", "js", "img"]) {
  app.use(`/${pasta}`, express.static(path.join(raiz, pasta), { dotfiles: "deny", index: false }));
}

app.post("/api/chat", async (req, res) => {
  const { mensagem, historico = [] } = req.body || {};
  const textoValido = (texto, limite) => typeof texto === "string" && texto.trim().length > 0 && texto.length <= limite;

  if (!textoValido(mensagem, 300)) {
    return res.status(400).json({ erro: "Escreva uma mensagem de até 300 caracteres." });
  }
  if (!Array.isArray(historico) || historico.length > 6 || historico.some((item, i) =>
    !item || item.role !== (i % 2 === 0 ? "user" : "model") || !textoValido(item.text, 4000)
  ) || historico.length % 2 !== 0) {
    return res.status(400).json({ erro: "Histórico inválido. Atualize a página e tente novamente." });
  }

  const chave = process.env.GEMINI_API_KEY?.trim();
  if (!chave) {
    return res.status(503).json({ erro: "O Bit ainda não foi configurado. Preencha GEMINI_API_KEY no .env e reinicie o servidor." });
  }

  const modelo = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite";
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:generateContent`;
    const opcoes = {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": chave },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: bitPrompt }] },
        contents: [...historico.map((item) => ({ role: item.role, parts: [{ text: item.text.trim() }] })),
          { role: "user", parts: [{ text: mensagem.trim() }] }],
        generationConfig: { maxOutputTokens: 2048 }
      }),
      signal: AbortSignal.timeout(30000)
    };

    // Uma única repetição para falhas temporárias, dentro dos mesmos 30 segundos.
    const falhasTemporarias = [500, 502, 503, 504];
    let retorno;
    for (let tentativa = 1; tentativa <= 2; tentativa++) {
      retorno = await fetch(url, opcoes);
      if (retorno.ok) break;
      console.error(`Gemini retornou HTTP ${retorno.status} (tentativa ${tentativa}).`);
      if (!falhasTemporarias.includes(retorno.status) || tentativa === 2) break;
      await retorno.body?.cancel();
      await esperar(1000, undefined, { signal: opcoes.signal });
    }

    if (!retorno.ok) {
      if (falhasTemporarias.includes(retorno.status)) {
        return res.status(503).json({ erro: "O serviço de IA está temporariamente indisponível. Tente novamente em alguns instantes." });
      }
      const erro = retorno.status === 429
        ? "O Bit atingiu o limite de uso da IA. Aguarde um pouco e confira a cota da chave no Google AI Studio."
        : "Não consegui consultar a IA. Confira a chave e o modelo no .env ou tente novamente mais tarde.";
      return res.status(retorno.status === 429 ? 429 : 502).json({ erro });
    }

    const dados = await retorno.json();
    const candidato = dados.candidates?.[0];
    const resposta = candidato?.content?.parts?.filter((parte) => !parte.thought && typeof parte.text === "string")
      .map((parte) => parte.text).join("\n").trim();
    if (!resposta || candidato.finishReason !== "STOP" || resposta.length > 4000) {
      return res.status(502).json({ erro: "A IA não retornou uma resposta completa. Tente reformular sua pergunta." });
    }
    res.json({ resposta });
  } catch (erro) {
    const demorou = erro.name === "TimeoutError" || erro.name === "AbortError";
    res.status(demorou ? 504 : 502).json({ erro: demorou
      ? "O Bit demorou para responder. Tente novamente."
      : "Não consegui conectar à IA agora. Confira a conexão e tente novamente." });
  }
});

app.use((req, res) => res.status(404).json({ erro: "Página não encontrada." }));
app.use((erro, req, res, next) => {
  const grande = erro.type === "entity.too.large";
  res.status(grande ? 413 : 400).json({ erro: grande ? "Mensagem muito grande." : "Requisição inválida." });
});

// Importar o app nos testes não abre uma porta automaticamente.
if (require.main === module) {
  const porta = Number(process.env.PORT || 3000);
  app.listen(porta, () => {
    console.log(`Upgrade Fácil: http://localhost:${porta}`);
    if (!process.env.GEMINI_API_KEY?.trim()) console.log("Configure GEMINI_API_KEY no .env para ativar as respostas do Bit.");
  });
}

module.exports = app;
