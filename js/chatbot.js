/* =========================================================
   Bit — assistente da Upgrade Fácil (VERSÃO BASEADA EM REGRAS)
   ---------------------------------------------------------
   ESPAÇO PARA MELHORIA (outro integrante):
   - Trocar a função gerarResposta() por um fetch ao backend:
       const r = await fetch("/api/chat", { method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ mensagem, historico }) });
       const { resposta } = await r.json();
   - O backend guarda a chave da API (.env) e envia o system prompt do Bit.
   A interface (balão, janela e mensagens) já está pronta abaixo.
   ========================================================= */

const Bit = (() => {
  const normalizar = (t) =>
    t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const kit = (id) => KITS.find((k) => k.id === id);
  const linhaKit = (k) => `<strong>${k.nome}</strong> — ${formatarPreco(k.preco)}`;

  // Cada regra: palavras-chave → resposta. A primeira que casar vence.
  const regras = [
    {
      chaves: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "eai", "hey"],
      resposta: () =>
        "Olá! Eu sou o <strong>Bit</strong> 🤖, assistente da Upgrade Fácil. Posso recomendar um kit, explicar SSD e RAM ou ajudar a checar a compatibilidade do seu notebook."
    },
    {
      chaves: ["compativel", "compatibilidade", "serve", "funciona no meu", "meu notebook", "modelo"],
      resposta: () =>
        "Para checar compatibilidade:<br>1️⃣ Veja o modelo exato na etiqueta embaixo do notebook.<br>2️⃣ No Windows: Gerenciador de Tarefas → Desempenho → Memória (mostra DDR4/DDR5 e slots usados).<br>3️⃣ Procure no manual se há slot <em>M.2 NVMe</em>.<br>4️⃣ Confirme se a RAM não é soldada.<br>Se quiser, envie o modelo no <a href='#orcamento'>formulário de orçamento</a> que nossa equipe confere."
    },
    {
      chaves: ["soldada", "soldado", "onboard"],
      resposta: () =>
        "Alguns notebooks finos têm a memória <strong>soldada</strong> na placa e não aceitam troca. Nesse caso, o " + linhaKit(kit("ssd")) + " ainda é uma ótima opção!"
    },
    {
      chaves: ["ddr5", "ddr4", "ddr3"],
      resposta: () =>
        "Nosso kit padrão é <strong>DDR4 3200 MHz</strong>. Se seu notebook usa DDR5, temos versão sob consulta — peça no <a href='#orcamento'>orçamento</a>. DDR3 não é atendido."
    },
    {
      chaves: ["sata", "nvme", "m.2", "m2"],
      resposta: () =>
        "<strong>NVMe M.2</strong> é o SSD em formato de 'chiclete', bem mais rápido. <strong>SATA 2,5\"</strong> substitui o HD tradicional. Nosso kit usa NVMe; versão SATA sob consulta."
    },
    {
      chaves: ["combo", "completo", "os dois", "ssd e ram", "ssd + ram", "tudo"],
      resposta: () => {
        const k = kit("combo");
        return `${linhaKit(k)}<br>${k.resumo}<br><small>${k.compat}</small>`;
      }
    },
    {
      chaves: ["ssd", "armazenamento", "espaco", "hd", "liga devagar", "demora para ligar", "lento para ligar"],
      resposta: () => {
        const k = kit("ssd");
        return `Recomendo o ${linhaKit(k)}.<br>${k.resumo}<br><small>${k.compat}</small>`;
      }
    },
    {
      chaves: ["ram", "memoria", "trava", "travando", "abas", "multitarefa", "programas"],
      resposta: () => {
        const k = kit("ram");
        return `Recomendo o ${linhaKit(k)}.<br>${k.resumo}<br><small>${k.compat}</small>`;
      }
    },
    {
      chaves: ["preco", "valor", "quanto custa", "custa", "orcamento", "barato", "reais", "r$"],
      resposta: (msg) => {
        const num = msg.match(/\d+[\.,]?\d*/);
        if (num) {
          const verba = parseFloat(num[0].replace(",", "."));
          const cabe = KITS.filter((k) => k.preco <= verba).sort((a, b) => b.preco - a.preco);
          if (cabe.length) return `Com ${formatarPreco(verba)} recomendo o ${linhaKit(cabe[0])}. ${cabe[0].resumo}`;
          return `Com ${formatarPreco(verba)} ainda não temos kit, o mais em conta é o ${linhaKit(kit("ram"))}.`;
        }
        return "Nossos preços:<br>" + KITS.map(linhaKit).join("<br>") + "<br>Me diga seu orçamento (ex.: <em>tenho 400 reais</em>) que eu indico o melhor kit.";
      }
    },
    {
      chaves: ["jogo", "jogar", "games", "gamer"],
      resposta: () => "Para jogos, o " + linhaKit(kit("combo")) + " ajuda bastante no carregamento e na fluidez. Lembre que a placa de vídeo do notebook não é trocada."
    },
    {
      chaves: ["instalar", "instalacao", "como trocar", "dificil"],
      resposta: () => "A instalação é simples: todo kit vem com chave de precisão e guia passo a passo. Leva cerca de 20 minutos. Desligue o notebook e retire a bateria (se possível) antes de abrir."
    },
    {
      chaves: ["garantia", "troca", "devolucao"],
      resposta: () => "Todos os kits têm <strong>12 meses de garantia</strong> e 7 dias para devolução."
    },
    {
      chaves: ["entrega", "frete", "prazo", "envio"],
      resposta: () => "Enviamos para todo o Brasil. Prazo e frete são informados no orçamento, de acordo com seu CEP."
    },
    {
      chaves: ["obrigado", "valeu", "obrigada", "tchau"],
      resposta: () => "Por nada! Qualquer dúvida sobre upgrades, é só chamar. 🚀"
    }
  ];

  function gerarResposta(mensagem) {
    const msg = normalizar(mensagem);
    // A palavra-chave precisa começar uma palavra (evita "eai" casar com "reais").
    const contem = (c) =>
      new RegExp("(^|[^a-z0-9])" + c.replace(/[.*+?^${}()|[\]\\$]/g, "\\$&")).test(msg);
    for (const r of regras) {
      if (r.chaves.some(contem)) return r.resposta(msg);
    }
    return "Hmm, sou especialista apenas em upgrades de notebook 😅. Posso falar sobre <strong>SSD</strong>, <strong>memória RAM</strong>, <strong>preços</strong>, <strong>compatibilidade</strong> ou <strong>instalação</strong>.";
  }

  return { gerarResposta };
})();

