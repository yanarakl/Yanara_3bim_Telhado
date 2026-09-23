DROP TABLE IF EXISTS produto, categoria, cliente, pedido, item_pedido, pagamento, funcionario;

CREATE TABLE categoria (
    id_categoria INTEGER PRIMARY KEY,
    nome_categoria VARCHAR(100) NOT NULL,
    descricao_categoria VARCHAR(255)
);

CREATE TABLE produto (
    id_produto INTEGER PRIMARY KEY,
    nome_produto VARCHAR(100) NOT NULL,
    descricao_produto VARCHAR(255),
    preco_produto NUMERIC(10, 2) NOT NULL,
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE cliente(
  id_cliente INTEGER PRIMARY KEY,
  nome_cliente VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefone VARCHAR(11) CHECK (telefone ~ '^[0-9]{11}$')
);

CREATE TABLE pedido(
  id_pedido INTEGER PRIMARY KEY,
  data_hora TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  id_cliente INTEGER NOT NULL,
  FOREIGN KEY (id_cliente)
    REFERENCES cliente (id_cliente)
);

CREATE TABLE item_pedido (
    id_item SERIAL PRIMARY KEY,
    id_pedido INTEGER NOT NULL,
    id_produto INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    preco_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    FOREIGN KEY (id_pedido)
        REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_produto)
        REFERENCES produto(id_produto)
);

CREATE TABLE pagamento (
    id_pagamento INTEGER PRIMARY KEY,
    id_pedido INTEGER NOT NULL UNIQUE,
    forma_pagamento VARCHAR(20) NOT NULL,
    valor NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_pedido)
        REFERENCES pedido(id_pedido)
);

CREATE TABLE funcionario (
    id_funcionario INTEGER PRIMARY KEY,
    nome_funcionario VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cargo VARCHAR(50) NOT NULL
);

INSERT INTO categoria (id_categoria, nome_categoria, descricao_categoria) VALUES
(1, 'Cafes', 'Bebidas quentes feitas com cafe'),
(2, 'Matchas', 'Bebidas preparadas com matcha'),
(3, 'Chas', 'Chas quentes e bebidas infusionadas'),
(4, 'Bebidas_Geladas', 'Bebidas frias da cafeteria'),
(5, 'Doces', 'Doces de padaria e confeitaria'),
(6, 'Bolos', 'Fatias de bolos variados'),
(7, 'Sanduiches', 'Lanches salgados preparados na cafeteria'),
(8, 'Tortas_e_Quiches', 'Opcoes salgadas assadas'),
(9, 'Cafe_da_Manha', 'Itens classicos para cafe da manha'),
(10, 'Especialidades_da_Casa', 'Produtos especiais da cafeteria');

INSERT INTO produto
(id_produto, nome_produto, descricao_produto, preco_produto, id_categoria) VALUES
(1, 'Espresso', 'Cafe curto e intenso', 7.00, 1),
(2, 'Espresso Duplo', 'Dose dupla de espresso', 10.00, 1),
(3, 'Americano', 'Espresso com agua quente', 9.00, 1),
(4, 'Cappuccino', 'Cafe com leite vaporizado e espuma', 13.00, 1),
(5, 'Latte', 'Cafe com bastante leite cremoso', 14.00, 1),
(6, 'Flat White', 'Cafe com leite em textura cremosa', 15.00, 1),
(7, 'Mocha', 'Cafe com chocolate e leite', 16.00, 1),
(8, 'Macchiato', 'Espresso marcado com espuma de leite', 11.00, 1),
(9, 'Cafe Coado', 'Cafe filtrado tradicional', 8.00, 1),
(10, 'Cold Brew', 'Cafe extraido a frio', 15.00, 1),
(11, 'Affogato', 'Sorvete com espresso quente', 18.00, 1),

(12, 'Matcha Tradicional', 'Matcha quente preparado com agua', 14.00, 2),
(13, 'Matcha Latte', 'Matcha com leite vaporizado', 16.00, 2),
(14, 'Matcha Gelado', 'Matcha servido frio com gelo', 16.00, 2),
(15, 'Matcha com Morango', 'Matcha gelado com calda de morango', 19.00, 2),
(16, 'Matcha com Baunilha', 'Matcha latte com toque de baunilha', 18.00, 2),
(17, 'Matcha Tonico', 'Matcha com agua tonica e gelo', 18.00, 2),
(18, 'Frappe de Matcha', 'Bebida cremosa gelada de matcha', 21.00, 2),

(19, 'Cha Verde', 'Cha leve e herbal', 9.00, 3),
(20, 'Cha Preto', 'Cha encorpado tradicional', 9.00, 3),
(21, 'Cha de Jasmim', 'Cha aromatico com jasmim', 10.00, 3),
(22, 'Earl Grey', 'Cha preto com bergamota', 11.00, 3),
(23, 'Camomila', 'Infusao suave de camomila', 8.00, 3),
(24, 'Hortela', 'Cha refrescante de hortela', 8.00, 3),
(25, 'Chai Latte', 'Cha com especiarias e leite', 15.00, 3),

