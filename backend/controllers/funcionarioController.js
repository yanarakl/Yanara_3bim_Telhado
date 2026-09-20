const { query } = require('../database');

// Listar todas as Funcionarios
exports.listarFuncionarios = async (req, res) => {
    try {
        const result = await query('SELECT * FROM public.funcionario ORDER BY id_funcionario');
        res.json({ sucesso: true, funcionarios: result.rows });
    } catch (error) {
        console.error('Erro ao listar funcionario:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar funcionario.' });
    }
};

// Obter Funcionario por ID
exports.obterFuncionario = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'funcionario deve ser um número válido' });
        }

        const result = await query('SELECT * FROM public.funcionario WHERE id_funcionario = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'funcionario não encontrado.' });
        }

        res.json({ sucesso: true, funcionario: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter funcionario:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar Funcionario
exports.criarFuncionario = async (req, res) => {
    try {
        const { id_funcionario, nome_funcionario, email, cargo } = req.body;
        console.log(req.body);
        if (!nome_funcionario || !email || !cargo) {
            return res.status(400).json({ sucesso: false, mensagem: 'Os artibutos são obrigatórios.' });
        }

        const sql = `
            INSERT INTO public.funcionario (id_funcionario, nome_funcionario, email, cargo)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const result = await query(sql, [
            id_funcionario,
            nome_funcionario,
            email,
            cargo
        ]);
        res.status(201).json({ sucesso: true, mensagem: 'funcionario inserida com sucesso!', funcionario: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar funcionario:', error);
        if (error.code === '23505') {
            return res.status(400).json({ sucesso: false, mensagem: 'funcionario já está cadastrada.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir funcionario no banco de dados.' });
    }
};

// Atualizar Funcionario
exports.atualizarFuncionario = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nome_funcionario, email, cargo } = req.body;

        const sql = `
            UPDATE public.funcionario
            SET nome_funcionario = $1,
            email = $2,
            cargo = $3
            WHERE id_funcionario = $4
            RETURNING *
        `;

        const result = await query(sql, [nome_funcionario, email, cargo, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'funcionario não encontrado.' });
        }

        res.json({ sucesso: true, mensagem: 'funcionario alterado com sucesso!', funcionario: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar funcionario:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar funcionario.' });
    }
};

// Deletar Funcionario
exports.deletarFuncionario = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        await query('DELETE FROM public.funcionario WHERE id_funcionario = $1', [id]);

        res.json({ sucesso: true, mensagem: 'funcionario excluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar funcionario:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'Não é possível excluir: existem produtos associados a esta funcionario.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir funcionario.' });
    }
};