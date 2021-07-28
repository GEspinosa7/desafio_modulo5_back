const express = require('express');
const filtroLogin = require('./filters/filtroLogin');
const { login } = require('./controllers/login');
const { cadastrarUsuario } = require('./controllers/usuarios');
const { listarProdutos, obterProduto, cadastrarProduto, removerProduto, ativarProduto, desativarProduto } = require('./controllers/produtos');

const router = express();

router.post('/usuarios', cadastrarUsuario);
router.post('/login', login);

router.use(filtroLogin);

router.get('/produtos', listarProdutos);
router.get('/produtos/:id', obterProduto);
router.post('/produtos', cadastrarProduto);
//PUT/produtos/:id
router.delete('/produtos/:id', removerProduto);
router.post('/produtos/:id/ativar', ativarProduto);
router.post('/produtos/:id/desativar', desativarProduto);

module.exports = router;