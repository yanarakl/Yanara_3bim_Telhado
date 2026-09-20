const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let pagamento = null;
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
function abrirPedido() {
    window.location = "/frontend/pedido/pedido.html";
};
function abrirMenu() {
    window.location = "/frontend/menu/menu.html";
};
function abrirFuncionario() {
    window.location = "/frontend/funcionario/funcionario.html";
};

async function inicializacao() {
    await carregarPedidos();
    await listar();
}

async function carregarPedidos() {
    const select = document.getElementById("SelectId_Pedido");
    try {
        const resposta = await fetch(`${URL_API}/pedido/sem-pagamento`);
        const data = await resposta.json();
        if (data.sucesso) {
            select.innerHTML = '<option value="">-- Selecione um Pedido --</option>';
            data.pedidos.forEach(pedido => {
                select.innerHTML += `<option value="${pedido.id_pedido}">
                    ${pedido.id_pedido} - R$ ${pedido.valor_total}
                </option>`;
            });
        }
    } catch (erro) {
        select.innerHTML = '<option value="">Erro ao carregar pedidos</option>';
    }
}

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/pagamento/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.pagamento : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_pagamento = document.getElementById("inputId_Pagamento").value;
    if (isNaN(id_pagamento) || !Number.isInteger(Number(id_pagamento)) || id_pagamento === "") {
        mostrarAviso("Precisa ser um número inteiro");
        return;
    }

    pagamento = await procurePorChavePrimaria(id_pagamento);
    oQueEstaFazendo = '';

    if (pagamento) {
        mostrarDadosPagamento(pagamento);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos e clique em salvar");
}

function excluir() {
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    let id_pagamento = document.getElementById("inputId_Pagamento").value;
    const id_pedido = document.getElementById("SelectId_Pedido").value || null;
    const forma_pagamento = document.getElementById("SelectForma_Pagamento").value || null;
    const valor_pagamento = parseFloat(document.getElementById("inputValor_Pagamento").value) || 0;
    const status_pagamento = document.getElementById("SelectStatus_Pagamento").value || null;


    const dadosPagamento = { id_pagamento, id_pedido, forma_pagamento, valor_pagamento, status_pagamento };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/pagamento`,
                {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosPagamento)
                });
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/pagamento/${id_pagamento}`,
                {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosPagamento)
                });
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/pagamento/${id_pagamento}`,
                { method: 'DELETE' });
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_Pagamento").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/pagamento/listar`);
        const data = await resposta.json();
        console.log(data.pagamentos);
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.pagamentos) {
                texto += `${linha.id_pagamento} -
                    Pedido: ${linha.id_pedido} -
                    Forma de Pagamento:${linha.forma_pagamento} -
                    Valor: R$ ${parseFloat(linha.valor).toFixed(2)}
                    Status: ${linha.status}
                    <br>`;
            }
            document.getElementById("outputSaida").innerHTML =
                texto || "Nenhum pagamento cadastrado.";
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

function mostrarDadosPagamento(p) {
    document.getElementById("inputId_Pagamento").value = p.id_pagamento;
    document.getElementById("SelectId_Pedido").value = p.id_pedido;
    document.getElementById("SelectForma_Pagamento").value = p.forma_pagamento;
    document.getElementById("inputValor_Pagamento").value = p.valor;
    document.getElementById("SelectStatus_Pagamento").value = p.status;

    bloquearAtributos(true);
}

function limparAtributos() {
    pagamento = null;
    oQueEstaFazendo = '';
    document.getElementById("SelectId_Pedido").value = "";
    document.getElementById("SelectForma_Pagamento").value = "";
    document.getElementById("inputValor_Pagamento").value = "";
    document.getElementById("SelectStatus_Pagamento").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_Pagamento").readOnly = !soLeitura;
    document.getElementById("SelectId_Pedido").disabled = soLeitura;
    document.getElementById("SelectForma_Pagamento").disabled = soLeitura;
    document.getElementById("inputValor_Pagamento").readOnly = soLeitura;
    document.getElementById("SelectStatus_Pagamento").disabled = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}