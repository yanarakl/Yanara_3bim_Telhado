const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Rotas do CRUD de Cargos
router.get('/listar', clienteController.listarClientes);
router.get('/:id', clienteController.obterCliente);
router.post('/', clienteController.criarCliente);
router.put('/:id', clienteController.atualizarCliente);
router.delete('/:id', clienteController.deletarCliente);

module.exports = router;