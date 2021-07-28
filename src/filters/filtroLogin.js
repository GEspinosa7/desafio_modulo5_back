const knex = require('../database/conexao');
const jwt = require('jsonwebtoken');

const loginAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(400).json({ erro: 'Token não informado' });

  try {
    const token = authorization.replace('Bearer', '').trim();

    const { id } = jwt.verify(token, process.env.SENHA_HASH);

    const usuario = await knex('usuario').where('id', id).first().debug();
    if (!usuario) return res.status(404).json({ erro: 'Este usuario não foi encontrado' });

    const { senha: senhaUsuario, ...dadosUsuario } = usuario;

    req.usuario = dadosUsuario;

    next();
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

module.exports = loginAuth;