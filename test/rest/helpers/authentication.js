const request = require('supertest');
const app = require('../../../app');
require('dotenv').config();


async function getAuthToken() {

    const baseUrl = process.env.BASE_URL;

    const res = await request(baseUrl)
        .post('/api/login')
        .send({ username: 'admin', password: '123456' });
    return res.body.token;
}



module.exports = { getAuthToken};