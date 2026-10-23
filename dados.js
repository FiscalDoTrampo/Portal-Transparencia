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
    { id: "D001", data: "2026-10-23", tipo: "entrada", descricao: "Doação de Guilherme Borges", categoria: "Doações", valorCentavos: 10000, comprovante: "" }
  ]
};
