import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
const app = express()
import items_routes from './routes/items-routes.js'
dotenv.config();

app.use(cors({
    origin: 'https://imagiro.laboubourse.com',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
}));







mongoose.connect(process.env.MONGO_URI)
    .then((result) => console.log('Connecté à MongoDB'))
    .catch((err) => console.log(Error))
app.listen(process.env.PORT)
app.use(express.json())
app.use('/api/dofus', items_routes)