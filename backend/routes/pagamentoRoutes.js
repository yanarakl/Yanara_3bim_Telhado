const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');

// Rotas do CRUD de pagamentos
router.get('/listar', pagamentoController.listarPagamentos);
router.get('/:id', pagamentoController.obterPagamento);
router.post('/', pagamentoController.criarPagamento);
router.put('/:id', pagamentoController.atualizarPagamento);
router.delete('/:id', pagamentoController.deletarPagamento);

module.exports = router;