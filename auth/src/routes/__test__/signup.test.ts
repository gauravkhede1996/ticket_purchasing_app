import request from "supertest";
import { app } from "../../app";
import { response } from "express";

it('returns a 201 on successfull signup', async () => {
    return (request(app) as any)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return (request(app) as any)
            .post('/api/users/signup')
            .send({
                email: 'asdfghjklllajf',
                password: 'password'
            })
            .expect(400);
});

it('returns a 400 with a invalid password', async () => {
    return (request(app) as any)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'p'
            })
            .expect(400);
});

it('returns a 400 with a missing email and password', async () => {
    await (request(app) as any)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com'
            })
            .expect(400);
    await (request(app) as any)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com'
            })
            .expect(400);
    });
it('disallows duplicate emails',async () => {
    await (request(app) as any)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '12345678'
        })
        .expect(201)
    await (request(app) as any)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '12345678'
        })
        .expect(400)
})
it('sets a cookie after successfull signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
    expect(response.get('Set-Cookie')).toBeDefined();
})

