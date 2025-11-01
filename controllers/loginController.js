const db = require('../model/db');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../service/auth');


function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password || username === '' || password === '') {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
  const token = jwt.sign({ id: user.id, username: user.username, isMaster: user.isMaster || false }, SECRET, { expiresIn: '1h' });
  res.json({ token });
}

module.exports = { login };