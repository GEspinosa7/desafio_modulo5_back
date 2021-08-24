CREATE DATABASE restaurante_db;

CREATE TABLE IF NOT EXISTS categoria(
		id SERIAL NOT NULL PRIMARY KEY,
  	nome VARCHAR(30) NOT NULL
);

INSERT INTO categoria (nome)
VALUES 
('Diversos'),
('Lanches'),
('Carnes'),
('Massas'),
('Pizzas'),
('Japonesa'),
('Chinesa'),
('Mexicano'),
('Brasileira'),
('Italiana'),
('Árabe');

ALTER TABLE categoria
ADD imagem TEXT;

update categoria
set imagem = 'categoria_diversos.png'
where id = 1;
update categoria
set imagem = 'categoria_lanches.png'
where id = 2;
update categoria
set imagem = 'categoria_carnes.png'
where id = 3;
update categoria
set imagem = 'categoria_massas.png'
where id = 4;
update categoria
set imagem = 'categoria_pizzas.png'
where id = 5;
update categoria
set imagem = 'categoria_japonesa.png'
where id = 6;
update categoria
set imagem = 'categoria_chinesa.png'
where id = 7;
update categoria
set imagem = 'categoria_mexicano.png'
where id = 8;
update categoria
set imagem = 'categoria_brasileira.png'
where id = 9;
update categoria
set imagem = 'categoria_italiana.png'
where id = 10;
update categoria
set imagem = 'categoria_arabe.png'
where id = 11;


CREATE TABLE IF NOT EXISTS usuario(
		id SERIAL NOT NULL PRIMARY KEY,
  	nome VARCHAR(100) NOT NULL,
  	email VARCHAR(100) NOT NULL,
  	senha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS restaurante(
		id SERIAL NOT NULL PRIMARY KEY,
  	nome VARCHAR(50) NOT NULL,
  	descricao VARCHAR(100),
  	taxa_entrega INTEGER NOT NULL DEFAULT 0,
  	tempo_entrega_minutos INTEGER NOT NULL DEFAULT 30,
  	valor_minimo_pedido INTEGER NOT NULL DEFAULT 0,
    usuario_id INTEGER NOT NULL,
  	categoria_id INTEGER NOT NULL,
  	FOREIGN KEY(usuario_id) REFERENCES usuario(id),
  	FOREIGN KEY(categoria_id) REFERENCES categoria(id)
);

ALTER TABLE restaurante
ADD imagem TEXT;

ALTER TABLE restaurante
ADD nome_imagem VARCHAR(50);

CREATE TABLE IF NOT EXISTS produto(
		id SERIAL NOT NULL PRIMARY KEY,
  	nome VARCHAR(50) NOT NULL,
  	descricao VARCHAR(100),
  	preco INTEGER NOT NULL,
  	ativo BOOLEAN NOT NULL DEFAULT TRUE,
		permite_observacoes BOOLEAN NOT NULL DEFAULT FALSE,
  	restaurante_id INTEGER NOT NULL,
		FOREIGN KEY(restaurante_id) REFERENCES restaurante(id) 	
);

ALTER TABLE produto
ADD imagem TEXT;

ALTER TABLE produto
ADD nome_imagem VARCHAR(50);


CREATE TABLE IF NOT EXISTS consumidor (
  	id SERIAL NOT NULL PRIMARY KEY,
  	nome VARCHAR(100) NOT NULL,
  	email VARCHAR(100) NOT NULL,
  	senha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pedido (
	id SERIAL NOT NULL PRIMARY KEY,
	subtotal INTEGER,
	taxa_entrega INTEGER,
	valor_total INTEGER,
	restaurante_id INTEGER NOT NULL,
	consumidor_id INTEGER NOT NULL,
	produto_pedido_id INTEGER NOT NULL,
	FOREIGN KEY(consumidor_id) REFERENCES consumidor(id),
	FOREIGN KEY(produto_pedido_id) REFERENCES produto_pedido(id),
	FOREIGN KEY(restaurante_id) REFERENCES restaurante(id)
);

ALTER TABLE pedido
ADD entregue BOOLEAN DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS produto_pedido (
	id SERIAL NOT NULL PRIMARY KEY,
	produto_id INTEGER,
	preco INTEGER NOT NULL,
	quantidade INTEGER,
	preco_total INTEGER,
	FOREIGN KEY(produto_id) REFERENCES produto(id)
);