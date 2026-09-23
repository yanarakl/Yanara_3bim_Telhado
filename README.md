# Cafeteria

Sistema de gerenciamento de uma cafeteria desenvolvido para o projeto de Desenvolvimento Web 1 (DW1) do 3º bimestre de 2026.

## Sobre o projeto

O projeto consiste em um sistema de gerenciamento para uma cafeteria. A aplicação permite cadastrar e gerenciar categorias, produtos, clientes, pedidos, pagamentos e funcionários.

O sistema utiliza PostgreSQL para armazenamento dos dados e Node.js com Express no desenvolvimento do backend.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- PostgreSQL
- Multer
- Sharp

## Funcionalidades

O sistema possui as seguintes funcionalidades:

- Cadastro, consulta, alteração e exclusão de categorias, produtos, clientes, pedidos, pagamentos e funcionários;
- Cadastro e exibição de imagens dos produtos;
- Associação de produtos às categorias;
- Associação de clientes aos pedidos;
- Associação de produtos aos pedidos por meio dos itens do pedido;
- Associação de pagamentos aos pedidos.

## Estrutura do projeto

```text
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── database.js
│   └── server.js
│
├── frontend/
│   ├── categoria/
│   ├── cliente/
│   ├── funcionario/
│   ├── menu/
│   ├── pagamento/
│   ├── pedido/
│   └── produto/
│
├── imagens/
│
├── .env
├── .gitignore
├── package.json
└── table.sql
```

## Banco de dados

O banco de dados foi desenvolvido utilizando PostgreSQL.

O sistema possui as seguintes tabelas:

- `categoria`
- `produto`
- `cliente`
- `pedido`
- `item_pedido`
- `pagamento`
- `funcionario`

### Relacionamentos

O banco de dados possui os seguintes relacionamentos:

- `categoria` → `produto`: relação 1:N;
- `cliente` → `pedido`: relação 1:N;
- `pedido` → `item_pedido`: relação 1:N;
- `produto` → `item_pedido`: relação 1:N;
- `pedido` → `pagamento`: relação 1:1.

A tabela `funcionario` é independente das demais tabelas.

## Tabelas

### Categoria

A tabela `categoria` armazena as categorias dos produtos da cafeteria.

Campos principais:

- `id_categoria`
- `nome_categoria`
- `descricao_categoria`

Uma categoria pode possuir vários produtos.

### Produto

A tabela `produto` armazena os produtos disponíveis na cafeteria.

Campos principais:

- `id_produto`
- `nome_produto`
- `descricao_produto`
- `preco_produto`
- `id_categoria`

O campo `id_categoria` é uma chave estrangeira que relaciona cada produto à sua categoria.

As imagens dos produtos são armazenadas na pasta `imagens/` e não diretamente no banco de dados.

### Cliente

A tabela `cliente` armazena os dados dos clientes cadastrados.

Campos principais:

- `id_cliente`
- `nome_cliente`
- `email`
- `telefone`

### Pedido

A tabela `pedido` armazena os pedidos realizados.

Campos principais:

- `id_pedido`
- `data_hora`
- `status`
- `valor_total`
- `id_cliente`

O campo `id_cliente` é uma chave estrangeira que relaciona cada pedido a um cliente.

### Item do pedido

A tabela `item_pedido` armazena os produtos pertencentes a cada pedido.

Campos principais:

- `id_item`
- `id_pedido`
- `id_produto`
- `quantidade`
- `preco_unitario`
- `subtotal`

Essa tabela permite que um pedido possua vários produtos e que um produto possa aparecer em vários pedidos.

Ela também armazena a quantidade, o preço unitário e o subtotal de cada produto.

### Pagamento

A tabela `pagamento` armazena as informações relacionadas ao pagamento de cada pedido.

Campos principais:

- `id_pagamento`
- `id_pedido`
- `forma_pagamento`
- `valor`
- `status`

O campo `id_pedido` possui uma restrição `UNIQUE`, garantindo o relacionamento 1:1 entre `pedido` e `pagamento`.

As formas de pagamento utilizadas no sistema são:

- Pix
- Dinheiro
- Crédito
- Débito

### Funcionário

A tabela `funcionario` armazena os dados dos funcionários da cafeteria.

Campos principais:

- `id_funcionario`
- `nome_funcionario`
- `email`
- `cargo`

