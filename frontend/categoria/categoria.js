const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let categoria = null;
bloquearAtributos(true);

function abrirMenu() {
    window.location = "/frontend/menu/menu.html";
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
function abrirPagamento() {
    window.location = "/frontend/pagamento/pagamento.html";
};
function abrirFuncionario() {
    window.location = "/frontend/funcionario/funcionario.html";
};

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/categoria/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.categoria : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_categoria = parseInt(document.getElementById("inputId_Categoria").value, 10);
    if (isNaN(id_categoria)) {
        mostrarAviso("O ID do categoria não pode ser vazio e deve ser um número.");
        return;
    }

    categoria = await procurePorChavePrimaria(id_categoria);
    oQueEstaFazendo = '';
    
    if (categoria) {
        mostrarDadosCategoria(categoria);
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
    mostrarAviso("INSERINDO - Digite o nome do categoria e clique em salvar");
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
    const id_categoria = parseInt(document.getElementById("inputId_Categoria").value, 10);
    const nome_categoria = document.getElementById("inputNome_Categoria").value;
    const descricao_categoria = document.getElementById("inputDescricao_Categoria").value;

    if (isNaN(id_categoria)) {
        mostrarAviso("O ID do categoria deve ser um número válido.");
        return;
    }

    const dadosCategoria = { id_categoria, nome_categoria, descricao_categoria };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resp = await fetch(`${URL_API}/categoria`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(dadosCategoria) 
            });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            const resp = await fetch(`${URL_API}/categoria/${id_categoria}`, { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(dadosCategoria) 
            });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(`${URL_API}/categoria/${id_categoria}`, { method: 'DELETE' });
            const data = await resposta.json();
            if (!data.sucesso) {
                mostrarAviso(data.mensagem || "Erro ao excluir no servidor.");
                return;
            }
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_Categoria").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/categoria/listar`);

       
        const data = await resposta.json();
       // alert("teste "+stringify(dada))
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.categorias) {
                texto += `<b>[${linha.id_categoria}]</b> - ${linha.nome_categoria} - ${linha.descricao_categoria} <br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhuma categoria cadastrada.";
        } else {
            document.getElementById("outputSaida").innerHTML = `Erro no banco: ${data.mensagem}`;
        }
    } catch (erro) {
        console.error("Erro ao listar:", erro);
        document.getElementById("outputSaida").innerHTML = "Servidor offline ou erro de conexão (CORS).";
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

function mostrarDadosCategoria(u) {
    document.getElementById("inputId_Categoria").value = u.id_categoria;
    document.getElementById("inputNome_Categoria").value = u.nome_categoria;
    document.getElementById("inputDescricao_Categoria").value = u.descricao_categoria;
    bloquearAtributos(true);
}

function limparAtributos() {
    categoria = null;
    oQueEstaFazendo = '';
    document.getElementById("inputNome_Categoria").value = "";
    document.getElementById("inputDescricao_Categoria").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_Categoria").readOnly = !soLeitura;
    document.getElementById("inputNome_Categoria").readOnly = soLeitura;
    document.getElementById("inputDescricao_Categoria").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}