/* ===== Widget de chat (interface) ===== */
(() => {
  const fab = document.getElementById("chatFab");
  const chat = document.getElementById("chat");
  const fechar = document.getElementById("chatClose");
  const lista = document.getElementById("chatMessages");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const chips = document.getElementById("chatChips");
  let iniciado = false;

  const sugestoes = ["Qual kit devo comprar?", "Tenho 400 reais", "Meu notebook é compatível?", "Como instalar?"];

  function adicionar(texto, autor) {
    const div = document.createElement("div");
    div.className = `msg msg--${autor}`;
    if (autor === "bot") div.innerHTML = texto; // respostas internas, seguras
    else div.textContent = texto;               // texto do usuário nunca vira HTML
    lista.appendChild(div);
    lista.scrollTop = lista.scrollHeight;
  }

  function responder(texto) {
    adicionar(texto, "user");
    const digitando = document.createElement("div");
    digitando.className = "msg msg--bot msg--typing";
    digitando.innerHTML = "<span></span><span></span><span></span>";
    lista.appendChild(digitando);
    lista.scrollTop = lista.scrollHeight;
    setTimeout(() => {
      digitando.remove();
      const t = texto.toLowerCase();
      const resp = t.includes("qual kit")
        ? "Depende do problema! Seu notebook <strong>demora para ligar</strong> ou <strong>trava com muitos programas</strong>? Ou quer os dois resolvidos?"
        : Bit.gerarResposta(texto);
      adicionar(resp, "bot");
    }, 600);
  }

  function abrir() {
    chat.hidden = false;
    fab.classList.add("is-hidden");
    if (!iniciado) {
      iniciado = true;
      adicionar(Bit.gerarResposta("oi"), "bot");
      sugestoes.forEach((s) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = s;
        b.onclick = () => responder(s);
        chips.appendChild(b);
      });
    }
    input.focus();
  }

  function fecharChat() {
    chat.hidden = true;
    fab.classList.remove("is-hidden");
  }

  fab.addEventListener("click", abrir);
  fechar.addEventListener("click", fecharChat);
  document.querySelectorAll("[data-open-chat]").forEach((b) => b.addEventListener("click", abrir));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto) return;
    input.value = "";
    responder(texto);
  });

  window.abrirChatBit = abrir;
})();
