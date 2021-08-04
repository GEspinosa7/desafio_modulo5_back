const knex = require("../database/conexao");
const bcrypt = require("bcrypt");
const schemaCadastroUsuario = require("../validations/schemas/schemaCadastroUsuarios");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, restaurante } = req.body;

  try {
    await schemaCadastroUsuario.validate(req.body);

    const usuarioEncontrado = await knex("usuario").where({ email }).first();
    if (usuarioEncontrado)
      return res.status(409).json({ erro: "Este email ja está cadastrado" });

    const cryptSenha = await bcrypt.hash(senha, 10);

    const usuario = Promise.resolve(knex("usuario")
      .insert({ nome, email, senha: cryptSenha })
      .returning("id")
      .then((res) => {
        return knex("restaurante").insert({
          usuario_id: res[0],
          nome: restaurante.nome,
          descricao: restaurante.descricao,
          categoria_id: restaurante.idCategoria,
          taxa_entrega: Number(restaurante.taxaEntrega),
          tempo_entrega_minutos: Number(restaurante.tempoEntregaEmMinutos),
          valor_minimo_pedido: Number(restaurante.valorMinimoPedido),
        }).returning("*");
      }));

    usuario.then(function (result) {
      return res.status(200).json(result[0]);
    });

  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

module.exports = { cadastrarUsuario };
