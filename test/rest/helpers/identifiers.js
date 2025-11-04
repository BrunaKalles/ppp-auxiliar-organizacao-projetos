const request = require('supertest');
const app = require('../../../app');
require('dotenv').config();


function _randDigit() {
  return Math.floor(Math.random() * 10);
}

function _allSame(str) {
  return /^(\d)\1*$/.test(str);
}

/**
 * Gera um CPF válido.
 * @param {Object} opts
 * @param {boolean} opts.formatted - se true, retorna com máscara (xxx.xxx.xxx-xx)
 * @returns {string}
 */
function generateCPF({ formatted = false } = {}) {
  // Gera os 9 primeiros dígitos
  const nums = Array.from({ length: 9 }, _randDigit);

  // Calcula o 1º dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += nums[i] * (10 - i);
  let d1 = 11 - (sum % 11);
  if (d1 >= 10) d1 = 0;
  nums.push(d1);

  // Calcula o 2º dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) sum += nums[i] * (11 - i);
  let d2 = 11 - (sum % 11);
  if (d2 >= 10) d2 = 0;
  nums.push(d2);

  const cpf = nums.join('');

  // Evita CPFs com todos os dígitos iguais (11111111111 etc.)
  if (_allSame(cpf)) return generateCPF({ formatted });

  if (formatted) {
    return `${cpf.slice(0,3)}.${cpf.slice(3,6)}.${cpf.slice(6,9)}-${cpf.slice(9,11)}`;
  }
  return cpf;
}

/**
 * Gera um CNPJ válido.
 * @param {Object} opts
 * @param {boolean} opts.formatted - se true, retorna com máscara (xx.xxx.xxx/xxxx-xx)
 * @returns {string}
 */
function generateCNPJ({ formatted = false } = {}) {
  // Gera os 12 primeiros dígitos
  const nums = Array.from({ length: 12 }, _randDigit);

  // Pesos para o primeiro dígito verificador
  const weights1 = [5,4,3,2,9,8,7,6,5,4,3,2];

  let sum = 0;
  for (let i = 0; i < 12; i++) sum += nums[i] * weights1[i];
  let d1 = sum % 11;
  d1 = d1 < 2 ? 0 : 11 - d1;
  nums.push(d1);

  // Pesos para o segundo dígito verificador
  const weights2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
  sum = 0;
  for (let i = 0; i < 13; i++) sum += nums[i] * weights2[i];
  let d2 = sum % 11;
  d2 = d2 < 2 ? 0 : 11 - d2;
  nums.push(d2);

  const cnpj = nums.join('');

  if (_allSame(cnpj)) return generateCNPJ({ formatted });

  if (formatted) {
    return `${cnpj.slice(0,2)}.${cnpj.slice(2,5)}.${cnpj.slice(5,8)}/${cnpj.slice(8,12)}-${cnpj.slice(12,14)}`;
  }
  return cnpj;
}

  function generateUniqueEmail() {
        const timestamp = Date.now();
        return `user_${timestamp}@example.com`;
    }
module.exports = {
  generateCPF,
  generateCNPJ,
  generateUniqueEmail
};
