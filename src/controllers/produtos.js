const knex = require('../database/conexao');

const listarProdutos = async (req, res) => {
  const { usuario } = req;

  try {
    const restaurante = await knex('restaurante').where('usuario_id', usuario.id);
    const produtos = await knex('produto').where({ restaurante_id: restaurante[0].id }).debug();

    return res.status(200).json(produtos);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const obterProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {
    const restaurante = await knex('restaurante').where('usuario_id', usuario.id);
    const produto = await knex('produto').where({ restaurante_id: restaurante[0].id, id }).debug();

    if (!produto) return res.status(400).json({ erro: 'Produto não encontrado' });

    return res.status(200).json(produto);
  } catch (error) {
    return res.status(400).json(error.message);
  }

};

const cadastrarProduto = async (req, res) => { };

const atualizarProduto = async (req, res) => { };

const removerProduto = async (req, res) => { };

const ativarProduto = async (req, res) => { };

const desativarProduto = async (req, res) => { };


module.exports = {
  listarProdutos,
  obterProduto
}