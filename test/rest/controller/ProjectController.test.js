const request = require('supertest');
const { expect } = require('chai');
const { getAuthToken } = require('../helpers/authentication');
const { requestWithAuth } = require('../helpers/requestwithAuthentication');
const { generateCPF, generateCNPJ, generateUniqueEmail } = require('../helpers/identifiers');
const { projects } = require('../../../model/db');
const db = require('../../../model/db');
const { get, put } = require('../../../app');
require('dotenv').config();


describe('Criar, editar e listar projeto', () => {

    const baseUrl = process.env.BASE_URL;
      
    let token;
    before(async () => {
        token = await getAuthToken();
    });

    let uniqueEmail;
    let uniqueCPF;
    let uniqueCNPJ; 

    beforeEach(() => {
        uniqueEmail = generateUniqueEmail();
        uniqueCPF = generateCPF();
        uniqueCNPJ = generateCNPJ();
    });

    describe('POST /api/projects', () => {
        it('Deve retornar 201 quando cadastrado projeto com sucesso', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`) 
                .send({nome: 'Projeto da Bruna', clienteId: 1, dataInicio: '2025-11-06', dataFim: '2025-12-31', dataPrevisao: '2025-12-31', valorCobrado: 50000.00, estaPago: 'sim', statusProjeto: 'Em andamento', descricao: 'Descrição do projeto da Bruna'});

            
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
   
        })
        it('Deve retornar 201 quando não informado campos opcionais: dataInicio, dataFim,dataPrevisao,descricao ', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`) 
                .send({nome: 'Projeto da Bruna', clienteId: 1, valorCobrado: 50000.00, estaPago: 'sim', statusProjeto: 'Em andamento'});

            
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
   
        })
        it('Deve retornar 400 quando enviado o campo obrigatório nome vazio', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`) 
                .send({nome: ' ', clienteId: 1, dataInicio: '2025-11-06', dataFim: '2025-12-31', dataPrevisao: '2025-12-31', valorCobrado: 50000.00, estaPago: 'sim', statusProjeto: 'Em andamento', descricao: 'Descrição do projeto da Bruna'});
           
            expect(res.status).to.equal(400);
          
        
        })
        it('Deve retornar 400 quando não enviado o campo obrigatório nome', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`) 
                .send({nome: ' ', clienteId: 1, dataInicio: '2025-11-06', dataFim: '2025-12-31', dataPrevisao: '2025-12-31', valorCobrado: 50000.00, estaPago: 'sim', statusProjeto: 'Em andamento', descricao: 'Descrição do projeto da Bruna'});
            
            expect(res.status).to.equal(400);
                  
        })
        it('Deve retornar 400 quando não enviado o campo obrigatório nome em formato diferente de string', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`) 
                .send({nome:1 , clienteId: 1, dataInicio: '2025-11-06', dataFim: '2025-12-31', dataPrevisao: '2025-12-31', valorCobrado: 50000.00, estaPago: 'sim', statusProjeto: 'Em andamento', descricao: 'Descrição do projeto da Bruna'});
            
            expect(res.status).to.equal(400);
                  
        })
        it('Deve retornar 400 quando não enviado o campo obrigatório nome', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`) 
                .send({nome: ' ', clienteId: 1, dataInicio: '2025-11-06', dataFim: '2025-12-31', dataPrevisao: '2025-12-31', valorCobrado: 50000.00, estaPago: 'sim', statusProjeto: 'Em andamento', descricao: 'Descrição do projeto da Bruna'});
            
            expect(res.status).to.equal(400);
                  
        })
        it('Deve retornar 404 quando o campo obrigatório clienteId for inexistente na base', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`) 
                .send({nome: 'teste', clienteId: 9999999, dataInicio: '2025-11-06', dataFim: '2025-12-31', dataPrevisao: '2025-12-31', valorCobrado: 50000.00, estaPago: 'sim', statusProjeto: 'Em andamento', descricao: 'Descrição do projeto da Bruna'});
            
            expect(res.status).to.equal(400);
                  
        })
        it('Deve retornar 400 quando não enviado o campo obrigatório valorCobrado', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`) 
                .send({nome: 'Teste 1', clienteId: 1 , dataInicio: '2025-11-06', dataFim: '2025-12-31', dataPrevisao: '2025-12-31' ,estaPago: 'sim', statusProjeto: 'Em andamento', descricao: 'Descrição do projeto da Bruna'});
          
            expect(res.status).to.equal(400);

        })
        it('Deve retornar 400 quando não enviado o campo obrigatório estaPago', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`) 
                .send({nome: 'Teste 1', clienteId: 1 , dataInicio: '2025-11-06', dataFim: '2025-12-31', dataPrevisao: '2025-12-31',valorCobrado: 50000.00, statusProjeto: 'Em andamento', descricao: 'Descrição do projeto da Bruna'});
         
            expect(res.status).to.equal(400);
        
        })
        it('Deve retornar 400 quando enviado vazio o campo obrigatório estaPago', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`) 
                .send({nome: 'Teste 1', clienteId: 1 , dataInicio: '2025-11-06', dataFim: '2025-12-31', dataPrevisao: '2025-12-31',valorCobrado: 50000.00, estaPago: '', statusProjeto: 'Em andamento', descricao: 'Descrição do projeto da Bruna'});
        
            expect(res.status).to.equal(400);
        
        })
        it('Deve retornar 400 quando enviado valor inválido no campo obrigatório estaPago', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`) 
                .send({nome: 'Teste 1', clienteId: 1 , dataInicio: '2025-11-06', dataFim: '2025-12-31', dataPrevisao: '2025-12-31',valorCobrado: 50000.00, estaPago: 'teste', statusProjeto: 'Em andamento', descricao: 'Descrição do projeto da Bruna'});
        
            expect(res.status).to.equal(400);
        
        })
        it('Deve retornar 400 quando enviado vazio o campo obrigatório statusProjeto', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`) 
                .send({nome: 'Teste 1', clienteId: 1 , dataInicio: '2025-11-06', dataFim: '2025-12-31', dataPrevisao: '2025-12-31',valorCobrado: 50000.00, estaPago: 'sim', statusProjeto: '', descricao: 'Descrição do projeto da Bruna'});
         
            expect(res.status).to.equal(400);
        
        })
        it('Deve retornar 400 quando não enviado o campo obrigatório statusProjeto', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`) 
                .send({nome: 'Teste 1', clienteId: 1 , dataInicio: '2025-11-06', dataFim: '2025-12-31', dataPrevisao: '2025-12-31',valorCobrado: 50000.00, estaPago: 'não', descricao: 'Descrição do projeto da Bruna'});
         
            expect(res.status).to.equal(400);
        
        })
        it('Deve retornar 400 quando enviado valor inválido no campo obrigatório statusProjeto', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`) 
                .send({nome: 'Teste 1', clienteId: 1 , dataInicio: '2025-11-06', dataFim: '2025-12-31', dataPrevisao: '2025-12-31',valorCobrado: 50000.00, estaPago: 'sim', statusProjeto: 'tstes05', descricao: "teste"});
         
            expect(res.status).to.equal(400);
        
        })
        it('Deve retornar 400 quando envido uma data de início maior que uma data fim', async () => {  
            const res = await requestWithAuth(token)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`) 
                .send({nome: 'Teste 1', clienteId: 1 , dataInicio: '2026-11-06', dataFim: '2025-12-31', dataPrevisao: '2025-12-31',valorCobrado: 50000.00, estaPago: 'sim', statusProjeto: 'Finalizado', descricao: "testando"});
      
            expect(res.status).to.equal(400);
        })

    describe('GET /api/project', () => {
        it('Deve retornar 200 quando listar todos os projetos cadastrados', async () => {  
            const res = await requestWithAuth(token)
                .get('/api/projects/')
                .set('Authorization', `Bearer ${token}`)
                    
            expect(res.status).to.equal(200);

        })
        it('Deve retornar 401 quando não informado o token', async () => {  
            const res = await requestWithAuth(token)
                .get('/api/projects')
             //   .set('Authorization', `Bearer ${token}`)
            expect(res.status).to.equal(401);

        })
        
    });  

    describe('GET /api/projects{id}', () => {

        const projectId = 1; // ID do projeto a ser buscado
        
        it.only('Deve retornar 200 quando listar o projeto filtrado.', async () => {  
            const res = await requestWithAuth(token)
                .get(`/api/projects/${projectId}`)
                .set('Authorization', `Bearer ${token}`)
         
            expect(res.status).to.equal(200);
            expect(res.body).to.include.all.keys('id', 'nome', 'clienteId', 'dataInicio', 'dataFim', 'dataPrevisao', 'valorCobrado', 'estaPago', 'statusProjeto', 'descricao');
         
        })
        it.only('Deve retornar 404 quando projeto não cadastrado', async () => {  
            const res = await requestWithAuth(token)
                .get('/api/projects/99999999')
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).to.equal(404);
         
        })
        it.only('Deve retornar 401 quando não informado o token', async () => {  
            const res = await requestWithAuth(token)
                .get(`/api/projects/${projectId}`)
             //   .set('Authorization', `Bearer ${token}`)

      
            expect(res.status).to.equal(401);

        })

    }); 




       
    });  





})