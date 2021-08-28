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

    for (let item of pedidos) {
      const produtos = await knex('produto_pedido').where({ pedido_id: item.id })
        .join('produto', 'produto.id', '=', 'produto_pedido.produto_id')
        .select(
          'produto.nome',
          'produto_pedido.quantidade',
          'produto.preco'
        );

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
        produtos: objeto.produtos,
        restaurante_id: restaurante[0].id
      })
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
}

const obterPedido = async (req, res) => {
  const { restaurante } = req;
  const { id } = req.params;

  try {
    const restaurantes = await knex('restaurante').where({ id: restaurante[0].id }).first();
    if (!restaurantes) return res.status(404).json({ erro: "Este restaurante não existe" });

    const pedido = await knex('pedido').whereRaw(`pedido.id = ${id} and pedido.restaurante_id = ${restaurante[0].id}`)
      .join('consumidor', 'pedido.consumidor_id', '=', 'consumidor.id')
      .join('endereco', 'pedido.consumidor_id', '=', 'endereco.consumidor_id')
      .join('produto_pedido', 'pedido.id', '=', 'produto_pedido.pedido_id')
      .select(
        'pedido.id',
        'pedido.valor_total',
        'pedido.consumidor_id',
        'pedido.entregue',
        'consumidor.nome',
        'endereco.cep',
        'endereco.endereco',
        'endereco.complemento',
        'produto_pedido.quantidade'
      )
      .first();

    const produtos = await knex('produto_pedido')
      .join('produto', 'produto.id', '=', 'produto_pedido.produto_id')
      .where({ pedido_id: id });

    const produtosPedido = [];

    for (const item of produtos) {
      produtosPedido.push({
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco
      });
    }

    const result = {
      id: pedido.id,
      valor_total: pedido.valor_total,
      entregue: pedido.entregue,
      consumidor: {
        id: pedido.consumidor_id,
        nome: pedido.nome,
      },
      consumidor_endereco: {
        cep: pedido.cep,
        endereco: pedido.endereco,
        complemento: pedido.complemento
      },
      produtos: produtosPedido,
      restaurante_id: restaurante[0].id
    }


    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }

}

const enviarPedido = async (req, res) => {
  const { restaurante } = req;
  const { id } = req.params;
  const { entregue } = req.body;

  try {
    const restaurantes = await knex('restaurante').where({ id: restaurante[0].id }).first();
    if (!restaurantes) return res.status(404).json({ erro: "Este restaurante não existe" });

    const pedido = await knex('pedido').whereRaw(`pedido.id = ${id} and pedido.restaurante_id = ${restaurante[0].id}`).first();
    if (!pedido) return res.status(404).json({ erro: "Este pedido não existe" });

    const pedidoEntregue = await knex('pedido').update({ entregue }).whereRaw(`pedido.id = ${id} and pedido.restaurante_id = ${restaurante[0].id}`).returning('*');
    if (pedidoEntregue.rowCount === 0) return res.status(400).json({ erro: 'Não foi possível enviar o pedido' });

    return res.status(200).json(pedidoEntregue[0]);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
}

module.exports = {
  listarPedidos,
  obterPedido,
  enviarPedido
}