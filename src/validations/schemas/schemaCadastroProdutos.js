const yup = require('../configuracoes');

const schemaCadastroProdutos = yup.object().shape({
  nome: yup.string().required(),
  descricao: yup.string(),
  preco: yup.number().integer().required(),
  ativo: yup.boolean().required().default(true),
  permiteObservacoes: yup.boolean().required().default(false)
});

module.exports = schemaCadastroProdutos;