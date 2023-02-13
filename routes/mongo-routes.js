const {Router} = require('express');
const router = Router();
const mongoControllers = require('../controllers/mongoose-controller');

//get 
router.get('/',mongoControllers.getProducts)
//post
router.post('/createProducts',mongoControllers.createProduct)


module.exports = router;