# Upgrade Fácil

Loja virtual **fictícia** de kits de upgrade para notebooks (SSD, memória RAM e SSD + RAM), com o **Bit**, assistente que tira dúvidas, recomenda kits por necessidade/orçamento e orienta a verificação de compatibilidade.

Projeto da AV3 — Desenvolvimento Web para IA (FESPI / PIT).

## Integrantes
- Joabe Carvalho Neco e Silva 
- Pedro Henrique Rocha

## Público-alvo
Estudantes, profissionais e usuários domésticos com notebooks lentos ou sem espaço que querem melhorar o desempenho sem comprar outra máquina.

## Tecnologias
- HTML5, CSS3 (Flexbox e Grid, responsivo), JavaScript puro
- Google Fonts (Space Grotesk, DM Sans)
- Node.js + Express + API de IA (Gemini/OpenAI)

## Como executar (versão atual)
Abra `index.html` no navegador, ou use a extensão Live Server do VS Code.

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
│   ├── chatbot.js    # Bit (regras) + widget de chat
│   └── script.js     # menu, cards, formulário
├── img/              # imagens do site
├── server/           # (a criar) backend do Bit
└── README.md
```
