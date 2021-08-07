const validarAtualizacaoProduto = ({ nome, preco, imagem }) => {
  if (imagem === null) return 'A imagem está recebendo um tipo inválido!';
  if (nome === null) return 'Campo nome não pode ser vazio';
  if (preco === null || preco === '') return 'Campo preco não pode ser vazio';
}

module.exports = validarAtualizacaoProduto;