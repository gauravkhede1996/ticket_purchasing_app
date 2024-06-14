import { app } from './app';
import mongoose from 'mongoose';
const port = 3000;

const start = async () => {
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }
    try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected with mongodb');
    } catch(err) {
        console.error(err);
    }

    app.listen(port, () => {
        console.log('Listening on port 3000 !');
    });
} 

start();

