const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');

const router = express.Router();

// POST /api/usuarios/cadastro - Cadastrar novo usuário
router.post('/cadastro', UsuarioController.cadastro);

// GET /api/usuarios - Listar todos os usuários (para testes/admin)
router.get('/', UsuarioController.listarUsuarios);

// GET /api/usuarios/:id - Buscar usuário por ID
router.get('/:id', UsuarioController.buscarUsuario);

module.exports = router;