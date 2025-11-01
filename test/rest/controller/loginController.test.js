const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();



describe('Autenticação de usuário', () => {
    const mensagemErro = 'Credenciais inválidas';
    const baseUrl = process.env.BASE_URL;

    describe('POST /api/login', () => {
        it('Deve retornar 200 ao logar com sucesso', async () => {
            const res = await request(baseUrl)
                 .post('/api/login')
                .send({ username: 'admin', password: '123456' });
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('token');
            expect(res.body.token).to.be.a('string'); 
        })

        it('Deve retornar 401 quando campo obrigatório username não for enviado', async () => {  
            const res = await request(baseUrl)
                .post('/api/login')
                .send({ password: '123456' });
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('error', mensagemErro); 
        })

        it('Deve retornar 401 quando campo obrigatório password não for enviado', async () => {  
            const res = await request(baseUrl)
                .post('/api/login')
                .send({ username: 'admin' });
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('error', mensagemErro); 
        })

        it('Deve retornar 401 quando campo obrigatório username enviado vazio', async () => {  
            const res = await request(baseUrl)
                .post('/api/login')
                .send({username: '', password: '123456' });
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('error', mensagemErro); 
        })

        it('Deve retornar 401 quando campo obrigatório password enviado vazio', async () => {  
            const res = await request(baseUrl)
                .post('/api/login')
                .send({username: 'admin', password: '' });
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('error', mensagemErro); 
        })

        it('Deve retornar 401 quando campo obrigatório username inálido e senha válida', async () => {  
            const res = await request(baseUrl)
                .post('/api/login')
                .send({username: 'admin1', password: '123456' });
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('error', mensagemErro); 
        })

        it('Deve retornar 401 quando campo obrigatório username válido e password inválida', async () => {  
            const res = await request(baseUrl)
                .post('/api/login')
                .send({username: 'admin', password: '1234567' });
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('error', mensagemErro); 
        })

         it('Deve retornar 401 quando não enviado nada no body', async () => {  
            const res = await request(baseUrl)
                .post('/api/login')
                .send({ });
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('error', mensagemErro); 
        })


    });  

    
});