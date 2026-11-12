// ===== Menu mobile =====
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  const aberto = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", aberto);
  menuToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  })
);

// ===== Link ativo conforme rolagem =====
const links = document.querySelectorAll(".nav__link");
const secoes = [...links].map((l) => document.querySelector(l.getAttribute("href")));
const observer = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
secoes.forEach((s) => s && observer.observe(s));

// ===== Cards de kits =====
const cards = document.getElementById("cards");
cards.innerHTML = KITS.map(
  (k) => `
  <article class="card ${k.destaque ? "card--featured" : ""}">
    <div class="card__media">
      <span class="card__badge ${k.destaque ? "" : "card__badge--neutral"}">${k.destaque ? "Upgrade completo" : k.id === "ssd" ? "Mais velocidade" : "Mais multitarefa"}</span>
      <img src="${(window.ASSET_BASE || "") + k.imagem}" alt="Imagem ilustrativa do ${k.nome}" loading="lazy" width="1024" height="768" />
    </div>
    <div class="card__body">
      <span class="card__category">UPGRADE PARA NOTEBOOK</span>
      <h3>${k.nome}</h3>
      <p>${k.resumo}</p>
      <ul>${k.itens.map((i) => `<li>${i}</li>`).join("")}</ul>
      <p class="card__ideal"><strong>Ideal para:</strong> ${k.ideal}</p>
      <div class="card__footer">
        <div><span class="card__price-label">Valor do kit</span><span class="card__price">${formatarPreco(k.preco)}</span><small class="card__shipping">Frete calculado no orçamento</small></div>
        <a href="#orcamento" class="btn btn--primary btn--sm" data-kit="${k.id}">Solicitar orçamento <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </article>`
).join("");

// A busca funciona localmente sobre os três kits do catálogo.
const busca = document.getElementById("kitSearch");
const normalizar = (texto) => texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
function filtrarKits() {
  const termo = normalizar(busca.value.trim());
  let encontrados = 0;
  [...cards.children].forEach((card, i) => {
    const k = KITS[i];
    const palavras = normalizar([k.id, k.nome, k.resumo, ...k.itens].join(" ")).split(/[^a-z0-9]+/);
    // Busca por início de palavra: "RAM" não deve casar com "programas".
    card.hidden = !termo.split(/\s+/).every((parte) => palavras.some((palavra) => palavra.startsWith(parte)));
    if (!card.hidden) encontrados++;
  });
  document.getElementById("catalogFeedback").hidden = encontrados > 0;
}
busca.addEventListener("input", filtrarKits);
document.getElementById("kitSearchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  filtrarKits();
  document.getElementById("kits").scrollIntoView({ behavior: "smooth" });
});

// Botão "Orçar" pré-seleciona o kit no formulário
cards.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-kit]");
  if (btn) document.querySelector('#quoteForm [name="kit"]').value = btn.dataset.kit;
});

// ===== Formulário de orçamento (validação no navegador) =====
// ESPAÇO PARA MELHORIA: enviar os dados para o backend (ex.: POST /api/orcamento).
const form = document.getElementById("quoteForm");
const feedback = document.getElementById("formFeedback");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const dados = Object.fromEntries(new FormData(form));
  const erros = [];
  if (!dados.nome.trim()) erros.push("informe seu nome");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) erros.push("informe um e-mail válido");
  if (!dados.modelo.trim()) erros.push("informe o modelo do notebook");
  if (!dados.kit) erros.push("escolha um kit");

  if (erros.length) {
    feedback.className = "form__feedback is-error";
    feedback.textContent = "Por favor, " + erros.join(", ") + ".";
    return;
  }
  feedback.className = "form__feedback is-ok";
  feedback.textContent = `Obrigado, ${dados.nome.trim()}! Formulário validado. Esta é uma demonstração: nenhum dado foi enviado ou salvo.`;
  form.reset();
});

// ===== Ano no rodapé =====
document.getElementById("ano").textContent = new Date().getFullYear();
