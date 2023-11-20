import mongoose, { Document, Model, Schema, Types } from 'mongoose';


interface ProductDocument extends Document {
    name: string;
    image: string;
    countInStock: Number;
    description: String;
    richDescription : String;
    images : String[];
    brand : String;
    price : Number;
    rating : Number;
    isFeatured : Boolean;
    dateCreated :Date;
    category: Types.ObjectId;
    numReviews: Number;
}

const productSchema = new Schema<ProductDocument>({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default : ''
    },
    images : [{
        type: String
    }],
    description:{
        type:String,
        required:true
    },
    richDescription:{
        type:String,
        default:''
    },
    numReviews:{
        type:Number,
        default: 0
    },
    brand:{
        type:String,
        default:''
    },
    price:{
        type:Number,
        default:0
    },
    isFeatured:{
        type:Boolean,
        default:false
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required: true
    },
    rating:{
        type:Number,
        default:0
    },
    countInStock: {
        type: Number,
        required : true,
        min:0,
        max:255
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
    
});


const Product: Model<ProductDocument> = mongoose.model('Product', productSchema);

export default Product;
