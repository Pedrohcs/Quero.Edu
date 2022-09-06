# Quero.Edu

## Sobre o projeto
Projeto com o objetivo de testar o conhecimento técnico para um processo seletivo.<br>
Neste projeto estamos gerenciando alunos e suas matriculas. Logo podemos criar e buscar usuários, criar e buscar matriculas.

## Tecnologia utilizada
O projeto é composto majoritariamente por Javascript, utilizando o NodeJS, e usa os seguintes frameworks:
- [Express v4.17.1](https://expressjs.com)
- [Pg v8.7.3](https://node-postgres.com)

## Como começar
Para iniciar, é necessário ter em sua máquina as seguintes tecnologias:

- [Node v12.21.0](https://nodejs.org/ja/blog/release/v12.21.0/)
- [NPM v6.14.8](https://www.npmjs.com/) (Included in Node.js)
- [PostgresSQL v14.5](https://www.postgresql.org)

### Prerequisites
```
# Para verificar a instalação do Node e NPM
node -v
npm -v
```

## Banco de dados
Um dos requisitos do projeto era integrar com Postgres, por isso o uso do framework `pg`. Por conta da aplicação ser mais objetiva e direta o banco de dados foi testado localmente.<br>
Portanto para teste local é necessário ter o PostgresSQL instalado e ter um database criado. Dessa forma basta alterar a string de conexão no arquivo Server.js na linha 12:

```
const pool = new Pool({
    connectionString: 'postgres://postgres:123@localhost:5432/queroedu'
})
```
Obs: A de cada table o proprio projeto faz quando executado por meio de suas migrations.

### Instalação e execução
```sh
# 1. Clonar o repositorio
git https://github.com/Pedrohcs/Quero.Edu

# 2. Mover para o diretório clonado
cd .\Quero.Edu

# 3. Instalar os pacotes NPM
npm install

# 4. Rodar o projeto
npm start

```