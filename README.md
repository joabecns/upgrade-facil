# Upgrade Fácil

Loja virtual **fictícia** de kits de upgrade para notebooks (SSD, memória RAM e SSD + RAM), com o **Bit**, assistente que tira dúvidas, recomenda kits por necessidade/orçamento e orienta a verificação de compatibilidade.

Projeto da AV3 — Desenvolvimento Web para IA (FESPI / PIT).

## Integrantes
- Joabe Carvalho Neco e Silva 
- Pedro Henrique Rocha Silva

## Público-alvo
Estudantes, profissionais e usuários domésticos com notebooks lentos ou sem espaço que querem melhorar o desempenho sem comprar outra máquina.

## Tecnologias
- HTML5, CSS3 (Flexbox e Grid, responsivo), JavaScript puro
- Google Fonts (Space Grotesk, DM Sans)
- Node.js + Express + dotenv + API Gemini

## Como executar
Requer Node.js 22 ou superior e internet para consultar a IA.

1. Na raiz do projeto, execute `npm install`.
2. Copie `.env.example` para `.env` (no PowerShell: `Copy-Item .env.example .env`).
3. Crie uma chave no [Google AI Studio](https://aistudio.google.com/apikey) e preencha `GEMINI_API_KEY` no `.env`. O campo `GEMINI_MODEL` permite escolher um [modelo disponível](https://ai.google.dev/gemini-api/docs/models) para sua chave.
4. Execute `npm start` e abra **http://localhost:3000**. Se alterar o `.env`, reinicie o servidor.

Use esse endereço para testar o chat, em vez de abrir o HTML diretamente ou usar o Live Server. Sem chave, a página funciona e o chat informa que a IA ainda não foi configurada. A chave fica somente no servidor; `.env` e `node_modules` são ignorados pelo Git.

## Integração com IA — Bit

- O widget no final do `body` (`#chat`) envia `POST /api/chat` com `{ mensagem, historico }` e recebe `{ resposta }`; falhas retornam `{ erro }`.
- O servidor Express chama a API Gemini com `fetch`, chave do `.env` e instrução de sistema definida em `server/bitPrompt.js`.
- O Bit tem persona amigável, ajuda com SSD/RAM, recomenda por necessidade e orçamento e orienta a verificação de compatibilidade, sem confirmar modelos por suposição.
- O prompt lê os mesmos dados de `js/kits.js` utilizados nos cards. O navegador mantém somente as últimas seis mensagens no histórico, em memória; recarregar a página limpa a conversa.
- Marcações como `[KIT:ssd]` geram um botão de orçamento com o kit selecionado. As respostas são exibidas como texto, sem executar HTML.
- Há validação das mensagens, bloqueio de envios simultâneos e tratamento de falhas, tempo limite e cota da API. Falhas temporárias (HTTP 500, 502, 503 ou 504) recebem uma única tentativa adicional após um segundo, mantendo o limite total de 30 segundos. O formulário de orçamento continua sendo uma demonstração, sem envio ou armazenamento.

### Como testar

Execute `npm test` para verificar a rota e os erros com a API simulada (não gasta cota). Para validar a IA real, configure sua chave e converse pelo site:

- “Meu notebook demora para ligar e tenho 400 reais.”
- “Tenho só 200 reais.”
- “Meu notebook usa DDR5. Esse kit RAM serve?”
- “Meu notebook é compatível?”

Confira a continuidade da conversa, o botão de orçamento, a busca de kits, o menu mobile e a validação do formulário. A API depende da disponibilidade e cota da chave no Google AI Studio.

## Funcionalidades
- Cabeçalho com logomarca e menu (Início, Sobre, Kits, Compatibilidade, Orçamento), com menu mobile
- Seção de benefícios em **grid** e catálogo de kits em **cards com flex**
- Guia de compatibilidade
- Formulário de orçamento com validação
- Chat flutuante com o **Bit** (persona: assistente técnico, amigável, só fala de upgrades)

## Estrutura
```
upgrade-facil/
├── index.html
├── css/style.css
├── js/
│   ├── kits.js       # dados dos kits
│   ├── chatbot.js    # widget do Bit + chamada ao backend
│   └── script.js     # menu, cards, formulário
├── img/              # imagens do site
├── server/           # servidor Express e prompt do Bit
├── tests/            # testes da rota do chat (API simulada)
├── .env.example      # exemplo de configuração, sem chave
├── package.json      # dependências e comandos npm
└── README.md
```
