// Banco de dados em memória
const db = {
  users: [
    { id: 1, username: 'admin', password: '123456', email: 'admin@admin.com', isMaster: true },
    { id: 2, username: 'joao', email: 'joao@example.com', password: '654321' }
  ],
  clients: [],
  projects: []
};

module.exports = db;
