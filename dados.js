/* Edite este arquivo para atualizar o site. Valores sempre em CENTAVOS inteiros.
   Ex.: R$ 25,50 = 2550. Datas: AAAA-MM-DD. Tipos: entrada ou saida.
   Comprovante: "comprovantes/arquivo.pdf" ou URL https://; "" se indisponível.
   Substitua TODOS os exemplos antes de definir demonstracao: false. */
window.DADOS = {
  nome: "Doar com clareza",
  descricao: "Um espaço aberto para acompanhar o caminho das doações e a prestação de contas do projeto.",
  sobre: "Este portal reúne as contribuições recebidas e as despesas do projeto. Os registros são atualizados pelo responsável pela prestação de contas, com comprovantes quando disponíveis.",
  email: "",
  demonstracao: true,
  atualizadoEm: "2026-10-23",
  saldoInicialCentavos: 0,
  movimentos: [
    { id: "EX001", data: "2026-09-05", tipo: "entrada", descricao: "Contribuições da campanha — exemplo", categoria: "Doações", valorCentavos: 200000, comprovante: "" },
    { id: "EX002", data: "2026-09-12", tipo: "saida", descricao: "Compra de cestas básicas — exemplo", categoria: "Alimentação", valorCentavos: 80000, comprovante: "" },
    { id: "EX003", data: "2026-10-03", tipo: "entrada", descricao: "Doação anônima — exemplo", categoria: "Doações", valorCentavos: 50000, comprovante: "" },
    { id: "EX004", data: "2026-10-08", tipo: "entrada", descricao: "Contribuições da comunidade — exemplo", categoria: "Doações", valorCentavos: 150000, comprovante: "" },
    { id: "EX005", data: "2026-10-10", tipo: "saida", descricao: "Compra de alimentos — exemplo", categoria: "Alimentação", valorCentavos: 90000, comprovante: "" },
    { id: "EX006", data: "2026-10-15", tipo: "saida", descricao: "Materiais de higiene — exemplo", categoria: "Higiene", valorCentavos: 35000, comprovante: "" },
    { id: "EX007", data: "2026-10-20", tipo: "saida", descricao: "Transporte das doações — exemplo", categoria: "Logística", valorCentavos: 15000, comprovante: "" }
  ]
};
