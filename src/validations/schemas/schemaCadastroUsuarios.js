const yup = require('../configuracoes');

const schemaCadastroUsuario = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().email().required(),
  senha: yup.string().required(),
  restaurante: yup.object().shape({
    nome: yup.string().required(),
    descricao: yup.string(),
    idCategoria: yup.number().integer().required(),
    taxaEntrega: yup.number().integer().default(0),
    tempoEntregaEmMinutos: yup.number().integer().default(30),
    valorMinimoPedido: yup.number().integer().default(0)
  })
});

module.exports = schemaCadastroUsuario;