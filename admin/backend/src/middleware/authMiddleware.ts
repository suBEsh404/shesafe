import ApiError from '../utils/ApiError';
import { verifyAccessToken } from '../services/tokenService';
import User from '../models/User';

async function attachUser(req, token) {
  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.sub).select('-password');

  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  req.user = user;
  req.token = decoded;
}

async function authenticateRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required');
    }

    const token = authHeader.slice(7);
    await attachUser(req, token);
    next();
  } catch (error) {
    next(error);
  }
}

async function authenticateOptional(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      req.token = null;
      return next();
    }

    const token = authHeader.slice(7);
    await attachUser(req, token);
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      req.user = null;
      req.token = null;
      return next();
    }

    next(error);
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Insufficient permissions'));
    }

    return next();
  };
}

export {
  authenticateRequired,
  authenticateOptional,
  authorizeRoles
};

