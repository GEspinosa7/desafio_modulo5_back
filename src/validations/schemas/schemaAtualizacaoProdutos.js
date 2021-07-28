const yup = require('../configuracoes');

const schemaAtualizacaoProdutos = yup.object().shape({
  nome: yup.string(),
  descricao: yup.string(),
  preco: yup.number().integer(),
  ativo: yup.boolean(),
  permiteObservacoes: yup.boolean()
});

module.exports = schemaAtualizacaoProdutos;