(26, 'Iced Latte', 'Latte gelado com gelo', 15.00, 4),
(27, 'Iced Americano', 'Americano gelado', 12.00, 4),
(28, 'Chocolate Gelado', 'Chocolate cremoso servido frio', 14.00, 4),
(29, 'Milkshake de Baunilha', 'Milkshake cremoso de baunilha', 19.00, 4),
(30, 'Milkshake de Matcha', 'Milkshake cremoso de matcha', 21.00, 4),
(31, 'Limonada', 'Limonada natural gelada', 10.00, 4),
(32, 'Soda Italiana', 'Bebida gaseificada com xarope saborizado', 13.00, 4),

(33, 'Cookie de Chocolate', 'Cookie com gotas de chocolate', 9.00, 5),
(34, 'Cookie de Matcha', 'Cookie sabor matcha', 10.00, 5),
(35, 'Brownie', 'Brownie de chocolate intenso', 11.00, 5),
(36, 'Cinnamon Roll', 'Pao doce com canela', 13.00, 5),
(37, 'Croissant', 'Croissant amanteigado', 12.00, 5),
(38, 'Pain au Chocolat', 'Massa folhada com chocolate', 14.00, 5),
(39, 'Cheesecake', 'Fatia de cheesecake cremosa', 17.00, 5),
(40, 'Torta de Limao', 'Torta doce com creme de limao', 15.00, 5),
(41, 'Torta de Morango', 'Torta doce com morangos', 16.00, 5),
(42, 'Muffin', 'Bolinho macio individual', 10.00, 5),
(43, 'Donut', 'Rosquinha doce confeitada', 9.00, 5),
(44, 'Macaron', 'Doce frances recheado', 8.00, 5),
(45, 'Mochi', 'Doce japones macio e recheado', 10.00, 5),

(46, 'Bolo de Cenoura', 'Fatia de bolo de cenoura com chocolate', 12.00, 6),
(47, 'Bolo de Chocolate', 'Fatia de bolo de chocolate', 13.00, 6),
(48, 'Red Velvet', 'Fatia de bolo red velvet', 15.00, 6),
(49, 'Bolo de Limao', 'Fatia de bolo de limao', 12.00, 6),
(50, 'Bolo de Matcha', 'Fatia de bolo sabor matcha', 15.00, 6),
(51, 'Bolo de Banana', 'Fatia de bolo de banana', 11.00, 6),

(52, 'Queijo Quente', 'Sanduiche quente com queijo', 13.00, 7),
(53, 'Misto Quente', 'Sanduiche quente com presunto e queijo', 15.00, 7),
(54, 'Sanduiche Caprese', 'Sanduiche com tomate, queijo e manjericao', 19.00, 7),
(55, 'Sanduiche de Frango', 'Sanduiche recheado com frango', 18.00, 7),
(56, 'Sanduiche Natural', 'Sanduiche leve com recheio natural', 16.00, 7),

(57, 'Quiche de Alho-Poro', 'Quiche salgada de alho-poro', 17.00, 8),
(58, 'Quiche de Queijo', 'Quiche salgada de queijo', 16.00, 8),
(59, 'Torta de Frango', 'Fatia de torta salgada de frango', 15.00, 8),
(60, 'Empada de Palmito', 'Empada recheada com palmito', 10.00, 8),

(61, 'Pao na Chapa', 'Pao aquecido na chapa com manteiga', 8.00, 9),
(62, 'Torradas', 'Torradas crocantes com acompanhamento', 9.00, 9),
(63, 'Pao de Queijo', 'Pao de queijo tradicional', 7.00, 9),
(64, 'Iogurte com Granola', 'Iogurte natural com granola', 14.00, 9),
(65, 'Frutas da Estacao', 'Porcao de frutas frescas', 13.00, 9),

(66, 'Matcha Cerimonial', 'Matcha especial de alta qualidade', 24.00, 10),
(67, 'Matcha Latte Premium', 'Matcha latte com preparo especial', 23.00, 10),
(68, 'Cheesecake de Matcha', 'Cheesecake com sabor de matcha', 19.00, 10),
(69, 'Cookie de Matcha com Chocolate Branco', 'Cookie de matcha com chocolate branco', 13.00, 10),
(70, 'Affogato de Matcha', 'Sobremesa gelada com matcha', 22.00, 10),
(71, 'Mochi Artesanal', 'Mochi artesanal recheado', 14.00, 10);


