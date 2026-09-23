const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let pedido = null;
let produtosPedido = [];
bloquearAtributos(true);

function abrirCategoria() {
    window.location = "/frontend/categoria/categoria.html";
};
function abrirProduto() {
    window.location = "/frontend/produto/produto.html";
};
function abrirCliente() {
    window.location = "/frontend/cliente/cliente.html";
};
function abrirMenu() {
    window.location = "/frontend/menu/menu.html";
};
function abrirPagamento() {
    window.location = "/frontend/pagamento/pagamento.html";
};
function abrirFuncionario() {
    window.location = "/frontend/funcionario/funcionario.html";
};
async function inicializacao() {
    await carregarCategoria();
    await listar();
}
async function carregarCategoria() {

    const select = document.getElementById("selectCategoria");

    try {
        const resposta = await fetch(`${URL_API}/categoria/listar`);

        const data = await resposta.json();
        if (data.sucesso) {
            select.innerHTML = '<option value="">-- Selecione uma Categoria --</option>';
            data.categorias.forEach(categoria => {
                select.innerHTML += `<option value="${categoria.id_categoria}">
                    ${categoria.id_categoria} - ${categoria.nome_categoria} - ${categoria.descricao_categoria}
                </option>`;
            });
        }
    } catch (erro) {
        select.innerHTML = '<option value="">Erro ao carregar categorias</option>';
    }
}
async function carregarProdutos() {
    const id_categoria = document.getElementById("selectCategoria").value;
    const select = document.getElementById("selectProduto");

    select.innerHTML = '<option value="">-- Selecione um Produto --</option>';

    if (id_categoria === "") {
        return;
    }
    try {
        const resposta = await fetch(`${URL_API}/produto/categoria/${id_categoria}`);
        const data = await resposta.json();
        if (data.sucesso) {
            data.produto.forEach(produto => {
                select.innerHTML += `
                    <option value="${produto.id_produto}">
                        ${produto.nome_produto} - R$ ${produto.preco_produto}
                    </option>
                `;
            });
        }
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}
function adicionarProduto() {
    const selectProduto = document.getElementById("selectProduto");
    const inputQuantidade = document.getElementById("inputQuantidade");
    const id_produto = selectProduto.value;
    const quantidade = parseInt(inputQuantidade.value);
    if (id_produto === "") {
        mostrarAviso("Selecione um produto.");
        return;
    }
    if (isNaN(quantidade) || quantidade < 1) {
        mostrarAviso("Informe uma quantidade válida.");
        return;
    }
    const produtoSelecionado = selectProduto.options[selectProduto.selectedIndex];
    const nome_produto = produtoSelecionado.textContent;
    const preco_produto = parseFloat(
        produtoSelecionado.textContent.split("R$ ")[1]
    );
    const produto = {
        id_produto: parseInt(id_produto),
        nome_produto: nome_produto,
        preco_produto: preco_produto,
        quantidade: quantidade
    };
    produtosPedido.push(produto);
    let valorTotal = 0;
    for (let produto of produtosPedido) {
        valorTotal += produto.preco_produto * produto.quantidade;
    }
    document.getElementById("inputValor_Total_Pedido").value = valorTotal.toFixed(2);
    mostrarProdutosPedido();
}
function mostrarProdutosPedido() {
    const lista = document.getElementById("listaProdutos");
    lista.innerHTML = "";

    for (let i = 0; i < produtosPedido.length; i++) {
        const produto = produtosPedido[i];

        const preco = parseFloat(produto.preco_produto);
        const subtotal = preco * produto.quantidade;


        lista.innerHTML += `
            <div>
                ${produto.nome_produto}
                | Quantidade: ${produto.quantidade}
                | Preço: R$ ${preco.toFixed(2)}
                | Subtotal: R$ ${subtotal.toFixed(2)}

                <input
                    type="button"
                    value="Remover"
                    onclick="removerProduto(${i})"
                >
            </div>
        `;
    }
    bloquearBotoesProdutos();
}
function bloquearBotoesProdutos() {
    const botoes = document.querySelectorAll(".botaoRemoverProduto");

    const podeAlterar =
        oQueEstaFazendo === "inserindo" ||
        oQueEstaFazendo === "alterando";

    botoes.forEach(botao => {
        botao.disabled = !podeAlterar;
    });
}
function removerProduto(indice) {

    if (oQueEstaFazendo !== 'alterando' && oQueEstaFazendo !== 'inserindo') {
        return;
    }

    produtosPedido.splice(indice, 1);
    mostrarProdutosPedido();

    let valorTotal = 0;

    for (let produto of produtosPedido) {
        valorTotal += produto.preco_produto * produto.quantidade;
    }

    document.getElementById("inputValor_Total_Pedido").value =
        valorTotal.toFixed(2);
}

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/pedido/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_pedido = document.getElementById("inputId_Pedido").value;
    if (isNaN(id_pedido) || !Number.isInteger(Number(id_pedido)) || id_pedido === "") {
        mostrarAviso("Precisa ser um número inteiro");
        return;
    }

    pedido = await procurePorChavePrimaria(id_pedido);
    oQueEstaFazendo = '';

    if (pedido) {
        mostrarDadosPedido(pedido.pedido);
        produtosPedido = pedido.produtos || [];
        mostrarProdutosPedido();
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    oQueEstaFazendo = 'inserindo';
    bloquearAtributos(false);
    bloquearBotoesProdutos();
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    mostrarAviso("INSERINDO - Digite os atributos e clique em salvar");
}

function alterar() {
    oQueEstaFazendo = 'alterando';
    bloquearAtributos(false);
    bloquearBotoesProdutos();
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    mostrarAviso("ALTERANDO - Digite os atributos e clique em salvar");
}

function excluir() {
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    let id_pedido = document.getElementById("inputId_Pedido").value;
    const data_hora_pedido = document.getElementById("inputData_Hora_Pedido").value;
    const status_pedido = document.getElementById("selectStatus_Pedido").value || null;
    const valor_total_pedido = parseFloat(document.getElementById("inputValor_Total_Pedido").value) || 0;
    const id_cliente_pedido = parseInt(document.getElementById("inputId_Cliente_Pedido").value) || null;


    const dadosPedido = {
        id_pedido,
        data_hora_pedido,
        status_pedido,
        valor_total_pedido,
        id_cliente_pedido,
        produtos: produtosPedido
    };
    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/pedido`,
                {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosPedido)
                });
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/pedido/${id_pedido}`,
                {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosPedido)
                });
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/pedido/${id_pedido}`,
                { method: 'DELETE' });
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_Pedido").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/pedido/listar`);
        const data = await resposta.json();
        console.log(data.pedidos);
        if (data.sucesso) {
            let texto = "";

            for (let linha of data.pedidos) {
                texto += `
                    <div class="pedido-card">
                        <div class="pedido-topo">
                            <strong>Pedido #${linha.id_pedido}</strong>
                            <span class="pedido-status">${linha.status}</span>
                        </div>

                        <div class="pedido-detalhes">
                            <span>Data: ${linha.data_hora}</span>
                            <span>Cliente: ${linha.id_cliente}</span>
                            <strong>R$ ${parseFloat(linha.valor_total).toFixed(2)}</strong>
                        </div>
                    </div>
                `;
            }
            document.getElementById("outputSaida").innerHTML =
                texto || "Nenhum pedido cadastrado.";
        }
    } catch (erro) {
        console.error("Erro ao listar:", erro);
    }
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosPedido(p) {
    document.getElementById("inputId_Pedido").value = p.id_pedido;
    document.getElementById("inputData_Hora_Pedido").value = p.data_hora.slice(0, 16);
    document.getElementById("selectStatus_Pedido").value = p.status;
    document.getElementById("inputId_Cliente_Pedido").value = p.id_cliente;
    document.getElementById("inputValor_Total_Pedido").value = p.valor_total;
    bloquearAtributos(true);
}

function limparAtributos() {
    pedido = null;
    oQueEstaFazendo = '';

    document.getElementById("inputData_Hora_Pedido").value = "";
    document.getElementById("selectStatus_Pedido").value = "";
    document.getElementById("inputId_Cliente_Pedido").value = "";
    document.getElementById("inputValor_Total_Pedido").value = "";

    produtosPedido = [];

    document.getElementById("listaProdutos").innerHTML = "";

    document.getElementById("selectCategoria").value = "";
    document.getElementById("selectProduto").innerHTML =
        '<option value="">-- Selecione um Produto --</option>';

    document.getElementById("inputQuantidade").value = "";

    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_Pedido").readOnly = !soLeitura;
    document.getElementById("inputData_Hora_Pedido").readOnly = soLeitura;
    document.getElementById("selectStatus_Pedido").disabled = soLeitura;
    document.getElementById("inputId_Cliente_Pedido").readOnly = soLeitura;
    document.getElementById("inputValor_Total_Pedido").readOnly = soLeitura;
    document.getElementById("selectCategoria").disabled = soLeitura;
    document.getElementById("selectProduto").disabled = soLeitura;
    document.getElementById("inputQuantidade").disabled = soLeitura;
    document.getElementById("btAdicionarProduto").disabled = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}