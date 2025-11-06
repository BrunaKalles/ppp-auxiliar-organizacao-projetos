const db = require('../model/db');

function registerClient(req, res) {
  const { nome, cpf, cnpj, endereco, telefone, email } = req.body;
  if (!nome || (!cpf && !cnpj) || !endereco || !telefone || !email) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  if (email && db.clients.find(c => c.email === email)) return res.status(409).json({ error: 'Email já existe' });
  if (cpf && db.clients.find(c => c.cpf === cpf)) return res.status(409).json({ error: 'CPF já existe' });
  if (cnpj && db.clients.find(c => c.cnpj === cnpj)) return res.status(409).json({ error: 'CNPJ já existe' });
  const id = db.clients.length ? db.clients[db.clients.length - 1].id + 1 : 1;
  db.clients.push({ id, nome, cpf, cnpj, endereco, telefone, email });
  res.status(201).json({ id, nome, cpf, cnpj, endereco, telefone, email });
}

function getClients(req, res) {
  res.json(db.clients);
}

function getClientById(req, res) {
  const client = db.clients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });
  res.json(client);
}

function updateClient(req, res) {
  const client = db.clients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });
  const { nome, endereco, telefone } = req.body;
  if (req.body.cpf || req.body.cnpj) return res.status(400).json({ error: 'Não pode alterar CPF ou CNPJ' });
  if (!nome) return res.status(400).json({ error: 'O campo nome é obrigatório na edição.' });
  client.nome = nome;
  if (endereco) client.endereco = endereco;
  if (telefone) client.telefone = telefone;
  res.json(client);
}

module.exports = { registerClient, getClients, getClientById, updateClient };
