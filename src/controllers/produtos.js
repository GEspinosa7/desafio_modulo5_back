const knex = require('../database/conexao');
const schemaCadastroProduto = require('../validations/schemas/schemaCadastroProdutos');

const listarProdutos = async (req, res) => {
  const { usuario } = req;

  try {
    const restaurante = await knex('restaurante').where('usuario_id', usuario.id);
    const produtos = await knex('produto').where({ restaurante_id: restaurante[0].id });

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
    const produto = await knex('produto').where({ restaurante_id: restaurante[0].id, id });

    if (!produto) return res.status(400).json({ erro: 'Produto não encontrado' });

    return res.status(200).json(produto);
  } catch (error) {
    return res.status(400).json(error.message);
  }

};

const cadastrarProduto = async (req, res) => {
  const { usuario } = req;
  const { nome, descricao, preco, ativo, permiteObservacoes } = req.body;

  try {
    const restaurante = await knex('restaurante').where('usuario_id', usuario.id);

    await schemaCadastroProduto.validate(req.body);

    const nomeProdutoEncontrado = await knex('produto').where({ nome, restaurante_id: restaurante[0].id }).first();
    if (nomeProdutoEncontrado) return res.status(404).json({ erro: 'Já existe um produto cadastrado com esse nome' });

    const novoProduto = {
      restaurante_id: restaurante[0].id,
      nome,
      descricao,
      preco,
      ativo,
      permite_observacoes: permiteObservacoes
    }

    const { rowCount } = await knex('produto').insert(novoProduto);
    if (rowCount === 0) return res.status(400).json({ Erro: 'Não foi possível cadastrar este produto' });

    return res.status(200).json({ Sucesso: 'Produto cadastrado!' });
  } catch (error) {
    return res.status(400).json(error.message);
  }

};

const atualizarProduto = async (req, res) => { };

const removerProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {
    const restaurante = await knex('restaurante').where('usuario_id', usuario.id);
    const produto = await knex('produto').where({ restaurante_id: restaurante[0].id, id });

    if (produto.length === 0) return res.status(200).json({ erro: 'Produto não encontrado' });

    const { rowCount } = await knex('produto').del().where({ id, restaurante_id: restaurante[0].id });
    if (rowCount === 0) return res.status(400).json({ erro: 'Não foi possível apagar este produto' });


    return res.status(200).json({ sucesso: 'Produto removido com sucesso' });
  } catch (error) {
    return res.status(400).json(error.message);
  }

};

const ativarProduto = async (req, res) => { };

const desativarProduto = async (req, res) => { };


module.exports = {
  listarProdutos,
  obterProduto,
  cadastrarProduto,
  removerProduto
}