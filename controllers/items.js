const Item = require('../models/items.model.js')

const getProducts = ((req, res) => {
    Item.find({})
        .then(result => {
            console.log('eeeeeeeeeeeee', result)
            res.status(200).json({result})
        })
        .catch(error => res.status(500).json({msg: error}))
})


const getRandomItem = async (req, res) => {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const item = await Item.findOne({
            lastTimeChecked: { $lt: today }
        })

        if (!item) {
            return res.status(404).json({ msg: 'Aucun item disponible' })
        }

        res.status(200).json(item.id)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

const itemChecked = (req, res) => {
    const idQuery = req.query.id

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    Item.findOneAndUpdate({id: idQuery}, {lastTimeChecked: today}, {new: true})
        .then(updatedItem => {
            if (!updatedItem) {
                return res.status(404).json({msg: 'Item not found'})
            }
            res.status(200).json({result: updatedItem})
        })
        .catch(error => res.status(500).json({msg: error.message}))

}


const getRentabilite = async (req, res) => {
    const historiquePrx = req.body;
    const today = new Date();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 4);

    const filteredList = historiquePrx.filter(item =>
        new Date(item.inserted_at).getTime() >= today - fiveDaysAgo
    );


    const prixRecent = filteredList.sort((a, b) =>
        new Date(b.inserted_at) - new Date(a.inserted_at)
    )[0].price_1;


    const result = filteredList.reduce((sum, item) => sum + item.price_1, 0) /
        (historiquePrx.length || 1);


    if (prixRecent < result) {
        // send a post request to ntfy.sh
        await fetch('https://ntfy.sh/dofusiteminfo', {
            method: 'POST',
            body: `Il faut acheter ${historiquePrx[0].name}`
        });
        res.status(200).json('cool')

    } else {
        res.status(200).json('trop nul')
    }


}

const deleteItem = (req, res) => {
    const idItem = req.params.id

    Item.findOneAndDelete({id: idItem})
        .then(deletedItem => {
            if (!deletedItem) {
                return res.status(404).json({msg: 'Item not found'})
            }
            res.status(200).json({msg: `item ${idItem} deleted`})
        })
        .catch(error => res.status(500).json({msg: error.message}))
}






module.exports = {
    getProducts,
    getRandomItem,
    itemChecked,
    getRentabilite,
    deleteItem
}