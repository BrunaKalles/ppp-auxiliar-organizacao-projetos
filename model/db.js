const { generateCNPJ, generateCPF } = require("../test/rest/helpers/identifiers");

// Banco de dados em memória
const db = {
  users: [
    { id: 1, username: 'admin', password: '123456', email: 'admin@admin.com', isMaster: true },
    { id: 2, username: 'joao', email: 'joao@example.com', password: '654321' }
  ],
  clients: [
    { id: 1, nome: 'Cliente Exemplo', cpf: '09290283092', cnpj: '12345678901234', endereco: 'Rua Exemplo, 123', telefone: '12999999999', email: 'admin1@admin1.com'},
    { id: 2, nome: 'Cliente Exemplo 2', CNPJ: '77467923000182', cnpj: '12345678901234', endereco: 'Rua Exemplo, 123', telefone: '12999999999', email: 'admin1@admin1.com'},
  ],
  projects: [
    { id: 1, nome: 'Projeto Exemplo', clienteId: 1, dataInicio: '2025-11-01', dataFim: '2025-11-06', dataPrevisao: '2026-01-15', valorCobrado: 1250.00, estaPago: 'sim', statusProjeto: 'Em andamento', descricao: 'Descrição do projeto exemplo.' }
  ]
};

module.exports = db;
