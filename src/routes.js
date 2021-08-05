const express = require('express');
const filtroLogin = require('./filters/filtroLogin');
const { login } = require('./controllers/login');
const { cadastrarUsuario, atualizarUsuario } = require('./controllers/usuarios');
const { listarProdutos, obterProduto, cadastrarProduto, removerProduto, ativarProduto, desativarProduto, atualizarProduto } = require('./controllers/produtos');

const router = express();

router.post('/usuarios', cadastrarUsuario);
router.post('/login', login);

router.use(filtroLogin);

router.put('/usuarios', atualizarUsuario);

router.get('/produtos', listarProdutos);
router.get('/produtos/:id', obterProduto);
router.post('/produtos', cadastrarProduto);
router.put('/produtos/:id', atualizarProduto);
router.delete('/produtos/:id', removerProduto);
router.post('/produtos/:id/ativar', ativarProduto);
router.post('/produtos/:id/desativar', desativarProduto);

module.exports = router;