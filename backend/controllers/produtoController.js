const { query } = require('../database');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

exports.listarProdutosPorCategoria = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        }

        const result = await query('SELECT * FROM public.produto WHERE id_categoria = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Nenhum Produto nessa categoria.' });
        }

        res.json({ sucesso: true, produto: result.rows });
    } catch (error) {
        console.error('Erro ao obter produto:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
}

// Listar todos os produtos
exports.listarProdutos = async (req, res) => {
    try {
        const result = await query(`
            SELECT 
                produto.*,
                categoria.nome_categoria
            FROM public.produto
            INNER JOIN public.categoria
                ON produto.id_categoria = categoria.id_categoria
            ORDER BY produto.id_produto
        `);
        res.json({ sucesso: true, produtos: result.rows });
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar produtos.' });
    }
};

// Obter produto por ID
exports.obterProduto = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        }

        const result = await query('SELECT * FROM public.produto WHERE id_produto = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado.' });
        }

        res.json({ sucesso: true, produto: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter produto:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar produto
exports.criarProduto = async (req, res) => {
    try {
        const {
            id_produto,
            nome_produto,
            descricao_produto,
            preco_produto,
            id_categoria_produto
        } = req.body;

        if (!nome_produto || !descricao_produto || !preco_produto || !id_categoria_produto) {
            return res.status(400).json({ sucesso: false, mensagem: 'Os atributos são obrigatórios.' });
        }

        const sql = `
            INSERT INTO public.produto (id_produto, nome_produto, descricao_produto, preco_produto, id_categoria)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const values = [
            id_produto,
            nome_produto,
            descricao_produto,
            preco_produto || 0.0,
            id_categoria_produto || null
        ];

        const result = await query(sql, values);
        res.status(201).json({ sucesso: true, mensagem: 'Produto inserido com sucesso!', produto: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'categoria informada não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir produto no banco de dados.' });
    }
};

// Atualizar produto
exports.atualizarProduto = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        console.log("DADOS RECEBIDOS:", req.body);
        const { nome_produto, descricao_produto, preco_produto, id_categoria_produto } = req.body;
        const sql = `
            UPDATE public.produto 
            SET nome_produto = $1, 
                descricao_produto = $2, 
                preco_produto = $3, 
                id_categoria = $4 
            WHERE id_produto = $5
            RETURNING *
        `;

        const values = [
            nome_produto, 
            descricao_produto, 
            preco_produto, 
            id_categoria_produto,
            id
        ];

        const result = await query(sql, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado.' });
        }

        res.json({ sucesso: true, mensagem: 'Produto alterado com sucesso!', produto: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'O categoria informada não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar produto.' });
    }
};

exports.uploadImagem = async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.file) {
            return res.status(400).json({ sucesso: false, mensagem: 'Nenhum arquivo enviado.' });
        }

        const pastaImagens = path.join(__dirname, '../../imagens');
        if (!fs.existsSync(pastaImagens)) {
            fs.mkdirSync(pastaImagens, { recursive: true });
        }

        const caminhoDestino = path.join(pastaImagens, `${id}.png`);

        // Processa e converte para PNG no tamanho ideal
        await sharp(req.file.buffer)
            .resize(300, 300, { fit: 'cover' })
            .toFormat('png')
            .toFile(caminhoDestino);

        res.json({ sucesso: true, mensagem: 'Imagem salva com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar imagem:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao processar imagem.' });
    }
};

// Deletar produto
exports.deletarProduto = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        await query('DELETE FROM public.produto WHERE id_produto = $1', [id]);

        res.json({ sucesso: true, mensagem: 'Produto excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir produto.' });
    }
};