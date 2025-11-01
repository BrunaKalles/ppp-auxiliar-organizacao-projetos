const request = require('supertest');
const { expect } = require('chai');
const { getAuthToken } = require('../helpers/authentication');
const { requestWithAuth } = require('../helpers/requestwithAuthentication');
require('dotenv').config();


describe('Cadastro de usuário', () => {
    const mensagemErro = 'Usuário, senha e email obrigatórios';
    const mensagemErroEmailExistente = 'Email já existe';
    
    
    let token;
    before(async () => {
        token = await getAuthToken();
    });

      // Função para gerar email único a cada teste
    function generateUniqueEmail() {
        const timestamp = Date.now();
        return `user_${timestamp}@example.com`;
    }
    const uniqueEmail = generateUniqueEmail();

    describe('POST /api/register', () => {
        it('Deve retornar 201 quando cadastro ralizado com sucesso', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/register')
                .set('Authorization', `Bearer ${token}`) 
                .send({ username: 'admin', password: '123456' , email: uniqueEmail});

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('username', 'admin', 'email');
        })

        it('Deve retornar 400 quando campo obrigatório username não for enviado ', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/register')
                .set('Authorization', `Bearer ${token}`)
                .send({ password: '123456', email: uniqueEmail});
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', mensagemErro); 

        })

        it('Deve retornar 400 quando campo obrigatório password não for enviado ', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/register')
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 'admin',  email: uniqueEmail});
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', mensagemErro); 

        })

        it('Deve retornar 400 quando campo obrigatório email não for enviado ', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/register')
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 'admin', password: '123456' });
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', mensagemErro); 

        })

        it('Deve retornar 400 quando inserido inteiro no campo username', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/register')
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 1, password: '123456' , email: uniqueEmail });
            expect(res.status).to.equal(400);
            //expect(res.body).to.have.property('error', mensagemErro); 

        })

        it('Deve retornar 400 quando inserido inteiro no campo password', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/register')
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 'admin', password: 1 , email: uniqueEmail });
            expect(res.status).to.equal(400);
            
        })

        it('Deve retornar 409 quando inserido e-mail já cadastrado', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/register')
                .set('Authorization', `Bearer ${token}`) 
                .send({ username: 'admin', password: '123456' , email: 'admin@admin.com'});

            expect(res.status).to.equal(409);
            expect(res.body).to.have.property('error', mensagemErroEmailExistente);
            
        })
       


    });  

    
});