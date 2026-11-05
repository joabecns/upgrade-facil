// ===== Menu mobile =====
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  const aberto = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", aberto);
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => nav.classList.remove("is-open"))
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
    ${k.destaque ? '<span class="card__badge">Mais vendido</span>' : ""}
    <img src="${(window.ASSET_BASE || "") + k.imagem}" alt="${k.nome}" loading="lazy" width="1024" height="768" />
    <div class="card__body">
      <h3>${k.nome}</h3>
      <p>${k.resumo}</p>
      <ul>${k.itens.map((i) => `<li>${i}</li>`).join("")}</ul>
      <p class="card__ideal"><strong>Ideal para:</strong> ${k.ideal}</p>
      <div class="card__footer">
        <span class="card__price">${formatarPreco(k.preco)}</span>
        <a href="#orcamento" class="btn btn--primary btn--sm" data-kit="${k.id}">Orçar</a>
      </div>
    </div>
  </article>`
).join("");

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
  feedback.textContent = `Obrigado, ${dados.nome.trim()}! Recebemos sua solicitação (demonstração — ainda sem envio real).`;
  form.reset();
});

// ===== Ano no rodapé =====
document.getElementById("ano").textContent = new Date().getFullYear();
