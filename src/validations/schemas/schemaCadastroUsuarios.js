const yup = require('../configuracoes');

const schemaCadastroUsuario = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().email().required(),
  senha: yup.string().required(),
  nome_rest: yup.string().required(),
  descricao: yup.string(),
  categoria_id: yup.number().integer().required(),
  taxa_entrega: yup.number().integer().default(0),
  tempo_entrega_minutos: yup.number().integer().default(30),
  valor_minimo_pedido: yup.number().integer().default(0)
});

module.exports = schemaCadastroUsuario;