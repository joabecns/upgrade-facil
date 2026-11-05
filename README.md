# Upgrade Fácil

Loja virtual **fictícia** de kits de upgrade para notebooks (SSD, memória RAM e SSD + RAM), com o **Bit**, assistente que tira dúvidas, recomenda kits por necessidade/orçamento e orienta a verificação de compatibilidade.

Projeto da AV3 — Desenvolvimento Web para IA (FESPI / PIT).

## Integrantes
- Joabe Silva — front-end (HTML, CSS, JS e chatbot baseado em regras)
- _Integrante 2_ — backend + integração do Bit com API de IA
- _Integrante 3_ — _a definir_

## Público-alvo
Estudantes, profissionais e usuários domésticos com notebooks lentos ou sem espaço que querem melhorar o desempenho sem comprar outra máquina.

## Tecnologias
- HTML5, CSS3 (Flexbox e Grid, responsivo), JavaScript puro
- Google Fonts (Space Grotesk, DM Sans)
- _Etapa 2:_ Node.js + Express + API de IA (Gemini/OpenAI)

## Como executar (versão atual)
Abra `index.html` no navegador, ou use a extensão Live Server do VS Code.

## Funcionalidades
- Cabeçalho com logomarca e menu (Início, Sobre, Kits, Compatibilidade, Orçamento), com menu mobile
- Seção de benefícios em **grid** e catálogo de kits em **cards com flex**
- Guia de compatibilidade
- Formulário de orçamento com validação
- Chat flutuante com o **Bit** (persona: assistente técnico, amigável, só fala de upgrades)

## Integração com IA
**Versão atual:** o Bit funciona com **regras** (palavras-chave → respostas) em `js/chatbot.js`, usando os dados de `js/kits.js`. Ele recomenda kits pelo orçamento informado (ex.: "tenho 400 reais") e recusa assuntos fora do tema.

**Espaço para melhorias (Integrante 2):**
- [ ] `server/` com servidor pequeno (Express) que guarda a chave da API em `.env`
- [ ] `.env.example` e `.gitignore` (ignorar `.env` e `node_modules`)
- [ ] Rota `POST /api/chat` que recebe a mensagem e chama a IA
- [ ] System prompt do Bit com os dados dos kits e as regras de compatibilidade
- [ ] Trocar `Bit.gerarResposta()` em `js/chatbot.js` por `fetch("/api/chat")` (comentário no arquivo mostra como)
- [ ] (Opcional) Rota `POST /api/orcamento` para o formulário (ponto marcado em `js/script.js`)

## Estrutura
```
upgrade-facil/
├── index.html
├── css/style.css
├── js/
│   ├── kits.js       # dados dos kits
│   ├── chatbot.js    # Bit (regras) + widget de chat
│   └── script.js     # menu, cards, formulário
├── img/              # imagens do site
├── server/           # (a criar) backend do Bit
└── README.md
```
