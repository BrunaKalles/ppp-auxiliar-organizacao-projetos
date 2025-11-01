const db = require('../model/db');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../service/auth');

function register(req, res) {
  const { username, password, email } = req.body;
  if (!username || !password || !email) return res.status(400).json({ error: 'Usuário, senha e email obrigatórios' });
  //if (db.users.find(u => u.username === username)) return res.status(409).json({ error: 'Usuário já existe' });
  if (db.users.find(u => u.email === email)) return res.status(409).json({ error: 'Email já existe' });
  const id = db.users.length ? db.users[db.users.length - 1].id + 1 : 1;
  db.users.push({ id, username, password, email, isMaster: false });
  res.status(201).json({ id, username, email });
}


function getUsers(req, res) {
  res.json(db.users.map(u => ({ id: u.id, username: u.username, email: u.email, password: u.password })));
}

function getUserById(req, res) {
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json({ id: user.id, username: user.username, email: user.email, password: user.password });
}

function updatePassword(req, res) {
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  if (!req.body.password) return res.status(400).json({ error: 'Senha obrigatória' });
  user.password = req.body.password;
  res.json({ id: user.id, username: user.username, email: user.email });
}

function deleteUser(req, res) {
  const userId = parseInt(req.params.id);
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  if (db.projects.some(p => p.userId === userId)) return res.status(400).json({ error: 'Usuário vinculado a projeto' });
  db.users = db.users.filter(u => u.id !== userId);
  res.json({ message: 'Usuário excluído' });
}

module.exports = { register, getUsers, getUserById, updatePassword, deleteUser };
