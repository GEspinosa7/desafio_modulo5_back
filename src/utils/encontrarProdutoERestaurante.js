const knex = require('../database/conexao');

const encontrarProdutoERestaurante = async (usuario, id) => {
  try {
    const restaurante = await knex('restaurante').where('usuario_id', usuario.id);
    const produto = await knex('produto').where({ restaurante_id: restaurante[0].id, id }).first();

    if (!produto) return res.status(400).json({ erro: 'Produto não encontrado' });

    return { produto, restaurante };
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = encontrarProdutoERestaurante;