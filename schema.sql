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