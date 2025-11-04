const request = require('supertest');
const { expect } = require('chai');
const { getAuthToken } = require('../helpers/authentication');
const { requestWithAuth } = require('../helpers/requestwithAuthentication');
const { generateCPF, generateCNPJ, generateUniqueEmail } = require('../helpers/identifiers');
const { clients } = require('../../../model/db');
const db = require('../../../model/db');
require('dotenv').config();


describe('Criar, editar e listar cliente', () => {

    const baseUrl = process.env.BASE_URL;
      
    let token;
    before(async () => {
        token = await getAuthToken();
    });

      // Função para gerar email único a cada teste
    let uniqueEmail;
    let uniqueCPF;
    let uniqueCNPJ; 

    beforeEach(() => {
        uniqueEmail = generateUniqueEmail();
        uniqueCPF = generateCPF();
        uniqueCNPJ = generateCNPJ();
    });

    describe('POST /api/clients', () => {
        it('Deve retornar 201 quando cadastro do cliente PF realizado com sucesso', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/clients')
                .set('Authorization', `Bearer ${token}`) 
                .send({ nome: 'Cliente Teste', cpf: uniqueCPF, endereco: 'Rua Teste, 123', telefone: '11999999999', email: uniqueEmail});

        
            expect(res.status).to.equal(201);
            //expect(res.body).to.have.property('nome', 'cpf', 'endereco', 'telefone', 'email');
        })
        it('Deve retornar 201 quando cadastro do cliente PJ realizado com sucesso', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/clients')
                .set('Authorization', `Bearer ${token}`) 
                .send({ nome: 'Cliente Teste', cnpj: uniqueCNPJ, endereco: 'Rua Teste, 123', telefone: '11999999999', email: uniqueEmail});

            expect(res.status).to.equal(201);
            //expect(res.body).to.have.property('nome', 'cpf', 'endereco', 'telefone', 'email');
        })

        it('Deve retornar 400 quando campo obrigatório nome não for enviado ', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/clients')
                .set('Authorization', `Bearer ${token}`)
                .send({  cpf: generateCPF, endereco: 'Rua Teste, 123', telefone: '11999999999', email: uniqueEmail});
            expect(res.status).to.equal(400);

        })

        it('Deve retornar 409 quando inserido um cnpj que já existe', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/clients')
                .set('Authorization', `Bearer ${token}`)
                .send({nome: 'Cliente Teste', cnpj: '77467923000182', endereco: 'Rua Teste, 123', telefone: '11999999999', email: uniqueEmail});
            
                expect(res.status).to.equal(409);

        })

        it('Deve retornar 409 quando inserido um cpf que já existe', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/clients')
                .set('Authorization', `Bearer ${token}`)
                .send({nome: 'Cliente Teste', cpf: '09290283092', endereco: 'Rua Teste, 123', telefone: '11999999999', email: uniqueEmail});
            expect(res.status).to.equal(409);


        })

         it('Deve retornar 400 quando enviar a requisição sem token', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/clients')
                //.set('Authorization', `Bearer ${token}`)
                .send({nome: 'Cliente Teste', cpf: uniqueCPF, endereco: 'Rua Teste, 123', telefone: '11999999999', email: uniqueEmail});
            expect(res.status).to.equal(400);


        })

    });  



    describe('GET /api/clients', () => {
        it('Deve retornar 200 quando listar todos os clientes cadastrados', async () => {  
            const res = await requestWithAuth(token)
                .get('/api/clients')
                .set('Authorization', `Bearer ${token}`)

        
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body).have

        })
        it.only('Deve retornar 401 quando não informado o token', async () => {  
            const res = await requestWithAuth(token)
                .get('/api/clients')
             //   .set('Authorization', `Bearer ${token}`)

      
            expect(res.status).to.equal(401);

        })
        



    });  



})