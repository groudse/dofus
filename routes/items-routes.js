const express = require('express')
const router = express.Router()

const  {
    getProducts
} = require('../controllers/items.js')
const {getRandomItem, itemChecked, getRentabilite} = require("../controllers/items");

router.get('/', getProducts)

router.get('/random', getRandomItem)

router.get('/checked', itemChecked)

router.post('/renta', getRentabilite)


module.exports = router
