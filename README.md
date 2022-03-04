# Projeto Shopper BACKEND

Link da aplicação rodando: [Surge](http://shopper-vitorszk.surge.sh).

## Descrição

Este repositório faz parte de um projeto Full-Stack, o qual simula uma aplicação de compras de mercado.
Repositório do front-end disponível em: [FRONTEND](https://github.com/vitorszk/project-shopper).


### Funcionalidades

* Listagem de todos os produtos. 
* Registro de pedidos.
* Cada pedido debita a quantidade do produto correspondente do estoque.
* Todas as informações são salvas em um banco de dados.
  
### `Como rodar o projeto localmente:`


* É NECESSÁRIA A CRIAÇÃO DAS TABELAS SQL.

* Scripts para criação das tabelas:
```SQL
CREATE TABLE inventory(
	id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    price decimal(10,2), 
	qty_stock int
);

CREATE TABLE orders(
	id VARCHAR(255) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    delivery_date VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at VARCHAR(255) NOT NULL
);

CREATE TABLE order_details(
	id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    product_qty INT NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES inventory(id)
);
```

* Crie um arquivo dotenv na raíz do projeto, contendo as seguintes variáveis de ambiente:
```
DB_HOST = 
DB_USER = 
DB_PASS = 
DB_NAME =
```

* Na raíz do projeto, rode o comando a seguir:
```
$ npm install
```

* Assim que instalado, rode:
```
$ npm run start
```