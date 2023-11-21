import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
interface Address {
    street: string;
    city: string;
    zip: string;
    country: string;
}

interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
  
    apartment: string;
    phoneNumber: string;
    isAdmin: Boolean;
    addresses: Address[];
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateToken(): string;
}

const addressSchema = new Schema<Address>({
    street: { type: String , default : ''},
    city: { type: String, default : '' , },
    zip: { type: String, default : '' },
    country: { type: String, default : '' },
});

const userSchema = new Schema<UserDocument>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    apartment : {
        type : String,
        default : ''
    },
    // role: {
    //     type: String,
    //     required: true,
    //     enum: ["user", "admin"]
    // },
    
    isAdmin: {
        type: Boolean,
        default: true,
    },

    phoneNumber: {
        type: String,
        required: true
    },
    
    addresses: [addressSchema]
});

// Hash the password before saving to the database
userSchema.pre<UserDocument>('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error: any) {
        return false;
    }
};

// Generate JWT token for the user
userSchema.methods.generateToken = function() {
    if (!process.env.secretKey) {
        throw new Error('Secret key is not defined');
    }
    return jwt.sign({ _id: this._id }, process.env.secretKey, { expiresIn: '5h' });
};

const User: Model<UserDocument> = mongoose.model('User', userSchema);

export { UserDocument };
export default User;
