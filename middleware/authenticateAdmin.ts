import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  admin?: {
      id: string;
      name: string;
      password: string;
      isAdmin: any;
  };
}
const authenticateAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Retrieve the token from the request headers or cookies
  const token = req.headers.authorization?.split(' ')[1];
  console.log("token is: ",token)
  if (!token) {
      return res.status(401).json({
          success: false,
          message: 'Unauthorized: Token not provided',
      });
  }

  try {
    const decoded: any = jwt.verify(token, 'sadiqkhangmuhammadsadiq'); 
    console.log("decoded is: ", decoded)
      // Attach user information to the request object
      req.admin = {
          id: decoded.id,
          name: decoded.name,
          password: decoded.password,
          isAdmin: decoded.isAdmin,
      };

      next();
  } catch (error) {
    console.log("this catch")
      return res.status(401).json({
          success: false,
          message: 'Unauthorized: Invalid token',
      });
  }
};
export default authenticateAdmin;
