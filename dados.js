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
  atualizadoEm: "2026-10-24",
  saldoInicialCentavos: 0,
  movimentos: [
    { id: "D001", data: "2026-10-23", tipo: "entrada", descricao: "Doação de Guilherme Borges", categoria: "Doações", valorCentavos: 22000, comprovante: "" },
    { id: "D002", data: "2026-10-24", tipo: "entrada", descricao: "Doação de Lucas Eduardo De Morais Paiva Teles", categoria: "Doações", valorCentavos: 5000, comprovante: "" },
    { id: "D003", data: "2026-10-28", tipo: "entrada", descricao: "Doação de Isabele Ribeiro de Morais", categoria: "Doações", valorCentavos: 3000, comprovante: "" },
    { id: "D004", data: "2026-10-28", tipo: "entrada", descricao: "Diego Ferreira Rezende", categoria: "Doações", valorCentavos: 47400, comprovante: "" }
  ]
};
