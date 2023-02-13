const MongoClient = require('mongodb').MongoClient;

const createProduct = async (req,res,next) => {
    const newProduct = {
        name: req.body.name,
        price: req.body.price
    }
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db();
        const result = db.collection('products').insertOne(newProduct);
    } catch (error) {
        console.log(error)
        return res.status(404).json({message:'Could not store data'})
    }
    setTimeout(() => {client.close()},1500)
    res.json(newProduct);
}

const getProducts = async (req,res,next) => {
    const client = new MongoClient(url);
    let productsArray;

    try {
        await client.connect();
        const db = client.db();
        productsArray = await db.collection('products').find().toArray();
    } catch(error){
        return res.json({message:'Could not retireve productos'})
    }
    setTimeout(() => {client.close()},1500)
    res.json(productsArray);
}

exports.createProduct = createProduct;
exports.getProducts = getProducts;