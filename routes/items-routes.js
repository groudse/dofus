const express = require('express')
const router = express.Router()

const  {
    getProducts
} = require('../controllers/items.js')
const {getRandomItem, itemChecked, getRentabilite, deleteItem} = require("../controllers/items");

router.get('/', getProducts)

router.get('/random', getRandomItem)


router.post('/renta', getRentabilite)

router.delete('/deleteItem/:id', deleteItem)


module.exports = router