INSERT INTO cliente
(id_cliente, nome_cliente, email, telefone ) VALUES
(1, 'Ana Souza', 'ana.souza@email.com', '44991234567'),
(2, 'Bruno Oliveira', 'bruno.oliveira@email.com', '44992345678'),
(3, 'Camila Santos', 'camila.santos@email.com', '44993456789'),
(4, 'Daniel Lima', 'daniel.lima@email.com', '44994567890'),
(5, 'Eduarda Martins', 'eduarda.martins@email.com', '44995678901'),
(6, 'Felipe Costa', 'felipe.costa@email.com', '44996789012'),
(7, 'Gabriela Alves', 'gabriela.alves@email.com', '44997890123'),
(8, 'Henrique Rocha', 'henrique.rocha@email.com', '44998901234'),
(9, 'Isabela Ferreira', 'isabela.ferreira@email.com', '44999012345'),
(10, 'Joao Mendes', 'joao.mendes@email.com', '44990123456');


INSERT INTO pedido
(id_pedido, data_hora, status, valor_total, id_cliente) VALUES
(1, '2026-09-01 08:15:00', 'Finalizado', 27.00, 1),
(2, '2026-09-01 09:30:00', 'Finalizado', 31.00, 2),
(3, '2026-09-02 10:10:00', 'Finalizado', 24.00, 3),
(4, '2026-09-03 14:20:00', 'Pronto', 38.00, 4),
(5, '2026-09-04 15:45:00', 'Em preparo', 29.00, 5),
(6, '2026-09-05 08:40:00', 'Finalizado', 21.00, 6),
(7, '2026-09-06 11:25:00', 'Pendente', 41.00, 7),
(8, '2026-09-07 13:10:00', 'Finalizado', 35.00, 8),
(9, '2026-09-08 16:30:00', 'Em preparo', 35.00, 9),
(10, '2026-09-09 09:05:00', 'Finalizado', 30.00, 10);

INSERT INTO item_pedido
( id_pedido, id_produto, quantidade, preco_unitario, subtotal) VALUES
( 1, 1, 1, 7.00, 7.00),
( 1, 4, 1, 13.00, 13.00),
( 1, 63, 1, 7.00, 7.00),

( 2, 5, 1, 14.00, 14.00),
( 2, 33, 1, 9.00, 9.00),
( 2, 61, 1, 8.00, 8.00),

( 3, 13, 1, 16.00, 16.00),
( 3, 23, 1, 8.00, 8.00),

( 4, 15, 1, 19.00, 19.00),
( 4, 37, 1, 12.00, 12.00),
( 4, 63, 1, 7.00, 7.00),

( 5, 7, 1, 16.00, 16.00),
( 5, 36, 1, 13.00, 13.00),

( 6, 2, 1, 10.00, 10.00),
( 6, 35, 1, 11.00, 11.00),

( 7, 29, 1, 19.00, 19.00),
( 7, 40, 1, 15.00, 15.00),
( 7, 1, 1, 7.00, 7.00),

( 8, 10, 1, 15.00, 15.00),
( 8, 47, 1, 13.00, 13.00),
( 8, 63, 1, 7.00, 7.00),

( 9, 17, 1, 18.00, 18.00),
( 9, 33, 1, 9.00, 9.00),
( 9, 61, 1, 8.00, 8.00),

( 10, 4, 1, 13.00, 13.00),
( 10, 39, 1, 17.00, 17.00);


INSERT INTO pagamento
(id_pagamento, id_pedido, forma_pagamento, valor, status) VALUES
(1, 1, 'Pix', 27.00, 'Confirmado'),
(2, 2, 'Credito', 31.00, 'Confirmado'),
(3, 3, 'Debito', 24.00, 'Confirmado'),
(4, 4, 'Pix', 38.00, 'Confirmado'),
(5, 5, 'Dinheiro', 29.00, 'Pendente'),
(6, 6, 'Credito', 21.00, 'Confirmado'),
(7, 7, 'Pix', 41.00, 'Pendente'),
(8, 8, 'Debito', 35.00, 'Confirmado'),
(9, 9, 'Pix', 35.00, 'Pendente');
(10, 10, 'Credito', 30.00, 'Confirmado');

INSERT INTO funcionario
(id_funcionario, nome_funcionario, email, cargo) VALUES
(1, 'Mariana Silva', 'mariana@cafeteria.com', 'Administrador'),
(2, 'Lucas Pereira', 'lucas@cafeteria.com',  'Gerente'),
(3, 'Beatriz Souza', 'beatriz@cafeteria.com',  'Atendente'),
(4, 'Rafael Santos', 'rafael@cafeteria.com',  'Atendente'),
(5, 'Laura Oliveira', 'laura@cafeteria.com',  'Atendente'),
(6, 'Pedro Costa', 'pedro@cafeteria.com',  'Gerente'),
(7, 'Julia Martins', 'julia@cafeteria.com',  'Atendente'),
(8, 'Matheus Alves', 'matheus@cafeteria.com',  'Atendente'),
(9, 'Sofia Rocha', 'sofia@cafeteria.com',  'Atendente'),
(10, 'Gabriel Ferreira', 'gabriel@cafeteria.com', 'Administrador');

SELECT setval(
    'item_pedido_id_item_seq',
    (SELECT MAX(id_item) FROM item_pedido)
);