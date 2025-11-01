const db = require('../model/db');

const STATUS_OPTIONS = ['Não iniciado', 'Em andamento', 'Finalizado'];
const PAGO_OPTIONS = ['sim', 'não'];

function registerProject(req, res) {
  const { nome, clienteId, dataInicio, dataFim, dataPrevisao, valorCobrado, estaPago, statusProjeto, descricao } = req.body;
  if (!nome || !clienteId || !valorCobrado || !estaPago || !statusProjeto) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  if (!PAGO_OPTIONS.includes(estaPago)) return res.status(400).json({ error: 'Status de pagamento inválido' });
  if (!STATUS_OPTIONS.includes(statusProjeto)) return res.status(400).json({ error: 'Status de projeto inválido' });
  const client = db.clients.find(c => c.id === clienteId);
  if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });
  const id = db.projects.length ? db.projects[db.projects.length - 1].id + 1 : 1;
  db.projects.push({ id, nome, clienteId, dataInicio, dataFim, dataPrevisao, valorCobrado, estaPago, statusProjeto, descricao });
  res.status(201).json({ id, nome, clienteId, dataInicio, dataFim, dataPrevisao, valorCobrado, estaPago, statusProjeto, descricao });
}

function getProjects(req, res) {
  const projects = db.projects.map(p => {
    const client = db.clients.find(c => c.id === p.clienteId);
    return {
      id: p.id,
      nomeCliente: client ? client.nome : null,
      dataInicio: p.dataInicio,
      dataFim: p.dataFim,
      dataPrevisao: p.dataPrevisao,
      valorCobrado: p.valorCobrado,
      estaPago: p.estaPago,
      statusProjeto: p.statusProjeto,
      descricao: p.descricao
    };
  });
  res.json(projects);
}

function getProjectById(req, res) {
  const project = db.projects.find(p => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ error: 'Projeto não encontrado' });
  res.json(project);
}

function updateProject(req, res) {
  const project = db.projects.find(p => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ error: 'Projeto não encontrado' });
  const { dataInicio, dataFim, dataPrevisao, valorCobrado, estaPago, statusProjeto, descricao } = req.body;
  if (estaPago && !PAGO_OPTIONS.includes(estaPago)) return res.status(400).json({ error: 'Status de pagamento inválido' });
  if (statusProjeto && !STATUS_OPTIONS.includes(statusProjeto)) return res.status(400).json({ error: 'Status de projeto inválido' });
  if (dataInicio) project.dataInicio = dataInicio;
  if (dataFim) project.dataFim = dataFim;
  if (dataPrevisao) project.dataPrevisao = dataPrevisao;
  if (valorCobrado) project.valorCobrado = valorCobrado;
  if (estaPago) project.estaPago = estaPago;
  if (statusProjeto) project.statusProjeto = statusProjeto;
  if (descricao) project.descricao = descricao;
  res.json(project);
}

module.exports = { registerProject, getProjects, getProjectById, updateProject };
