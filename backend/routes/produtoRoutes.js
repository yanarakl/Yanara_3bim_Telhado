const express = require('express');
const multer = require('multer');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

const upload = multer({ storage: multer.memoryStorage() });

// Rotas do CRUD de produtos
router.get('/listar', produtoController.listarProdutos);
router.get('/categoria/:id', produtoController.listarProdutosPorCategoria);
router.get('/:id', produtoController.obterProduto);
router.post('/', produtoController.criarProduto);
router.put('/:id', produtoController.atualizarProduto);
router.delete('/:id', produtoController.deletarProduto);

router.post('/upload/:id', upload.single('imagem'), produtoController.uploadImagem);


module.exports = router;