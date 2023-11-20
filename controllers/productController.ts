import { Request, Response } from 'express';
import Product from '../models/productModel';
import Category from '../models/categoryModel';
import mongoose from 'mongoose';
// Add product
const addProduct = async (req: Request, res: Response) => {
    try {
        const { name,image,countInStock,description,images,richDescription,brand,price,rating,isFeatured,category,numReviews } = req.body;
        const category_id = await Category.findById(req.body.category);
        console.log("Category_id is : ", category_id);
        if(category_id){
            const newProduct = await Product.create({
                name,
                image,
                countInStock,
                description,
                richDescription,
                images,
                brand,
                price,
                rating,
                isFeatured,
                category,
                numReviews,
            });
            newProduct.save()
            res.status(201).json({
                success: true,
                message: 'Product added successfully',
            });
        }
        else{
            res.status(400).json({
                success: false,
                message: 'Invalid Category'
            })
        }
       
    }
     catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}; 


const getSingleProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({
            success : false,
            message : "Invalid product ID "
        })
    }
    try {
        const product = await Product.findById(id).populate('category');
        // console.log("product category is : ", product)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


// getAllProducts
const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find().populate('category');
        // const products = await Product.find().select('name image price -_id');
        if(products.length === 0){
            res.status(500).json({
                success : false,
                message : "No products found in the database"
            })
        }
        else{
            res.status(200).json({
                products
            });
        }
        

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}



// updateProduct
const updateProduct = async (req:Request, res:Response) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        try {
            // Attempt to find the category by ID
            const category = await Category.findById(req.body.category);

            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: "Category not found"
                });
            }

            const updateData = req.body;
            const records = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

            if (!records) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Product updated successfully'
            });
        } 
        catch (err) {
            // Check for specific CastError when finding category by ID
            if (err instanceof mongoose.Error.CastError) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category ID associated with the updated product"
                });
            }
           
            throw err;
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

// deleteProduct
const deleteProduct = async (req: Request, res: Response) => {
    try {
        const category_id = await Category.findById(req.body.category);
        if(category_id){
            const records = await Product.findByIdAndDelete(req.params.id);
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
        }
        else{
            res.status(400).json({
                success: false,
                message: 'Category not found'
            })
        }
        
    } catch (err) {
        res.status(500).send(err);
    }
}

// count product
// const getProductCount = async (req: Request, res: Response) => {
//     try {
//         // const productCount = await Product.countDocuments((error : any, count : Number) => {})
//         const productCount = await Product.countDocuments((error: any, count: number) => {
//             if (error) {
//                 res.status(500).json({
//                     success: false,
//                     message: 'Error counting products'
//                 });
//             }
//             // You can handle the count or other logic here if needed
//         });
//         if(productCount === 0){
//             res.status(500).json({
//                 success : false,
//                 message : "No products found in the database"
//             })
//         }
//         else{
//             res.status(200).json({
//                 count : productCount
//             });
//         }
        

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// }
const getProductCount = async (req: Request, res: Response) => {
    try {
        const productCount = await Product.countDocuments();

        if (productCount === 0) {
            res.status(500).json({
                success: false,
                message: "No products found in the database"
            });
        } else {
            res.status(200).json({
                count: productCount
            });
        }
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export { addProduct,getSingleProduct,getAllProducts,updateProduct, deleteProduct,getProductCount};
