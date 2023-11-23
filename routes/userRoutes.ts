import express from 'express';
import { addUser,adminRegister, userLogin, adminLogin,forgotPassword, resetPassword, updateUser, deleteUser,getSingleUser, getAllUsers}  from '../controllers/userController';

const router = express.Router();
import authenticateAdmin from '../middleware/authenticateAdmin';
import isAdmin from '../middleware/role';

router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:token', resetPassword);
router.post('/adminRegister', adminRegister);
router.post('/adminLogin', adminLogin)

// Middleware
router.use(authenticateAdmin);

router.post('/addUser', isAdmin, addUser)
router.get('/getAllUsers',isAdmin, getAllUsers);
router.get('/getSingleUser/:id',isAdmin, getSingleUser);
router.put('/updateUser/:id',isAdmin, updateUser);
router.delete('/deleteUser/:id', isAdmin,deleteUser)
router.post('/userLogin', isAdmin,userLogin);

export default router;
