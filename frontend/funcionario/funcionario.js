const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let funcionario = null;
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
function abrirPagamento() {
    window.location = "/frontend/pagamento/pagamento.html";
};
function abrirMenu() {
    window.location = "/frontend/menu/menu.html";
};

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/funcionario/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.funcionario : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_funcionario = parseInt(document.getElementById("inputId_Funcionario").value, 10);
    if (isNaN(id_funcionario)) {
        mostrarAviso("O ID do funcionario não pode ser vazio e deve ser um número.");
        return;
    }

    funcionario = await procurePorChavePrimaria(id_funcionario);
    oQueEstaFazendo = '';
    
    if (funcionario) {
        mostrarDadosFuncionario(funcionario);
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
    mostrarAviso("INSERINDO - Digite o nome do funcionario e clique em salvar");
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
    const id_funcionario = parseInt(document.getElementById("inputId_Funcionario").value, 10);
    const nome_funcionario = document.getElementById("inputNome_Funcionario").value;
    const email = document.getElementById("inputEmail_Funcionario").value;
    const cargo = document.getElementById("inputCargo_Funcionario").value;

    if (isNaN(id_funcionario)) {
        mostrarAviso("O ID do funcionario deve ser um número válido.");
        return;
    }

    const dadosFuncionario = { id_funcionario, nome_funcionario, email, cargo };
    console.log(dadosFuncionario);
    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resp = await fetch(`${URL_API}/funcionario`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(dadosFuncionario) 
            });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            const resp = await fetch(`${URL_API}/funcionario/${id_funcionario}`, { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(dadosFuncionario) 
            });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(`${URL_API}/funcionario/${id_funcionario}`, { method: 'DELETE' });
            const data = await resposta.json();
            if (!data.sucesso) {
                mostrarAviso(data.mensagem || "Erro ao excluir no servidor.");
                return;
            }
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_Funcionario").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/funcionario/listar`);

       
        const data = await resposta.json();
       // alert("teste "+stringify(dada))
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.funcionarios) {
                texto += `<b>[${linha.id_funcionario}]</b> - ${linha.nome_funcionario} - ${linha.email} - ${linha.cargo} <br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhum funcionario cadastrado.";
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

function mostrarDadosFuncionario(u) {
    document.getElementById("inputId_Funcionario").value = u.id_funcionario;
    document.getElementById("inputNome_Funcionario").value = u.nome_funcionario;
    document.getElementById("inputEmail_Funcionario").value = u.email;
    document.getElementById("inputCargo_Funcionario").value = u.cargo;
    bloquearAtributos(true);
}

function limparAtributos() {
    funcionario = null;
    oQueEstaFazendo = '';
    document.getElementById("inputNome_Funcionario").value = "";
    document.getElementById("inputEmail_Funcionario").value = "";
    document.getElementById("inputCargo_Funcionario").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_Funcionario").readOnly = !soLeitura;
    document.getElementById("inputNome_Funcionario").readOnly = soLeitura;
    document.getElementById("inputEmail_Funcionario").readOnly = soLeitura;
    document.getElementById("inputCargo_Funcionario").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}