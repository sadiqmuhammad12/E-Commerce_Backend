import mongoose, { Document, Model, Schema } from 'mongoose';


interface CategoryDocument extends Document {
    name: string;
    // image: string;
    color: String;
    icon : String;
}

const categorySchema = new Schema<CategoryDocument>({
    name: {
        type: String,
        required: true
    },
    // image: {
    //     type: String,
    //     default : ''
    // },
  
    color:{
        type:String
    },
    icon:{
        type:String
    } 
});


const Category: Model<CategoryDocument> = mongoose.model('Category', categorySchema);

export default Category;
