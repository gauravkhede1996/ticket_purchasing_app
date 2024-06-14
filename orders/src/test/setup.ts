import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt  from 'jsonwebtoken';

declare global {
    var signin: () => string[];
  }

let mongo: any;

jest.mock('../nats-wrapper');

beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for( let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
      }
    await mongoose.connection.close();
})

global.signin = () => {
    // Build a JWT Payload. { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build Session Object. { jwt: MY_JWT}
    const session = { jwt: token };

    // turn that session into object
    const sessionJSON = JSON.stringify(session);

    // take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with the encoded data
    return [`session=${base64}`];
}