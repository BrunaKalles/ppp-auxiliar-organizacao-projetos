# PPP Auxiliar Organização Projetos API

API REST para auxiliar na organização de projetos, construída com Express, autenticação JWT, documentação Swagger e banco de dados em memória.

## Como iniciar o servidor

1. Instale as dependências:
   ```bash
   npm install express body-parser cors jsonwebtoken swagger-ui-express
   ```
2. Inicie o servidor:
   ```bash
   node app.js
   ```

## Como acessar a API

- Após iniciar o servidor, acesse a API em: `http://localhost:3000`
- Para visualizar a documentação Swagger, acesse: `http://localhost:3000/api-docs`

## Autenticação
- Para acessar endpoints de clientes e projetos, é necessário autenticação via JWT.
- Usuário master: `admin` / senha: `123456`

## Endpoints

### Login
- `POST /api/register` — Cadastro de usuário
- `POST /api/login` — Autenticação e geração de token
- `GET /api/users` — Consulta de usuários (token obrigatório)
- `GET /api/users/:id` — Consulta de usuário por id (token obrigatório)
- `PUT /api/users/:id/password` — Alteração de senha (token obrigatório)
- `DELETE /api/users/:id` — Exclusão de usuário (token obrigatório, só se não houver vínculo com projeto)

### Clientes
- `POST /api/clients` — Cadastro de cliente (token obrigatório)
- `GET /api/clients` — Consulta de clientes (token obrigatório)
- `GET /api/clients/:id` — Consulta de cliente por id (token obrigatório)
- `PUT /api/clients/:id` — Edição de cliente (não permite alterar CPF/CNPJ, token obrigatório)

### Projetos
- `POST /api/projects` — Cadastro de projeto (token obrigatório)
- `GET /api/projects` — Consulta de projetos (token obrigatório)
- `GET /api/projects/:id` — Consulta de projeto por id (token obrigatório)
- `PUT /api/projects/:id` — Edição de projeto (campos permitidos, token obrigatório)

## Regras de Negócio
- CPF e CNPJ são únicos.
- Só pode excluir usuário se não houver vínculo com projeto.
- Só pode selecionar um status de projeto por vez.
- Campo "está pago" aceita apenas "sim" ou "não".
- Vários projetos podem ser vinculados ao mesmo cliente.

## Documentação Swagger
- Acesse `/swagger` para visualizar a documentação interativa.
- O arquivo Swagger está em `resources/swagger.json`.

## Estrutura do Projeto
- `routes/` — Rotas da API
- `controllers/` — Lógica dos endpoints
- `service/` — Serviços e middlewares
- `model/` — Banco de dados em memória
- `resources/` — Documentação Swagger

## Licença
MIT
