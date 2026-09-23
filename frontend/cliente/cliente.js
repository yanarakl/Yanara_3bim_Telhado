const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let cliente = null;
bloquearAtributos(true);

function abrirCategoria() {
    window.location = "/frontend/categoria/categoria.html";
};
function abrirProduto() {
    window.location = "/frontend/produto/produto.html";
};
function abrirMenu() {
    window.location = "/frontend/menu/menu.html";
};
function abrirPedido() {
    window.location = "/frontend/pedido/pedido.html";
};
function abrirPagamento() {
    window.location = "/frontend/pagamento/pagamento.html";
};
function abrirFuncionario() {
    window.location = "/frontend/funcionario/funcionario.html";
};

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/cliente/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.cliente : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_cliente = parseInt(document.getElementById("inputId_Cliente").value, 10);
    if (isNaN(id_cliente)) {
        mostrarAviso("O ID do cliente não pode ser vazio e deve ser um número.");
        return;
    }

    cliente = await procurePorChavePrimaria(id_cliente);
    oQueEstaFazendo = '';
    
    if (cliente) {
        mostrarDadosCliente(cliente);
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
    mostrarAviso("INSERINDO - Digite o nome do cliente e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite o novo nome e clique em salvar");
}

function excluir() {
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    const id_cliente = parseInt(document.getElementById("inputId_Cliente").value, 10);
    const nome_cliente = document.getElementById("inputNome_Cliente").value;
    const email = document.getElementById("inputEmail_Cliente").value;
    const telefone = parseInt(document.getElementById("inputTelefone_Cliente").value);

    if (isNaN(id_cliente)) {
        mostrarAviso("O ID do cliente deve ser um número válido.");
        return;
    }

    const dadosCliente = { id_cliente, nome_cliente, email, telefone };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resp = await fetch(`${URL_API}/cliente`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(dadosCliente) 
            });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            const resp = await fetch(`${URL_API}/cliente/${id_cliente}`, { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(dadosCliente) 
            });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(`${URL_API}/cliente/${id_cliente}`, { method: 'DELETE' });
            const data = await resposta.json();
            if (!data.sucesso) {
                mostrarAviso(data.mensagem || "Erro ao excluir no servidor.");
                return;
            }
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_Cliente").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/cliente/listar`);
        const data = await resposta.json();

        if (data.sucesso) {
            let texto = "";

            for (let linha of data.clientes) {
                texto += `
                    <div class="cliente-card">
                        <span class="cliente-id">#${linha.id_cliente}</span>
                        <div class="cliente-info">
                            <h4>${linha.nome_cliente}</h4>
                            <p>${linha.email}</p>
                        </div>
                        <span class="cliente-telefone">${linha.telefone}</span>
                    </div>
                `;
            }

            document.getElementById("outputSaida").innerHTML =
                texto || "Nenhum cliente cadastrado.";
        } else {
            document.getElementById("outputSaida").innerHTML =
                `Erro no banco: ${data.mensagem}`;
        }
    } catch (erro) {
        console.error("Erro ao listar:", erro);
        document.getElementById("outputSaida").innerHTML =
            "Servidor offline ou erro de conexão (CORS).";
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

function mostrarDadosCliente(u) {
    document.getElementById("inputId_Cliente").value = u.id_cliente;
    document.getElementById("inputNome_Cliente").value = u.nome_cliente;
    document.getElementById("inputEmail_Cliente").value = u.email;
    document.getElementById("inputTelefone_Cliente").value = u.telefone;
    bloquearAtributos(true);
}

function limparAtributos() {
    cliente = null;
    oQueEstaFazendo = '';
    document.getElementById("inputNome_Cliente").value = "";
    document.getElementById("inputEmail_Cliente").value = "";
    document.getElementById("inputTelefone_Cliente").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_Cliente").readOnly = !soLeitura;
    document.getElementById("inputNome_Cliente").readOnly = soLeitura;
    document.getElementById("inputEmail_Cliente").readOnly = soLeitura;
    document.getElementById("inputTelefone_Cliente").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}