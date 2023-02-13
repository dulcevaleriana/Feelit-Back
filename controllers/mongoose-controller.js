const Product = require('../models/product');
require('dotenv').config();

const getProducts = async (req,res,next) => {
    const products = await Product.find().exec();
    res.json(products);
}

const createProduct = async (req,res,next) => {
    const createProduct = new Product({
        name:req.body.name,
        price:req.body.price
    });
    const result = await createProduct.save();
    res.json(result)
}

exports.getProducts = getProducts;
exports.createProduct = createProduct;