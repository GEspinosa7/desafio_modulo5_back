const knex = require('../database/conexao');

const listarCategorias = async (req, res) => {

  try {
    const categorias = await knex('categoria');

    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }

}

module.exports = { listarCategorias }