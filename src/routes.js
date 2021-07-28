const express = require('express');
const filtroLogin = require('./filters/filtroLogin');
const { login } = require('./controllers/login');
const { cadastrarUsuario } = require('./controllers/usuarios');

const router = express();

router.post('/usuarios', cadastrarUsuario);
router.post('/login', login);

router.use(filtroLogin);

//GET/produtos
//GET/produtos/:id
//POST/produtos
//PUT/produtos/:id
//DELETE/produtos/:id
//POST/produtos/:id/ativar
//POST/produtos/:id/desativar

// router.get('/test', (req, res) => {
//   return res.json({ teste: true });
// })

module.exports = router;