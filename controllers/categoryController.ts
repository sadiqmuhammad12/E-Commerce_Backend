import { Request, Response } from 'express';
import Category from '../models/categoryModel';


// Add Category
const addCategory = async (req: Request, res: Response) => {
    try {
        const { name,color,icon} = req.body;

        const newCategory = await Category.create({
            name,
            icon,
            color
        });
        newCategory.save();
            res.status(201).json({
                success: true,
                message: 'Category added successfully',
            });
    }
     catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}; 

//getSingleCategory
const getSingleCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const catogry = await Category.findById(id);

        if (!catogry) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            catogry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


//getAllCategories
const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        if(categories.length === 0){
            res.status(500).json({
                success : false,
                message : "No categories found in the database"
            })
        }
        else{
            res.status(200).json({
                categories
            });
        }
        

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}



// updateCategory
const updateCategory = async (req: Request, res: Response) => {
    try {
        
        const updateData = req.body;
        const records = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!records) {
            res.status(404).json({
                success: false,
                message: "Record not found"
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Category updated successfully'
            });
        }
        
    } catch (err) {
        res.status(500).send(err);
    }
}

// deleteCategory
const deleteCategory = async (req: Request, res: Response) => {
    try {

        const records = await Category.findByIdAndDelete(req.params.id);
        if (!records) {
            res.status(404).json({
                success: false,
                message: "Record not found"
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Product deleted successfully'
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
}


export { addCategory, deleteCategory, getAllCategories, getSingleCategory,updateCategory};
