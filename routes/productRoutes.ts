import express from 'express';
import { addProduct , getSingleProduct, getAllProducts,updateProduct, deleteProduct, getProductCount, getFeatureProducts, getProductByCategories}  from '../controllers/productController';
const router = express.Router();
import bodyParser = require('body-parser');
import morgan = require('morgan');


// Middleware
router.use(bodyParser.json());
router.use(morgan('tiny'))

router.post('/addProduct', addProduct);
router.get('/getSingleProduct/:id', getSingleProduct)
router.get('/getAllProducts', getAllProducts)
router.put('/updateProduct/:id', updateProduct)
router.delete('/deleteProduct/:id', deleteProduct)
router.get('/getProductCount',getProductCount)
router.get('/getFeatureProducts/:count', getFeatureProducts)
router.get('/getProductByCategories', getProductByCategories)
export default router;
