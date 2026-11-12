// Widget original do Bit, agora conectado ao servidor em POST /api/chat.
(() => {
  const fab = document.getElementById("chatFab");
  const chat = document.getElementById("chat");
  const fechar = document.getElementById("chatClose");
  const lista = document.getElementById("chatMessages");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const chips = document.getElementById("chatChips");
  let iniciado = false;
  let enviando = false;
  let historico = [];
  let origemDoFoco = fab;

  function adicionar(texto, autor) {
    const div = document.createElement("div");
    div.className = `msg msg--${autor}`;
    div.textContent = texto; // Inclusive a IA é exibida como texto, nunca como HTML.
    lista.appendChild(div);
    lista.scrollTop = lista.scrollHeight;
    return div;
  }

  function adicionarResposta(resposta) {
    const marcacao = resposta.match(/\[KIT:\s*(ssd|ram|combo)\s*\]/i);
    const texto = resposta.replace(/\[KIT:[^\]]*\]/gi, "").trim();
    const div = adicionar(texto, "bot");
    const kit = marcacao && KITS.find((k) => k.id === marcacao[1].toLowerCase());
    if (kit) {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "msg__quote";
      botao.textContent = `Orçar ${kit.nome} ↗`;
      botao.addEventListener("click", () => {
        document.querySelector('#quoteForm [name="kit"]').value = kit.id;
        fecharChat();
        document.getElementById("orcamento").scrollIntoView({ behavior: "smooth" });
        document.querySelector('#quoteForm [name="nome"]').focus({ preventScroll: true });
      });
      div.appendChild(botao);
    }
    lista.scrollTop = lista.scrollHeight;
  }

  function alterarCarregamento(ativo) {
    enviando = ativo;
    form.setAttribute("aria-busy", String(ativo));
    input.disabled = ativo;
    form.querySelector("button").disabled = ativo;
    chips.querySelectorAll("button").forEach((botao) => { botao.disabled = ativo; });
  }

  async function responder(texto) {
    if (enviando || !texto.trim()) return;
    adicionar(texto, "user");
    input.value = "";
    alterarCarregamento(true);
    const digitando = adicionar("Bit está pensando…", "bot");
    digitando.classList.add("msg--typing");
    const controle = new AbortController();
    const tempoLimite = setTimeout(() => controle.abort(), 35000);

    try {
      const retorno = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: texto, historico }),
        signal: controle.signal
      });
      const dados = await retorno.json().catch(() => ({}));
      if (!retorno.ok) throw new Error(dados.erro || "Não consegui falar com o Bit. Abra o site pelo endereço informado no npm start.");
      if (typeof dados.resposta !== "string" || !dados.resposta.trim()) throw new Error("A IA não respondeu. Tente novamente.");
      adicionarResposta(dados.resposta);
      // Somente trocas concluídas entram no histórico (três pares de mensagens).
      historico = [...historico, { role: "user", text: texto }, { role: "model", text: dados.resposta }].slice(-6);
    } catch (erro) {
      const mensagem = erro.name === "AbortError"
        ? "A resposta demorou mais que o esperado. Tente novamente."
        : erro instanceof TypeError ? "Não consegui conectar ao servidor. Confira se o npm start está rodando." : erro.message;
      adicionar(mensagem, "error");
      input.value = texto; // Facilita tentar novamente sem perder a pergunta.
    } finally {
      clearTimeout(tempoLimite);
      digitando.remove();
      alterarCarregamento(false);
      lista.scrollTop = lista.scrollHeight;
      if (!chat.hidden) input.focus();
    }
  }

  function abrir(evento) {
    origemDoFoco = evento?.currentTarget || fab;
    chat.hidden = false;
    fab.classList.add("is-hidden");
    fab.setAttribute("aria-expanded", "true");
    if (!iniciado) {
      iniciado = true;
      adicionar("Olá! Eu sou o Bit, seu assistente de upgrades. 🤖\nPosso ajudar a escolher entre SSD e RAM e orientar a verificação de compatibilidade. O que você quer melhorar no seu notebook?", "bot");
      ["Qual kit devo comprar?", "Tenho 400 reais", "Meu notebook é compatível?", "Como instalar?"].forEach((texto) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.textContent = texto;
        botao.addEventListener("click", () => responder(texto));
        chips.appendChild(botao);
      });
    }
    input.focus();
  }

  function fecharChat() {
    chat.hidden = true;
    fab.classList.remove("is-hidden");
    fab.setAttribute("aria-expanded", "false");
    origemDoFoco.focus();
  }

  fab.addEventListener("click", abrir);
  fechar.addEventListener("click", fecharChat);
  document.querySelectorAll("[data-open-chat]").forEach((botao) => botao.addEventListener("click", abrir));
  chat.addEventListener("keydown", (evento) => { if (evento.key === "Escape") fecharChat(); });
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    responder(input.value.trim());
  });
  window.abrirChatBit = abrir;
})();
