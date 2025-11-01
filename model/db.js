// Banco de dados em memória
const db = {
  users: [
    { id: 1, username: 'admin', password: '123456', email: 'admin@admin.com', isMaster: true }
  ],
  clients: [],
  projects: []
};

module.exports = db;
