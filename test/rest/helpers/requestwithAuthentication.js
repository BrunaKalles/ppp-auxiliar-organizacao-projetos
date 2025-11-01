const request = require('supertest');
const app = require('../../../app');
require('dotenv').config();


function requestWithAuth(token) {
    const baseUrl = process.env.BASE_URL;
    return request(baseUrl);
}


module.exports = { requestWithAuth  };