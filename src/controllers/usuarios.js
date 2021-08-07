const knex = require("../database/conexao");
const bcrypt = require("bcrypt");
const schemaCadastroUsuario = require("../validations/schemas/schemaCadastroUsuarios");
const validarAtualizacaoUsuario = require("../validations/atualizacaoUsuario");
const uploadImagem = require('../utils/uploads');

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

const atualizarUsuario = async (req, res) => {
  const { usuario } = req;
  const { nome, email, senha, restaurante } = req.body;

  const erro = validarAtualizacaoUsuario(req.body);
  if (erro) return res.status(400).json({ erro: erro });

  try {
    const usuarioEncontrado = await knex("usuario").where({ email }).whereNot({ id: usuario.id }).first();
    if (usuarioEncontrado) return res.status(409).json({ erro: "Este email ja está cadastrado" });

    let novosDadosUsuario;
    if (senha) {
      const cryptSenha = await bcrypt.hash(senha, 10);
      novosDadosUsuario = await knex('usuario').update({ nome, email, senha: cryptSenha }).where({ id: usuario.id }).returning('*');
    } else {
      novosDadosUsuario = await knex('usuario').update(req.body).where({ id: usuario.id }).returning('*');
    }
    if (novosDadosUsuario.rowCount === 0) return res.status(400).json({ Erro: 'Não foi possível atualizar este usuario' });

    const { errorUpload, imagem_url } = await uploadImagem(restaurante.nomeImagem, restaurante.imagem, restaurante.nome);
    if (errorUpload) {
      if (errorUpload === `duplicate key value violates unique constraint \"bucketid_objname\"`) return res.status(400).json({
        erro: "Esta imagem é a mesma da anterior!"
      });
      return res.status(400).json({ erro: errorUpload });
    }

    const novosDadosRestauranteUsuario = await knex('restaurante').update({
      nome: restaurante.nome,
      descricao: restaurante.descricao,
      categoria_id: restaurante.idCategoria,
      taxa_entrega: Number(restaurante.taxaEntrega),
      tempo_entrega_minutos: Number(restaurante.tempoEntregaEmMinutos),
      valor_minimo_pedido: Number(restaurante.valorMinimoPedido),
      nome_imagem: restaurante.nomeImagem,
      imagem: imagem_url
    }).where({ id: req.restaurante[0].id, usuario_id: usuario.id }).returning('*');

    if (novosDadosRestauranteUsuario.rowCount === 0) return res.status(400).json({ Erro: 'Não foi possível atualizar os dados do restaurante' });

    const atualizado = {
      nome: novosDadosUsuario[0].nome,
      email: novosDadosUsuario[0].email,
      restaurante: {
        nome: novosDadosRestauranteUsuario[0].nome,
        categoria_id: novosDadosRestauranteUsuario[0].categoria_id,
        taxa_entrega: novosDadosRestauranteUsuario[0].taxa_entrega,
        tempo_entrega_minutos: novosDadosRestauranteUsuario[0].tempo_entrega_minutos,
        valor_minimo_pedido: novosDadosRestauranteUsuario[0].valor_minimo_pedido,
        nome_imagem: restaurante.nomeImagem,
        imagem: imagem_url
      }
    }

    return res.status(200).json(atualizado);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  cadastrarUsuario,
  atualizarUsuario
};
