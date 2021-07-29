const knex = require('../database/conexao');

const encontrarProdutoERestaurante = async (usuario, res, id) => {
  try {
    let restaurante, produto;
    if (id) {
      restaurante = await knex('restaurante').where('usuario_id', usuario.id);
      produto = await knex('produto').where({ restaurante_id: restaurante[0].id, id }).first();

      if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    } else {
      restaurante = await knex('restaurante').where('usuario_id', usuario.id);
    }

    return { produto, restaurante };
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = encontrarProdutoERestaurante;