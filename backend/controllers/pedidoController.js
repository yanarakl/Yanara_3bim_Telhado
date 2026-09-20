const { query } = require('../database');

exports.listarPedidosSemPagamento = async (req, res) => {
    try {
        const result = await query(`
            SELECT p.*
            FROM public.pedido p
            LEFT JOIN public.pagamento pg
                ON pg.id_pedido = p.id_pedido
            WHERE pg.id_pedido IS NULL
        `);
        res.json({
            sucesso: true,
            pedidos: result.rows
        });
    } catch (error) {
        console.error('Erro ao listar pedidos:', error);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar pedidos.'
        });
    }
};

// Listar todos os pedidos
exports.listarPedidos = async (req, res) => {
    try {
        const result = await query('SELECT * FROM public.pedido ORDER BY id_pedido');
        res.json({ sucesso: true, pedidos: result.rows });
    } catch (error) {
        console.error('Erro ao listar pedidos:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar pedidos.' });
    }
};

// Obter pedido por ID
exports.obterPedido = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)){
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });};
        const result = await query( 'SELECT * FROM public.pedido WHERE id_pedido = $1', [id] );
        if (result.rows.length === 0)
            return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado.' });
        const itens = await query(`
            SELECT *
            FROM public.item_pedido
            INNER JOIN public.produto
            ON produto.id_produto = item_pedido.id_produto
            WHERE item_pedido.id_pedido = $1
        `, [id]);
        res.json({
            sucesso: true,
            pedido: result.rows[0],
            produtos: itens.rows
        });
    } catch (error) {
        console.error('Erro ao obter pedido:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar pedido
exports.criarPedido = async (req, res) => {
    try {
        const {
            id_pedido,
            data_hora_pedido,
            status_pedido,
            id_cliente_pedido,
            valor_total_pedido,
            produtos =[]
        } = req.body;

        if (!data_hora_pedido || !status_pedido || !valor_total_pedido || !id_cliente_pedido) {
            return res.status(400).json({ sucesso: false, mensagem: 'Os atributos são obrigatórios.' });
        }

        const sql = `
            INSERT INTO public.pedido (id_pedido, data_hora, status, id_cliente, valor_total)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const values = [
            id_pedido,
            data_hora_pedido,
            status_pedido ,
            id_cliente_pedido,
            valor_total_pedido
        ];

        const result = await query(sql, values);

        for (let produto of produtos) {
            const subtotal = produto.preco_produto * produto.quantidade;

            await query(
                `INSERT INTO public.item_pedido
        (id_pedido, id_produto, quantidade, preco_unitario, subtotal)
        VALUES ($1, $2, $3, $4, $5)`,
                [
                    id_pedido,
                    produto.id_produto,
                    produto.quantidade,
                    produto.preco_produto,
                    subtotal
                ]
            );
        }
        res.status(201).json({ sucesso: true, mensagem: 'Pedido inserido com sucesso!', pedido: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'cliente informado não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir pedido no banco de dados.' });
    }
};

// Atualizar pedido
exports.atualizarPedido = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        const { data_hora_pedido, status_pedido, id_cliente_pedido, valor_total_pedido, produtos = [] } = req.body;
        const sql = `
            UPDATE public.pedido 
            SET data_hora = $1, 
                status = $2, 
                id_cliente = $3, 
                valor_total = $4 
            WHERE id_pedido = $5
            RETURNING *
        `;

        const values = [
            data_hora_pedido,
            status_pedido,
            id_cliente_pedido,
            valor_total_pedido,
            id
        ];

        
        const result = await query(sql, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado.' });
        }
        await query(
            `DELETE FROM public.item_pedido
     WHERE id_pedido = $1`,
            [id]
        );
        
            for (let produto of produtos || []) {
            const subtotal = produto.preco_produto * produto.quantidade;

            await query(
                `INSERT INTO public.item_pedido
        (id_pedido, id_produto, quantidade, preco_unitario, subtotal)
        VALUES ($1, $2, $3, $4, $5)`,
                [
                    id,
                    produto.id_produto,
                    produto.quantidade,
                    produto.preco_produto,
                    subtotal
                ]
            );
        }


        res.json({ sucesso: true, mensagem: 'Pedido alterado com sucesso!', pedido: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'O cliente informado não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar pedido.' });
    }
};

// Deletar pedido
exports.deletarPedido = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        await query('delete from public.item_pedido where id_pedido =$1', [id]);
        
        await query('DELETE FROM public.pedido WHERE id_pedido = $1', [id]);

        res.json({ sucesso: true, mensagem: 'Pedido excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar pedido:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir pedido.' });
    }
};