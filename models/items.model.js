const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    id: Number,
    typeId: Number,
    name: String,
    lastTimeChecked: Date
}, { collection: 'items' })

const Item = mongoose.model('Item', ItemSchema)

module.exports = Item