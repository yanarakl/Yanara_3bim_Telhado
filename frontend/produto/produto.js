const URL_API = 'http://localhost:3001';
const SILHUETA_URL = `${URL_API}/imagens/silhueta.png`;

let oQueEstaFazendo = '';
let produto = null;
bloquearAtributos(true);


function abrirCategoria() {
    window.location = "/frontend/categoria/categoria.html";
};
function abrirMenu() {
    window.location = "/frontend/menu/menu.html";
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


async function inicializacao() {
    await carregarCategoria();
    await listar();
}

async function carregarCategoria() {
    const select = document.getElementById("selectCategoriaProduto");
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

function carregarImagem(id) {
    const img = document.getElementById('imgProduto');
    if (!id) {
        img.src = SILHUETA_URL;
        return;
    }
    img.src = `${URL_API}/imagens/${id}.png?t=${new Date().getTime()}`;
    img.onerror = () => { img.src = SILHUETA_URL; };
}

function acionarUpload() {
    if (oQueEstaFazendo !== 'inserindo' && oQueEstaFazendo !== 'alterando') {
        mostrarAviso("Clique em Inserir ou Alterar primeiro para poder escolher uma imagem.");
        return;
    }
    document.getElementById('inputImagem').click();
}

function previewImagem() {
    const inputFiles = document.getElementById('inputImagem').files;
    if (inputFiles.length > 0) {
        const url = URL.createObjectURL(inputFiles[0]);
        document.getElementById('imgProduto').src = url;
        mostrarAviso("Imagem escolhida! Clique em Salvar para concluir.");
    }
}

async function uploadImagemParaServidor(id) {
    const inputFiles = document.getElementById('inputImagem').files;
    if (inputFiles.length === 0) return;

    const formData = new FormData();
    formData.append('imagem', inputFiles[0]);

    try {
        await fetch(`${URL_API}/produto/upload/${id}`, {
            method: 'POST',
            body: formData
        });
    } catch (erro) {
        console.error("Erro ao enviar imagem:", erro);
    }
}

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/produto/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.produto : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_produto = document.getElementById("inputId_Produto").value;
    if (isNaN(id_produto) || !Number.isInteger(Number(id_produto)) || id_produto === "") {
        mostrarAviso("Precisa ser um número inteiro");
        return;
    }

    produto = await procurePorChavePrimaria(id_produto);
    oQueEstaFazendo = '';

    if (produto) {
        mostrarDadosProduto(produto);
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
    let id_produto = document.getElementById("inputId_Produto").value;
    const nome_produto = document.getElementById("inputNome_Produto").value;
    const descricao_produto = document.getElementById("inputDescricao_Produto").value;
    const preco_produto = parseFloat(document.getElementById("inputPreco_Produto").value) || 0;
    const id_categoria_produto = document.getElementById("selectCategoriaProduto").value;

    const dadosProduto = { id_produto, nome_produto, descricao_produto, preco_produto, id_categoria_produto };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/produto`,
                {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosProduto)
                });
            await uploadImagemParaServidor(id_produto);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/produto/${id_produto}`,
                {
                    method: 'PUT', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosProduto)
                });
            await uploadImagemParaServidor(id_produto);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/produto/${id_produto}`,
                { method: 'DELETE' });
            carregarImagem(null)
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_Produto").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/produto/listar`);
        const data = await resposta.json();
        console.log(data.produtos);
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.produtos) {
                texto += `
                    <div class="produto-lista">
                        <img src="/imagens/${linha.id_produto}.png" alt="${linha.nome_produto}">
                        <div class="produto-info">
                            <h4>${linha.nome_produto}</h4>
                            <p>${linha.descricao_produto}</p>
                            <p>Categoria: ${linha.nome_categoria}</p>
                            <strong>R$ ${parseFloat(linha.preco_produto).toFixed(2)}</strong>
                        </div>
                    </div>
                `;
            }
            document.getElementById("outputSaida").innerHTML =
                texto || "Nenhum produto cadastrado.";
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

function mostrarDadosProduto(p) {
    document.getElementById("inputId_Produto").value = p.id_produto;
    document.getElementById("inputNome_Produto").value = p.nome_produto;
    document.getElementById("inputDescricao_Produto").value = p.descricao_produto;
    document.getElementById("inputPreco_Produto").value = p.preco_produto;
    document.getElementById("selectCategoriaProduto").value = p.id_categoria;
    carregarImagem(p.id_produto);
    bloquearAtributos(true);
}

function limparAtributos() {
    produto = null;
    oQueEstaFazendo = '';
    document.getElementById("inputNome_Produto").value = "";
    document.getElementById("inputDescricao_Produto").value = "";
    document.getElementById("inputPreco_Produto").value = "";
    document.getElementById("selectCategoriaProduto").value = "";
    document.getElementById("inputImagem").value = "";
    document.getElementById("imgProduto").src = SILHUETA_URL;

    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_Produto").readOnly = !soLeitura;
    document.getElementById("inputNome_Produto").readOnly = soLeitura;
    document.getElementById("inputDescricao_Produto").readOnly = soLeitura;
    document.getElementById("inputPreco_Produto").readOnly = soLeitura;
    document.getElementById("selectCategoriaProduto").disabled = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}