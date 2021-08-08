const knex = require('../database/conexao');
const schemaCadastroProduto = require('../validations/schemas/schemaCadastroProdutos');
const schemaAtualizacaoProdutos = require('../validations/schemas/schemaAtualizacaoProdutos');
const validarAtualizacaoProduto = require('../validations/atualizacaoProduto');
const uploadImagem = require('../utils/uploads');
const supabase = require('../supabase');

const listarProdutos = async (req, res) => {
  const { restaurante } = req;

  try {
    const produtos = await knex('produto').where({ restaurante_id: restaurante[0].id });

    return res.status(200).json(produtos);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

const obterProduto = async (req, res) => {
  const { restaurante } = req;
  const { id } = req.params;

  try {
    const produto = await knex('produto').where({ restaurante_id: restaurante[0].id, id }).first();
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

    return res.status(200).json(produto);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

const cadastrarProduto = async (req, res) => {
  const { restaurante } = req;
  const { nome, descricao, preco, ativo, permiteObservacoes, nomeImagem, imagem } = req.body;

  try {
    await schemaCadastroProduto.validate(req.body);

    const nomeProdutoEncontrado = await knex('produto').where({ nome, restaurante_id: restaurante[0].id }).first();
    if (nomeProdutoEncontrado) return res.status(404).json({ erro: 'Já existe um produto cadastrado com esse nome' });

    if (!imagem || imagem === null) {
      const novoProduto = {
        restaurante_id: restaurante[0].id,
        nome,
        descricao,
        preco,
        ativo,
        permite_observacoes: permiteObservacoes,
        nome_imagem: null,
        imagem: null
      }

      const produto = await knex('produto').insert(novoProduto).returning('*');
      if (produto.rowCount === 0) return res.status(400).json({ erro: 'Não foi possível cadastrar este produto' });

      return res.status(200).json(produto[0]);
    }

    const nomeRestauranteFormatado = restaurante[0].nome.trim().replace(/\s/g, '_');
    const nomeImagemFormatada = nomeImagem.trim().replace(/\s/g, '_');

    let { errorUpload, imagem_url } = await uploadImagem(nomeImagemFormatada, imagem, nomeRestauranteFormatado);
    if (errorUpload && errorUpload === `duplicate key value violates unique constraint \"bucketid_objname\"`) {
      const { publicURL, error } = supabase
        .storage
        .from(nomeRestauranteFormatado)
        .getPublicUrl(`${nomeRestauranteFormatado}/${nomeImagemFormatada}`);

      imagem_url = publicURL;
    }
    if (errorUpload && errorUpload !== `duplicate key value violates unique constraint \"bucketid_objname\"`) {
      return res.status(400).json({ erro: errorUpload });
    }

    const index = imagem_url.indexOf(`${nomeImagemFormatada}`);
    const url_formatada = `${imagem_url.slice(' ', index)}${nomeRestauranteFormatado}/${nomeImagemFormatada}`;

    const novoProduto = {
      restaurante_id: restaurante[0].id,
      nome,
      descricao,
      preco,
      ativo,
      permite_observacoes: permiteObservacoes,
      nome_imagem: nomeImagem,
      imagem: url_formatada
    }

    const produto = await knex('produto').insert(novoProduto).returning('*');
    if (produto.rowCount === 0) return res.status(400).json({ erro: 'Não foi possível cadastrar este produto' });

    return res.status(200).json(produto[0]);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

const atualizarProduto = async (req, res) => {
  const { restaurante } = req;
  const { id } = req.params;
  const { nome, descricao, preco, ativo, permiteObservacoes, nomeImagem, imagem } = req.body;

  const erro = validarAtualizacaoProduto(req.body);
  if (erro) return res.status(400).json({ erro: erro });

  try {
    await schemaAtualizacaoProdutos.validate(req.body);

    const produto = await knex('produto').where({ restaurante_id: restaurante[0].id, id }).first();
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

    if (!imagem || imagem === null) {
      const novosDadosProduto = {
        nome,
        descricao,
        preco,
        ativo,
        permite_observacoes: permiteObservacoes,
        nome_imagem: null,
        imagem: null
      }

      const produtoAtualizado = await knex('produto').update(novosDadosProduto).where({ id, restaurante_id: restaurante[0].id }).returning('*');
      if (produtoAtualizado.rowCount === 0) return res.status(400).json({ erro: 'Não foi possível atualizar os dados deste produto' });

      return res.status(200).json(produtoAtualizado[0]);
    }

    const nomeRestauranteFormatado = restaurante[0].nome.trim().replace(/\s/g, '_');
    const nomeImagemFormatada = nomeImagem.trim().replace(/\s/g, '_');

    let { errorUpload, imagem_url } = await uploadImagem(nomeImagemFormatada, imagem, nomeRestauranteFormatado);
    if (errorUpload && errorUpload === `duplicate key value violates unique constraint \"bucketid_objname\"`) {
      const { publicURL, error } = supabase
        .storage
        .from(nomeRestauranteFormatado)
        .getPublicUrl(`${nomeRestauranteFormatado}/${nomeImagemFormatada}`);

      imagem_url = publicURL;
    }
    if (errorUpload && errorUpload !== `duplicate key value violates unique constraint \"bucketid_objname\"`) {
      return res.status(400).json({ erro: errorUpload });
    }

    const index = imagem_url.indexOf(`${nomeImagemFormatada}`);
    const url_formatada = `${imagem_url.slice(' ', index)}${nomeRestauranteFormatado}/${nomeImagemFormatada}`;

    const novosDadosProduto = {
      nome,
      descricao,
      preco,
      ativo,
      permite_observacoes: permiteObservacoes,
      nome_imagem: nomeImagem,
      imagem: url_formatada
    }

    const produtoAtualizado = await knex('produto').update(novosDadosProduto).where({ id, restaurante_id: restaurante[0].id }).returning('*');
    if (produtoAtualizado.rowCount === 0) return res.status(400).json({ erro: 'Não foi possível atualizar os dados deste produto' });

    return res.status(200).json(produtoAtualizado[0]);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }

};

const removerProduto = async (req, res) => {
  const { restaurante } = req;
  const { id } = req.params;

  try {
    const produto = await knex('produto').where({ restaurante_id: restaurante[0].id, id }).first();
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

    if (produto.ativo) return res.status(400).json({ erro: 'Não é possivel remover um produto ativo' });

    const { rowCount } = await knex('produto').del().where({ id, restaurante_id: restaurante[0].id });
    if (rowCount === 0) return res.status(400).json({ erro: 'Não foi possível apagar este produto' });

    return res.status(200).json({ sucesso: 'Produto removido com sucesso' });
  } catch (error) {

    return res.status(400).json({ erro: error.message });
  }
};

const ativarProduto = async (req, res) => {
  const { restaurante } = req;
  const { id } = req.params;

  try {
    const produto = await knex('produto').where({ restaurante_id: restaurante[0].id, id }).first();
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

    const { rowCount } = await knex('produto').update({ 'ativo': true }).where({ id, restaurante_id: restaurante[0].id });
    if (rowCount === 0) return res.status(400).json({ erro: 'Não foi possível ativar este produto' });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

const desativarProduto = async (req, res) => {
  const { restaurante } = req;
  const { id } = req.params;

  try {
    const produto = await knex('produto').where({ restaurante_id: restaurante[0].id, id }).first();
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

    const { rowCount } = await knex('produto').update({ 'ativo': false }).where({ id, restaurante_id: restaurante[0].id });
    if (rowCount === 0) return res.status(400).json({ erro: 'Não foi possível desativar este produto' });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

module.exports = {
  listarProdutos,
  obterProduto,
  cadastrarProduto,
  removerProduto,
  atualizarProduto,
  ativarProduto,
  desativarProduto
}