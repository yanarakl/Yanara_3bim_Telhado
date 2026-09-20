const { query } = require('../database');

// Listar todas as clientes
exports.listarClientes = async (req, res) => {
    try {
        const result = await query('SELECT * FROM public.cliente ORDER BY id_cliente');
        res.json({ sucesso: true, clientes: result.rows });
    } catch (error) {
        console.error('Erro ao listar cliente:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar cliente.' });
    }
};

// Obter cliente por ID
exports.obterCliente = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'cliente deve ser um número válido' });
        }

        const result = await query('SELECT * FROM public.cliente WHERE id_cliente = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'cliente não encontrado.' });
        }

        res.json({ sucesso: true, cliente: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter cliente:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar cliente
exports.criarCliente = async (req, res) => {
    try {
        const { id_cliente, nome_cliente, email, telefone } = req.body;
        if (!nome_cliente || !email || !telefone) {
            return res.status(400).json({ sucesso: false, mensagem: 'O nome da cliente e descrição são obrigatórios.' });
        }

        const sql = `
            INSERT INTO public.cliente (id_cliente, nome_cliente, email, telefone)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const result = await query(sql, [
            id_cliente,
            nome_cliente,
            email,
            telefone
        ]);
        res.status(201).json({ sucesso: true, mensagem: 'cliente inserida com sucesso!', cliente: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        if (error.code === '23505') {
            return res.status(400).json({ sucesso: false, mensagem: 'cliente já está cadastrada.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir cliente no banco de dados.' });
    }
};

// Atualizar cliente
exports.atualizarCliente = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nome_cliente, email, telefone } = req.body;

        const sql = `
            UPDATE public.cliente
            SET nome_cliente = $1,
            email = $2,
            telefone = $3
            WHERE id_cliente = $4
            RETURNING *
        `;

        const result = await query(sql, [nome_cliente, email, telefone, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'cliente não encontrado.' });
        }

        res.json({ sucesso: true, mensagem: 'cliente alterado com sucesso!', cliente: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar cliente.' });
    }
};

// Deletar cliente
exports.deletarCliente = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        await query('DELETE FROM public.cliente WHERE id_cliente = $1', [id]);

        res.json({ sucesso: true, mensagem: 'cliente excluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'Não é possível excluir: existem produtos associados a esta cliente.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir cliente.' });
    }
};