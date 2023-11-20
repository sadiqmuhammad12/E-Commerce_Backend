import express from 'express';
import { addCategory, deleteCategory, getAllCategories, getSingleCategory,updateCategory}  from '../controllers/categoryController';
const router = express.Router();
import bodyParser = require('body-parser');
import morgan = require('morgan');


// Middleware
router.use(bodyParser.json());
router.use(morgan('tiny'))

router.post('/addCategory', addCategory);
router.delete('/deleteCategory/:id', deleteCategory);
router.get('/getAllCategories', getAllCategories);
router.get('/getSingleCategory/:id', getSingleCategory)
router.put('/updateCategory/:id', updateCategory)
export default router;
