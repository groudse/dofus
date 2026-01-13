import Item from '../models/items.model.js'
import pino from 'pino';

const logger = pino();

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

const itemChecked = async (itemId) => {
    logger.info('checked item:', itemId)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    try {
        const updatedItem = await Item.findOneAndUpdate(
            {id: itemId},
            {lastTimeChecked: today},
            {new: true}
        )
        if (!updatedItem) {
            console.log('Item not found')
        }
        console.log('Item updated:', updatedItem)
    } catch (error) {
        console.error('Erreur mise à jour:', error)
    }
}


const getRentabilite = async (req, res) => {
    try {

        logger.info("body", req.body)
        let historiquePrx =  req.body;
        logger.info("histo", historiquePrx)


        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 4);

        const filteredList = historiquePrx.filter(item =>
            new Date(item.inserted_at) >= fiveDaysAgo && item.price_1 > 0
        );

        if (filteredList.length === 0) {
            await itemChecked(historiquePrx[0].item_id);
            return res.status(200).json('Pas de données récentes')
        }

        const itemRecent = filteredList.sort((a, b) =>
            new Date(b.inserted_at) - new Date(a.inserted_at)
        )[0];



        const result = filteredList.reduce((sum, item) => sum + item.price_1, 0) /
            filteredList.length;

        if (itemRecent.price_1 < result * 0.80) {
            await fetch('https://ntfy.sh/dofusiteminfo', {
                method: 'POST',
                body: `Il faut acheter ${itemRecent.name} prix moyen : ${Math.ceil(result)}`
            });
            await itemChecked(itemRecent.item_id);
            return res.status(200).json('cool')
        } else {
            await itemChecked(itemRecent.item_id);
            return res.status(200).json('trop nul')
        }
    } catch (error) {
        res.status(500).json({msg: error.message})
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






export {
    getProducts,
    getRandomItem,
    getRentabilite,
    deleteItem
}