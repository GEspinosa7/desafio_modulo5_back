const knex = require('../database/conexao');
const bcrypt = require('bcrypt');
const schemaCadastroUsuario = require('../validations/schemas/schemaCadastroUsuarios');

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, restaurante } = req.body;

  try {
    await schemaCadastroUsuario.validate(req.body);

    const usuarioEncontrado = await knex('usuario').where({ email }).first();
    if (usuarioEncontrado) return res.status(409).json({ erro: 'Este email ja está cadastrado' });

    const cryptSenha = await bcrypt.hash(senha, 10);

    knex('usuario')
      .insert({ nome, email, senha: cryptSenha })
      .returning('id')
      .then((res) => {
        return knex('restaurante')
          .insert({
            usuario_id: res[0],
            nome: restaurante.nome,
            descricao: restaurante.descricao,
            categoria_id: restaurante.idCategoria,
            taxa_entrega: restaurante.taxaEntrega,
            tempo_entrega_minutos: restaurante.tempoEntregaEmMinutos,
            valor_minimo_pedido: restaurante.valorMinimoPedido
          })
      });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = { cadastrarUsuario };