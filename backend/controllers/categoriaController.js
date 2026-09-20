const { query } = require('../database');

// Listar todas as categorias
exports.listarCategorias = async (req, res) => {
    try {
        const result = await query('SELECT * FROM public.categoria ORDER BY id_categoria');
        res.json({ sucesso: true, categorias: result.rows });
    } catch (error) {
        console.error('Erro ao listar categoria:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar categoria.' });
    }
};

// Obter categoria por ID
exports.obterCategoria = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'categoria deve ser um número válido' });
        }

        const result = await query('SELECT * FROM public.categoria WHERE id_categoria = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'categoria não encontrada.' });
        }

        res.json({ sucesso: true, categoria: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter categoria:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar categoria
exports.criarCategoria = async (req, res) => {
    try {
        const { id_categoria, nome_categoria, descricao_categoria } = req.body;
        if (!nome_categoria || !descricao_categoria) {
            return res.status(400).json({ sucesso: false, mensagem: 'O nome da categoria e descrição são obrigatórios.' });
        }

        const sql = `
            INSERT INTO public.categoria (id_categoria, nome_categoria, descricao_categoria)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const result = await query(sql, [
            id_categoria,
            nome_categoria,
            descricao_categoria
        ]);
        res.status(201).json({ sucesso: true, mensagem: 'categoria inserida com sucesso!', categoria: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        if (error.code === '23505') {
            return res.status(400).json({ sucesso: false, mensagem: 'categoria já está cadastrada.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir categoria no banco de dados.' });
    }
};

// Atualizar categoria
exports.atualizarCategoria = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nome_categoria, descricao_categoria } = req.body;

        const sql = `
            UPDATE public.categoria
            SET nome_categoria = $1,
            descricao_categoria = $2
            WHERE id_categoria = $3
            RETURNING *
        `;

        const result = await query(sql, [nome_categoria, descricao_categoria, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'categoria não encontrada.' });
        }

        res.json({ sucesso: true, mensagem: 'categoria alterada com sucesso!', categoria: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar categoria.' });
    }
};

// Deletar categoria
exports.deletarCategoria = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        await query('DELETE FROM public.categoria WHERE id_categoria = $1', [id]);

        res.json({ sucesso: true, mensagem: 'categoria excluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'Não é possível excluir: existem produtos associados a esta categoria.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir categoria.' });
    }
};