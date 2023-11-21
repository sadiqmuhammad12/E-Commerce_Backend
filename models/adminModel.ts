import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface AdminDocument extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin : Boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateToken(): string;
}

const adminSchema = new Schema<AdminDocument>({
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
    isAdmin: {
        type: Boolean,
        default: true,
    }
});

// Hash the password before saving to the database
adminSchema.pre<AdminDocument>('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function(candidatePassword: string) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error: any) {
        return false;
    }
};

// Generate JWT token for the user
adminSchema.methods.generateToken = function() {
    if (!process.env.secretKey) {
        throw new Error('Secret key is not defined');
    }
    return jwt.sign({ _id: this._id }, process.env.secretKey, { expiresIn: '5h' });
};

const Admin: Model<AdminDocument> = mongoose.model('Admin', adminSchema);

export { AdminDocument };
export default Admin;
