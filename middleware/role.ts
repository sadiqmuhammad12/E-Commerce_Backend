// import { Request, Response, NextFunction } from 'express';
// import { AdminDocument } from '../models/adminModel';

// interface AuthenticatedRequest extends Request {
//     admin?: AdminDocument;
// }

// const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     const adminRole = req.admin?.isAdmin;

//     console.log("req.admin is: ", req.admin?.isAdmin)

//     if (adminRole) {
//         next();
//     } else {
//         res.status(403).json({
//             success: false,
//             message: 'Permission denied. Only admin users can access this resource.',
//         });
//     }
// };
// export default isAdmin;
import { Request, Response, NextFunction } from 'express';
import { AdminDocument } from '../models/adminModel';

interface AuthenticatedRequest extends Request {
    admin?: AdminDocument;
}

const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Assuming isAdmin is set during registration
    const isAdminUser = req.admin?.isAdmin === true;
    console.log("isAdminUser is : ", isAdminUser)
    if (isAdminUser) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Permission denied. Only admin users can access this resource.',
        });
    }
};

export default isAdmin;
