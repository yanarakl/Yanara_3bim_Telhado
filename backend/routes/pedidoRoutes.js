const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Rotas do CRUD de pedidos
router.get('/listar', pedidoController.listarPedidos);
router.get('/sem-pagamento', pedidoController.listarPedidosSemPagamento);
router.get('/:id', pedidoController.obterPedido);
router.post('/', pedidoController.criarPedido);
router.put('/:id', pedidoController.atualizarPedido);
router.delete('/:id', pedidoController.deletarPedido);

module.exports = router;