const request = require('supertest');
const { expect } = require('chai');
const { getAuthToken } = require('../helpers/authentication');
const { requestWithAuth } = require('../helpers/requestwithAuthentication');
const { generateCPF, generateCNPJ, generateUniqueEmail } = require('../helpers/identifiers');
const { clients } = require('../../../model/db');
const db = require('../../../model/db');
const { get, put } = require('../../../app');
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
                .get('/api/clients/')
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).to.equal(200);
      

        })
        it('Deve retornar 401 quando não informado o token', async () => {  
            const res = await requestWithAuth(token)
                .get('/api/clients')
             //   .set('Authorization', `Bearer ${token}`)

            expect(res.status).to.equal(401);

        })
        
    });  


    describe('GET /api/clients{id}', () => {

        const clientId = 1; // ID do usuário a ser buscado
        
        it('Deve retornar 200 quando listar o cliente filtrado.', async () => {  
            const res = await requestWithAuth(token)
                .get(`/api/clients/${clientId}`)
                .set('Authorization', `Bearer ${token}`)

            expect(res.status).to.equal(200);
         
        })
         it('Deve retornar 404 quando cliente não cadastrado', async () => {  
            const res = await requestWithAuth(token)
                .get('/api/clients/99999999')
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).to.equal(404);
         
        })
        it('Deve retornar 401 quando não informado o token', async () => {  
            const res = await requestWithAuth(token)
                .get(`/api/clients/${clientId}`)
             //   .set('Authorization', `Bearer ${token}`)

      
            expect(res.status).to.equal(401);

        })

    });  

    describe('PUT /api/clients{id}', () => {           
        it('Deve retornar 200 quando alterado o cliente filtrado com sucesso.', async () => {  
            
            const getRes = await requestWithAuth(token)
                .get('/api/clients/')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            const clientes = getRes.body;
            const ultimocliente = clientes[clientes.length - 1];

            const putRes =  await requestWithAuth(token)
                .put(`/api/clients/${ultimocliente.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Cliente Editado', endereco: 'Rua Editada, 456', telefone: '11988888888' });

            expect(putRes.body.nome).to.equal('Cliente Editado');
            expect(putRes.status).to.equal(200);

         
        })
        
        it('Deve retornar 400 quando é enviado o campo nome vazio.', async () => {  
            
            const getRes = await requestWithAuth(token)
                .get('/api/clients/')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            const clientes = getRes.body;
            const ultimocliente = clientes[clientes.length - 1];

            const putRes =  await requestWithAuth(token)
                .put(`/api/clients/${ultimocliente.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: '', endereco: 'Rua Editada, 456', telefone: '11988888888' });

            expect(putRes.status).to.equal(400);
            
         
        })


        it('Deve retornar 400 quando removido o campo nome', async () => {  
            
            const getRes = await requestWithAuth(token)
                .get('/api/clients/')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            const clientes = getRes.body;
            const ultimocliente = clientes[clientes.length - 1];

            const putRes =  await requestWithAuth(token)
                .put(`/api/clients/${ultimocliente.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ endereco: 'Rua Editada, 456', telefone: '11988888888' });

            expect(putRes.status).to.equal(400);
            
         
        })

        it('Deve retornar 200 quando enviado o endereço vazio', async () => {  
            
            const getRes = await requestWithAuth(token)
                .get('/api/clients/')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            const clientes = getRes.body;
            const ultimocliente = clientes[clientes.length - 1];

            const putRes =  await requestWithAuth(token)
                .put(`/api/clients/${ultimocliente.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Teste', endereco: '', telefone: '11988888888' });

            expect(putRes.status).to.equal(200);

        })

        it('Deve retornar 200 quando enviado sem o campo endereço', async () => {  
            
            const getRes = await requestWithAuth(token)
                .get('/api/clients/')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            const clientes = getRes.body;
            const ultimocliente = clientes[clientes.length - 1];

            const putRes =  await requestWithAuth(token)
                .put(`/api/clients/${ultimocliente.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Teste',  telefone: '11988888888' });

            expect(putRes.status).to.equal(200);

        })


        it('Deve retornar 200 quando enviado o campo telefone vazio', async () => {  
            
            const getRes = await requestWithAuth(token)
                .get('/api/clients/')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            const clientes = getRes.body;
            const ultimocliente = clientes[clientes.length - 1];

            const putRes =  await requestWithAuth(token)
                .put(`/api/clients/${ultimocliente.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Cliente Editado', endereco: 'Rua Editada, 456', telefone: ''});

            expect(putRes.status).to.equal(200);

        })

        it('Deve retornar 200 quando remover o campo telefone', async () => {  
            
            const getRes = await requestWithAuth(token)
                .get('/api/clients/')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            const clientes = getRes.body;
            const ultimocliente = clientes[clientes.length - 1];

            const putRes =  await requestWithAuth(token)
                .put(`/api/clients/${ultimocliente.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Cliente Editado', endereco: 'Rua Editada, 456'});

            expect(putRes.status).to.equal(200);

        })

        it('Deve retornar 404 quando cliente inexistente', async () => {  
            
            const clientId = 9999999999;
            const putRes =  await requestWithAuth(token)
                .put(`/api/clients/${clientId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Cliente Editado', endereco: 'Rua Editada, 456'});

            expect(putRes.status).to.equal(404);

        })

        it('Deve retornar 400 quando enviado sem token', async () => {  
            
            const clientId = 9999999999;
            const putRes =  await requestWithAuth(token)
                .put(`/api/clients/${clientId}`)
                .set('Authorization', `Bearer ${''}`)
                .send({ nome: 'Cliente Editado', endereco: 'Rua Editada, 456'});

            expect(putRes.status).to.equal(400);

        })

    });  





})