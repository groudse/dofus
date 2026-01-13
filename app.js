const express = require('express')
const mongoose = require('mongoose')
const app = express()
const items_routes = require('./routes/items-routes.js')

require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)
    .then((result) => console.log('Connecté à MongoDB'))
    .catch((err) => console.log(Error))
app.listen(process.env.PORT)
app.use(express.json())
app.use('/api/dofus', items_routes)