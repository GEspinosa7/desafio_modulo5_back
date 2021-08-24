const knex = require('../database/conexao');

const listarPedidos = async (req, res) => {
  const { restaurante } = req;

  try {
    const restaurantes = await knex('restaurante').where({ id: restaurante[0].id }).first();
    if (!restaurantes) return res.status(404).json({ erro: "Este restaurante não existe" });

    const pedidos = await knex('pedido')
      .join('consumidor', 'pedido.consumidor_id', '=', 'consumidor.id')
      .join('endereco', 'pedido.consumidor_id', '=', 'endereco.consumidor_id')
      .select(
        'pedido.id',
        'pedido.entregue',
        'pedido.valor_total',
        'pedido.consumidor_id',
        'consumidor.nome',
        'endereco.cep',
        'endereco.endereco',
        'endereco.complemento',
      ).groupBy(
        'pedido.id',
        'consumidor.nome',
        'endereco.cep',
        'endereco.endereco',
        'endereco.complemento'
      ).where({ restaurante_id: restaurante[0].id })
      .orderBy('pedido.id');

    const produtosPedido = [];
    for (let item of pedidos) {
      const produtos = await knex('produto_pedido').where({ pedido_id: item.id })
        .join('produto', 'produto.id', '=', 'produto_pedido.produto_id')
        .select(
          'produto.nome',
          'produto_pedido.quantidade'
        );

      if (produtos.length > 0) produtosPedido.push({ pedido_id: item.id, produtos });

      for (let pedido of pedidos) {
        if (pedido.id === item.id) pedido.produtos = produtos
      }
    }

    const result = [];
    for (let objeto of pedidos) {
      result.push({
        id: objeto.id,
        entregue: objeto.entregue,
        valor_total: objeto.valor_total,
        consumidor: {
          id: objeto.consumidor_id,
          nome: objeto.nome
        },
        consumidor_endereco: {
          cep: objeto.cep,
          endereco: objeto.endereco,
          complemento: objeto.complemento
        },
        produtos: objeto.produtos
      })
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
}

// const obterPedido = async (req, res) => {
//   const { idRes, idPed } = req.params;

//   try {
//     const restaurantes = await knex('restaurante').where({ id: idRes }).first();
//     if (!restaurantes) return res.status(404).json({ erro: "Este restaurante não existe" });

//     const pedido = await knex('pedido').where({ id: idPed, restaurante_id: idRes }).first();
//     if (!pedido) return res.status(404).json({ erro: "Este pedido não existe" });

//     const produtosPedido = await knex('produto_pedido').where({ pedido_id: idPed });

//     pedido.produtos = produtosPedido;

//     return res.status(200).json(pedido);
//   } catch (error) {
//     return res.status(400).json({ erro: error.message });
//   }

// }

// const enviarPedido = async (req, res) => {

// }

module.exports = {
  listarPedidos,
  // obterPedido,
  // enviarPedido
}