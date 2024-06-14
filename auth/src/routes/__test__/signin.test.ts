import request from 'supertest';
import { app } from '../../app'; 

it('fails when a email doesnot exist is supplied', async () => {
    await (request(app) as any)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
    await (request(app) as any)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    await (request(app) as any)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'asdfghjk'
        })
        .expect(400);
})