const models = require('../models');
const Domo = models.Domo;

const makerPage = async (req, res) => {
    return res.render('app');
}

const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.age || !req.body.food) {
        return res.status(400).json({ error: 'Both name and age are required!' });
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        food: req.body.food,
        owner: req.session.account._id,
    };

    try {
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({name: newDomo.name, age: newDomo.age, food: newDomo.food});
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'domo already exists!' });
        }
        return res.status(500).json({ error: 'An error occured making domo!' });
    }
};

const getDomos = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Domo.find(query).select('name age food').lean().exec();

        return res.json({ domos: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving domos!' });
    }
};

const deleteDomo = async (req, res) => {
    try{
        await Domo.deleteOne({_id: req.body.id, owner:req.session.account._id}).exec();
        
        return res.status(200).json({message: 'Domo deleted'});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error deleting Domo'});
    }
}

module.exports = {
    makerPage,
    makeDomo,
    getDomos,
    deleteDomo
};