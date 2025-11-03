const request = require('supertest');
const { expect } = require('chai');
const { getAuthToken } = require('../helpers/authentication');
const { requestWithAuth } = require('../helpers/requestwithAuthentication');
const { users } = require('../../../model/db');
const db = require('../../../model/db');
require('dotenv').config();


describe('Criação, edição e deleção de usuário', () => {
    const mensagemErro = 'Usuário, senha e email obrigatórios';
    const baseUrl = process.env.BASE_URL;
      
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


    function gerarSenha() {
    return Math.random().toString(36).slice(-8); // ex: "k3s9v2xq"
    }

    const novaSenha = gerarSenha();

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
                  
        })

        it('Deve retornar 400 quando não informado o token', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/register')
               // .set('Authorization', `Bearer ${token}`) 
                .send({ username: 'admin', password: '123456' , email: uniqueEmail});

            expect(res.status).to.equal(400);
                  
        })
       


    });  


    describe('GET /api/users', () => {
        it('Deve retornar 200 listando todos os usuários cadastrados', async () => {  
            const res = await requestWithAuth(token)
                .get('/api/users')
                .set('Authorization', `Bearer ${token}`) 
               
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array'); // garante que o retorno é um array
            expect(res.body.length).to.be.greaterThan(0); // pelo menos 1 usuário cadastrado

            const user = res.body[0]; // pega o primeiro usuário
            expect(user).to.have.property('id');
            expect(user).to.have.property('username');
            expect(user).to.have.property('email');
            expect(user).to.have.property('password');
                    
        })
        it('Deve retornar 401 quando não possuir token', async () => {  
            const res = await requestWithAuth(token)
                .get('/api/users')
        
            expect(res.status).to.equal(401);

                    
        })

    });  

    describe('GET /api/users/{id}', () => {
        const userId = 1; // ID do usuário a ser buscado

        it('Deve retornar 200 listando o usuário cadastrado', async () => {  
            
            const res = await requestWithAuth(token)
                 .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`) 
               
            expect(res.status).to.equal(200);
                       
            expect(res.body).to.have.property('id', userId);
            expect(res.body).to.have.property('username');
            expect(res.body).to.have.property('email');
            expect(res.body).to.have.property('password');
                    
        })

        it('Deve retornar 404 ao filtrar por id não cadastrado', async () => {  
            const userId = 99999; // ID do usuário não cadastrado
            const res = await requestWithAuth(token)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`) 
               
            expect(res.status).to.equal(404);
 
                    
        })


        it('Deve retornar 404 quando não possuir token', async () => {  
            const res = await requestWithAuth(token)
                .get(`/api/users/${userId}`)
              //  .set('Authorization', `Bearer ${token}`) 
        
            expect(res.status).to.equal(404);
        })


      
          
    });

    describe('PUT  /api/users/:id/password', () => {
        const userId = 2;
          it('Deve retornar 200 quando alterada senha com sucesso', async () => {  
            
            const userAntigo = db.users.find(u => u.id === userId);
            const senhaAntiga = userAntigo.password;

            const res = await requestWithAuth(token)
                .put(`/api/users/${userId}/password`)
                .set('Authorization', `Bearer ${token}`) 
                .send({ password: novaSenha });
           
            expect(res.status).to.equal(200);

            // Busca novamente o usuário atualizado via API
            const resGet = await requestWithAuth(token)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);

            // Verifica se a senha realmente mudou
            expect(resGet.body.password).to.not.equal(senhaAntiga);
            expect(resGet.body.password).to.equal(novaSenha);
        })

        it('Deve retornar 400 quando não informado o token', async () => {  
            const res = await requestWithAuth(token)
                .put(`/api/users/${userId}/password`)
               // .set('Authorization', `Bearer ${token}`) 
                .send({ password: novaSenha });

            expect(res.status).to.equal(400);
                  
        })

        it('Deve retornar 400 quando não passado a senha', async () => {  
            const res = await requestWithAuth(token)
                .put(`/api/users/${userId}/password`)
                .set('Authorization', `Bearer ${token}`) 
                .send({ });

            expect(res.status).to.equal(400);
                  
        })

      
    });


    describe('DELETE /api/users{id}', () => {
        it('Deve retornar 200 quando usuário deletado com sucesso', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/register')
                .set('Authorization', `Bearer ${token}`) 
                .send({ username: 'admin', password: '123456' , email: uniqueEmail});

            const res1 = await requestWithAuth(token)
                .get('/api/users')
                .set('Authorization', `Bearer ${token}`)

            const users = res1.body;
            const ultimoUsuario = users[users.length - 1];

            expect(ultimoUsuario).to.have.property('id');

            const deleteRes = await request(baseUrl)
               .delete(`/api/users/${ultimoUsuario.id}`)
               .set('Authorization', `Bearer ${token}`);

            expect(deleteRes.status).to.equal(200);

       
        })

        it('Deve retornar 400 quando não informado o token na deleção', async () => {  
     
            const ultimoUsuario = users[users.length - 1];

            expect(ultimoUsuario).to.have.property('id');

            const deleteRes = await request(baseUrl)
               .delete(`/api/users/${ultimoUsuario.id}`)
            //   .set('Authorization', `Bearer ${token}`);

            expect(deleteRes.status).to.equal(400);

       
        })
        it('Deve retornar 404 quando não encontrado usuário para deletar', async () => {  
     
            const usuarioNaoExistenteId = 999999;

            const deleteRes = await request(baseUrl)
                .delete(`/api/users/${usuarioNaoExistenteId}`)
                .set('Authorization', `Bearer ${token}`);

            
            expect(deleteRes.status).to.equal(404);

        })

    


    });  



})