// Dados dos kits — usados pelos cards e pelo chatbot.
// ESPAÇO PARA MELHORIA: estes mesmos dados devem ir para o system prompt do Bit no backend.
const KITS = [
  {
    id: "ssd",
    nome: "Kit SSD",
    imagem: "img/kit-ssd.jpg",
    preco: 349.9,
    resumo: "SSD NVMe M.2 de 512 GB. Liga o notebook em segundos e abre programas muito mais rápido.",
    itens: ["SSD NVMe M.2 2280 512 GB", "Chave de precisão", "Guia de clonagem do sistema"],
    ideal: "Notebook lento para ligar ou com HD cheio",
    compat: "Requer slot M.2 NVMe (2280). Para slot SATA 2,5\" há versão sob consulta."
  },
  {
    id: "ram",
    nome: "Kit Memória RAM",
    imagem: "img/kit-ram.jpg",
    preco: 289.9,
    resumo: "Memória SO-DIMM 16 GB (2x8 GB). Mais programas e abas abertos sem travar.",
    itens: ["2x 8 GB SO-DIMM DDR4 3200 MHz", "Chave de precisão", "Guia de instalação"],
    ideal: "Quem usa muitas abas, planilhas ou programas ao mesmo tempo",
    compat: "Requer slots SO-DIMM DDR4 livres (não funciona com RAM soldada). Versão DDR5 sob consulta."
  },
  {
    id: "combo",
    nome: "Kit SSD + RAM",
    imagem: "img/kit-combo.jpg",
    preco: 589.9,
    destaque: true,
    resumo: "O upgrade completo: SSD NVMe 512 GB + 16 GB de RAM. Economia de R$ 49,90.",
    itens: ["SSD NVMe M.2 512 GB", "2x 8 GB SO-DIMM DDR4", "Chave + guia completo"],
    ideal: "Quem quer o máximo de desempenho em um só upgrade",
    compat: "Requer slot M.2 NVMe e slots SO-DIMM DDR4 livres."
  }
];

function formatarPreco(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