A tabela `funcionario` é independente das demais tabelas do sistema.

## Backend

O backend foi desenvolvido utilizando Node.js e Express.

A aplicação possui separação entre Routes, Controllers, Database e Server.

### Routes

As Routes são responsáveis por definir as rotas utilizadas pela aplicação.

Elas recebem as requisições feitas pelo frontend e direcionam cada requisição para o Controller correspondente.

### Controllers

Os Controllers são responsáveis pelo processamento das requisições.

Eles recebem os dados enviados pelo frontend, realizam as operações necessárias no banco de dados e retornam uma resposta.

### Database

O arquivo `database.js` é responsável pela conexão do backend com o banco de dados PostgreSQL.

### Server

O arquivo `server.js` é responsável pela configuração e inicialização do servidor.

Também é utilizado para disponibilizar os arquivos do frontend e as imagens dos produtos.

## Frontend

O frontend foi desenvolvido utilizando HTML, CSS e JavaScript.

As páginas estão organizadas de acordo com cada módulo do sistema:

- Menu;
- Categorias;
- Produtos;
- Clientes;
- Pedidos;
- Pagamentos;
- Funcionários.

As páginas possuem navegação entre os diferentes módulos do sistema.

## Menu

A página de Menu funciona como ponto de entrada para os diferentes módulos do sistema.

Através dela é possível acessar:

- Categorias;
- Produtos;
- Clientes;
- Pedidos;
- Pagamentos;
- Funcionários.

O Menu não realiza operações de CRUD. Ele serve para organizar e facilitar a navegação pelo sistema.

## CRUD

Os módulos principais do sistema possuem operações de CRUD.

CRUD significa:

- **Create:** criação ou cadastro de registros;
- **Read:** consulta ou leitura de registros;
- **Update:** alteração ou atualização de registros;
- **Delete:** exclusão de registros.

Essas operações são utilizadas para gerenciar os dados armazenados no banco de dados.

## Pedidos e itens do pedido

Os itens de um pedido são gerenciados dentro da própria página de pedidos.

Ao cadastrar ou alterar um pedido, é possível:

- selecionar uma categoria;
- selecionar um produto;
- informar a quantidade;
- adicionar o produto ao pedido;
- visualizar os produtos adicionados;
- remover produtos;
- calcular o valor total do pedido.

As informações dos produtos adicionados são armazenadas na tabela `item_pedido`.

## Imagens dos produtos

O cadastro de produtos permite adicionar imagens.

A imagem selecionada no frontend é enviada para o backend utilizando `Multer`.

Depois, a imagem é processada utilizando `Sharp`.

Após o processamento, a imagem é armazenada na pasta `imagens/` e disponibilizada pelo servidor para ser exibida no frontend.

## Pagamentos

Os pagamentos são associados aos pedidos.

Ao cadastrar um pagamento, é possível selecionar um pedido, informar a forma de pagamento, o valor e o status.

Cada pedido pode possuir apenas um pagamento, devido à restrição `UNIQUE` no campo `id_pedido` da tabela `pagamento`.

## Arquivo SQL

O arquivo SQL do projeto contém:

- criação das tabelas;
- definição das chaves primárias;
- definição das chaves estrangeiras;
- definição dos relacionamentos;
- inserção dos dados iniciais.

O arquivo utilizado no projeto é:

```text
table.sql
```

## Configuração do ambiente

Para executar o projeto, é necessário possuir:

- Node.js;
- PostgreSQL;
- npm.

### Instalação das dependências

Na pasta do projeto, execute:

```bash
npm install
```

### Configuração do banco de dados

Crie um banco de dados PostgreSQL e execute o arquivo SQL:

```text
table.sql
```

O arquivo contém a criação das tabelas e os dados iniciais utilizados pelo sistema.

### Configuração do arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com as informações de conexão com o banco de dados:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
```

Os valores devem ser substituídos pelas informações do PostgreSQL instalado no computador.

### Execução do projeto

Inicie o servidor com:

node server.js

Depois, acesse a aplicação pelo navegador utilizando a porta configurada pelo servidor.

## Projeto acadêmico

Projeto desenvolvido para a disciplina de Desenvolvimento Web 1 (DW1), referente ao 3º bimestre de 2026.

**Aluna:** Yanara  
**Turma:** M32A  
**Ano:** 2º ano
