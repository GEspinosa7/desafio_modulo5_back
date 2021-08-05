const validarAtualizacaoUsuario = ({ nome, email, senha, preco, restaurante }) => {
  if (nome === null) return 'Campo nome não pode ser vazio';
  if (email === null) return 'Campo email não pode ser vazio';
  if (senha === null) return 'Campo senha não pode ser vazio';
  if (preco === null || preco === '') return 'Campo preco não pode ser vazio';
  if (restaurante.nome === null || restaurante.nome === '') return 'O nome do restaurante não pode ser vazio';
  if (restaurante.idCategoria === null || restaurante.idCategoria === '') return 'O restaurante precisa de uma categoria';
  if (restaurante.taxaEntrega === null || restaurante.taxaEntrega === '') return 'O restaurante precisa de uma taxa de entrega';
  if (restaurante.tempoEntregaEmMinutos === null || restaurante.tempoEntregaEmMinutos === '') return 'O restaurante precisa de um tempo de entrega';
  if (restaurante.valorMinimoPedido === null || restaurante.valorMinimoPedido === '') return 'O restaurante precisa de um valor minimo para um pedido';

}

module.exports = validarAtualizacaoUsuario;