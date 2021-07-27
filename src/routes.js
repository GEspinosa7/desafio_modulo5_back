const express = require('express');
const { cadastrarUsuario } = require('./controllers/usuarios');

const router = express();

//POST/usuarios
router.post('/usuarios', cadastrarUsuario);
//POST/login

//abaixo precisa de autenticação 

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