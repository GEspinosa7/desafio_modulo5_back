const knex = require('../database/conexao');
const bcrypt = require('bcrypt');
const schemaCadastroUsuario = require('../validations/schemas/schemaCadastroUsuarios');

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, nome_rest, descricao, categoria_id, taxa_entrega, tempo_entrega_minutos, valor_minimo_pedido } = req.body;

  try {
    await schemaCadastroUsuario.validate(req.body);

    const usuarioEncontrado = await knex('usuario').where('email', email);
    if (usuarioEncontrado.length > 0) return res.status(400).json({ erro: 'Este email ja está cadastrado' });

    const cryptSenha = await bcrypt.hash(senha, 10);

    const novoUsuario = () => {
      try {
        return knex('usuario')
          .insert({ nome, email, senha: cryptSenha })
          .returning('id')
          .then((res) => {
            return knex('restaurante')
              .insert({
                usuario_id: res[0],
                nome: nome_rest,
                descricao,
                categoria_id,
                taxa_entrega,
                tempo_entrega_minutos,
                valor_minimo_pedido
              })
          });
      } catch (error) {
        return res.status(400).json(error.message);
      }
    }

    novoUsuario();

    return res.status(200).json({ sucesso: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    return res.status(400).json(error.message);
  }

};


module.exports = { cadastrarUsuario };