const request = require('supertest');
const db = require('../database/dbConfig.js');
const api = require('../users/users-model');
const bc = require('bcryptjs')
const server = require('../api/server.js');

describe('api tests', () => {
    describe('check for testing env', () => {
        it('should run', () => {
            expect(process.env.DB_ENV).toBe('testing');
        })
    })

    describe('add user', () => {
        beforeEach(async () => {
            await db('users').truncate();
        })
    
        it('add a user', async () => {
            await api.add({username: "one", password:"one"});

            const users = await db('users');
    
            expect(users).toHaveLength(1);
        })

        it('register returns 201', async (done) => {

            request(server)
                .post('/api/auth/register')
                .send({username:"one", password:"one"})
                .expect(201)
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        })

        it('login should return json', async (done) => {
            await api.add({ username: "one", password: "one" });

            request(server)
                .post('/api/auth/login')
                .send({ username: "one", password: "one" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        })


    })
})