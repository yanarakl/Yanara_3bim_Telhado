const { query } = require('../database');

// Listar todos os pagamentos
exports.listarPagamentos = async (req, res) => {
    try {
        const result = await query('SELECT * FROM public.pagamento ORDER BY id_pagamento');
        res.json({ sucesso: true, pagamentos: result.rows });
    } catch (error) {
        console.error('Erro ao listar pagamentos:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar pagamentos.' });
    }
};

// Obter pagamento por ID
exports.obterPagamento = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        }

        const result = await query('SELECT * FROM public.pagamento WHERE id_pagamento = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Pagamento não encontrado.' });
        }

        res.json({ sucesso: true, pagamento: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter pagamento:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar pagamento
exports.criarPagamento = async (req, res) => {
    try {
        const {
            id_pagamento,
            id_pedido,
            forma_pagamento,
            valor_pagamento,
            status_pagamento
        } = req.body;

        if (!id_pedido || !forma_pagamento || !valor_pagamento || !status_pagamento) {
            return res.status(400).json({ sucesso: false, mensagem: 'Os atributos são obrigatórios.' });
        }

        const sql = `
            INSERT INTO public.pagamento (id_pagamento, id_pedido, forma_pagamento, valor, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const values = [
            id_pagamento,
            id_pedido ,
            forma_pagamento || null,
            valor_pagamento,
            status_pagamento || null
        ];

        const result = await query(sql, values);
        res.status(201).json({ sucesso: true, mensagem: 'Pagamento inserido com sucesso!', pagamento: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar pagamento:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'cliente informado não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir pagamento no banco de dados.' });
    }
};

// Atualizar pagamento
exports.atualizarPagamento = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        console.log("DADOS RECEBIDOS:", req.body);
        const { id_pedido, forma_pagamento, valor_pagamento, status_pagamento } = req.body;
        const sql = `
            UPDATE public.pedido 
            SET id_pedido = $1, 
                forma_pagamento = $2, 
                valor = $3, 
                status = $4 
            WHERE id_pagamento = $5
            RETURNING *
        `;

        const values = [
            id_pedido,
            forma_pagamento,
            valor_pagamento,
            status_pagamento,
            id
        ];

        const result = await query(sql, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Pagamento não encontrado.' });
        }

        res.json({ sucesso: true, mensagem: 'Pagamento alterado com sucesso!', pagamento: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar pagamento:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'O cliente informado não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar pagamento.' });
    }
};

// Deletar pagamento
exports.deletarPagamento = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        await query('DELETE FROM public.pagamento WHERE id_pagamento = $1', [id]);

        res.json({ sucesso: true, mensagem: 'Pagamento excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar pagamento:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir pagamento.' });
    }
};