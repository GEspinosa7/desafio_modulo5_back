const knex = require('../database/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const schemaLogin = require('../validations/schemas/schemaLogin');

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    await schemaLogin.validate(req.body);

    const usuario = await knex('usuario').where({ email }).first();
    if (!usuario) return res.status(404).json({ erro: 'Este usuario não foi encontrado' });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(400).json("O email ou senha estão incorretos");

    const token = jwt.sign({ id: usuario.id }, process.env.SENHA_HASH);

    const { senha: _, ...dadosUsuario } = usuario;

    return res.status(200).json({
      usuario: dadosUsuario,
      token,
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = { login }