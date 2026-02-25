import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware d'authentification JWT
 * Vérifie le token et ajoute l'utilisateur à req.user
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Récupérer le token depuis le header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        error: 'Not authorized - No token provided'
      });
    }

    try {
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          error: 'User not found'
        });
      }

      // Ajouter l'utilisateur à la requête
      req.user = user;
      next();

    } catch (error) {
      return res.status(401).json({
        error: 'Not authorized - Invalid token'
      });
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Authentication error',
      message: error.message
    });
  }
};

/**
 * Middleware optionnel - Ajoute l'utilisateur si le token est présent, sinon continue
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (user) {
          req.user = user;
        }
      } catch (error) {
        // Si le token est invalide, continuer quand même
        console.warn('Invalid token provided, continuing without auth');
      }
    }

    next();
  } catch (error) {
    next();
  }
};

export default { protect, optionalAuth };
