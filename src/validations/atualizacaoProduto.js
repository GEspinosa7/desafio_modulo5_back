const validarAtualizacaoProduto = ({ nome, preco, imagem }) => {
  if (nome === null) return 'Campo nome não pode ser vazio';
  if (preco === null || preco === '') return 'Campo preco não pode ser vazio';
}

module.exports = validarAtualizacaoProduto;