import express from 'express';
import { userRegister , login, forgotPassword, resetPassword
    // , addUser  , getSingleUser, getAllUsers,updateUser, deleteUser
}  from '../controllers/userController';
const router = express.Router();


// import isAdmin from '../middleware/role';
// import authenticateAdmin from '../middleware/authenticateAdmin';

// router.post('/login', login);
// router.post('/forgotPassword', forgotPassword);
// router.post('/resetPassword/:token', resetPassword);
// Middleware

router.post('/userRegister', userRegister);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:token', resetPassword);



// router.use(authenticateAdmin);
// router.post('/addUser', isAdmin ,addUser);
// router.get('/getAllUsers',isAdmin, getAllUsers);
// router.get('/getSingleUser/:id',isAdmin, getSingleUser);

// router.put('/updateUser/:id',isAdmin, updateUser);
// router.delete('/deleteUser/:id', isAdmin,deleteUser)

export default router;