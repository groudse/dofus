const express = require('express')
import cors from 'cors';
const mongoose = require('mongoose')
const app = express()
const items_routes = require('./routes/items-routes.js')

require('dotenv').config()

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