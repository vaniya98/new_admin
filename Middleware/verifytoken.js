import { verify } from 'jsonwebtoken';
import { parse } from 'cookie';
import prisma from '@/lib/prisma'; // or wherever your Prisma instance is

export const verifyAdmin = async (req, res, next) => {
  try {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.adminToken;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token not found in cookies' });
    }

    const decoded = verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(403).json({ message: 'Forbidden: Invalid token structure' });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: 'Admin account is inactive or suspended' });
    }

    req.admin = admin; // Pass the admin info forward
    next(); // Proceed to the next middleware or handler
  } catch (error) {
    console.error('Token verification error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired, please login again' });
    }

    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};
