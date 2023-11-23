import { Request, Response } from 'express';
import User, {UserDocument} from '../models/userModel';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import isAdmin from '../middleware/role';
import Admin,{ AdminDocument } from '../models/adminModel';

import dotenv from 'dotenv';
dotenv.config();



interface CustomRequest extends Request {
    admin?: AdminDocument;
}

// Register Admin
const adminRegister = async (req: Request, res: Response) => {
    if (!process.env.secretKey) {
        throw new Error('Secret key is not defined');
    }
    try {
        const { name, email, password } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            res.status(409).json({
                success: false,
                message: "Admin already exists"
            });
        }
        else {
        // Create a new admin document asynchronously
        const newAdmin = await Admin.create({
            name,
            email,
            password,
        });

        // Use the admin document to sign the token
        const token = jwt.sign({ id: newAdmin.id, name, email, isAdmin: true }, process.env.secretKey, { expiresIn: '5h' });

        res.status(201).json({
            success: true,
            // token,
            message: `Admin saved successfully with token: ${token}`,
        });
    }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// createUser
const addUser = async (req: CustomRequest, res: Response) => {
    const { name, email, password , phoneNumber, addresses,apartment} = req.body;

console.log("req.admin.isAdmin is: ", req.admin?.isAdmin)
     
    if (!(req.admin?.isAdmin)) {
        return res.status(403).json({
            success: false,
            message: 'Permission denied. Only admin users can add users.',
        });
    }

    try {
        // Create a new user document
        const newUser = await User.create({
            name,
            email,
            password,
            phoneNumber,
            apartment,
            addresses,
        });

        res.status(201).json({
            success: true,
            user: newUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};



// Register User
// const userRegister = async (req: Request, res: Response) => {
//     if (!process.env.secretKey) {
//         throw new Error('Secret key is not defined');
//     }
//     try {
//         const { name, email, password , phoneNumber, addresses,apartment} = req.body;
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             res.status(409).json({
//                 success: false,
//                 message: "User already exists"
//             });
//         }

//         else {
//         // Create a new user document asynchronously
//         const newUser = await User.create({
//             name,
//             email,
//             password,
//             addresses,
//             phoneNumber,
//             apartment,
//         });
         
//         // Use the user document to sign the token
//         const token = jwt.sign({ id: newUser.id, name, email,
//              isAdmin: true
//              }, process.env.secretKey, { expiresIn: '5h' });

//         res.status(201).json({
//             success: true,
//             // token,
//             message: `User saved successfully with token: ${token}`,
//         });
//     }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//         });
//     }
// }; 

// User Login
const userLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = user.generateToken();

        res.status(200).json({
            success: true,
            message: `User logged in successfully with token: ${token}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const adminLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!process.env.secretKey) {
        throw new Error('Secret key is not defined');
    }
    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        const isPasswordValid = await admin.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // const token = admin.generateToken();
        const token = jwt.sign({ id: admin.id,  email, isAdmin: true }, process.env.secretKey, { expiresIn: '5h' });
         
        res.status(200).json({
            success: true,
            message: `Admin logged in successfully with token: ${token}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Generate reset token
const generateResetToken = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        return null;
    }

    const token = user.generateToken();
    return token;
}

// forgot password
const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!(process.env.authUser && process.env.authPassword)) {
        throw new Error('Auth user and password are not defined');
    }
    try {
        const resetToken = await generateResetToken(email);

        if (!resetToken) {
            return res.status(404).json({ message: 'User not found' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.authUser ,
                pass: process.env.authPassword
            }
        });

        const mailOptions = {
            from: process.env.authUser,
            to: email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: http://yourwebsite.com/reset-password/${resetToken}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending email' });
            }
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: `Reset link sent to your email`,resetToken });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Reset Password (Verify token)
const resetPassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword, email } = req.body;

    try {
        if (!process.env.secretKey) {
            throw new Error('Secret key is not defined');
        }
        jwt.verify(token, process.env.secretKey, async (err) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid or expired token'
                });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            user.password = newPassword;
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Password change successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}



// getSingleUser 

const getSingleUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


//getAllUsers
const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}



// updateUser
const updateUser = async (req: Request, res: Response) => {
    try {
        
        const updateData = req.body;
        const records = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!records) {
            res.status(404).json({
                success: false,
                message: "Record not found"
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'User updated successfully'
            });
        }
        
    } catch (err) {
        res.status(500).send(err);
    }
}

// deleteUser
const deleteUser = async (req: Request, res: Response) => {
    try {

        const records = await User.findByIdAndDelete(req.params.id);
        if (!records) {
            res.status(404).json({
                success: false,
                message: "Record not found"
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
}


export { 
    // userRegister ,
    addUser, 
    userLogin, 
    forgotPassword,
    resetPassword, 
    getSingleUser
    , getAllUsers
    , adminRegister,
    adminLogin
    ,updateUser, 
    deleteUser
};
