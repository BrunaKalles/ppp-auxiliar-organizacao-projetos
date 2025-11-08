// Funções utilitárias para testes de usuário com k6
import http from 'k6/http';


export function getUserToken() {
  const loginUrl = 'http://localhost:3000/api/login'; // ajuste conforme sua API

  const payload = JSON.stringify({
    username: 'admin',
    password: '123456',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(loginUrl, payload, params);

  if (res.status !== 200) {
    throw new Error(`Erro ao fazer login: ${res.status} - ${res.body}`);
  }

  const body = JSON.parse(res.body);
  return body.token; // ou body.access_token, dependendo do formato
}

export function getBaseUrl() {
    // Retorne a URL base da API
    // Exemplo: return 'http://localhost:3000/api';
    return 'http://localhost:3000/api';
}
