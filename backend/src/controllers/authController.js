import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Controller pour l'authentification
 */

/**
 * Génère un JWT token
 * @private
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d' // Token valide 7 jours
  });
};

/**
 * POST /api/auth/register - Inscription d'un nouvel utilisateur
 */
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Email, password, and name are required'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // Créer l'utilisateur
    const user = await User.create({
      email,
      password,
      name
    });

    // Générer le token
    const token = generateToken(user._id);

    console.log(` New user registered: ${email}`);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      },
      token
    });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      error: 'Failed to register user',
      message: error.message
    });
  }
};

/**
 * POST /api/auth/login - Connexion d'un utilisateur
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Trouver l'utilisateur (inclure le password pour la comparaison)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Générer le token
    const token = generateToken(user._id);

    console.log(` User logged in: ${email}`);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        stats: user.stats
      },
      token
    });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      error: 'Failed to login',
      message: error.message
    });
  }
};

/**
 * GET /api/auth/me - Récupérer les infos de l'utilisateur connecté
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        stats: user.stats,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error.message
    });
  }
};

/**
 * PUT /api/auth/profile - Mettre à jour le profil
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message
    });
  }
};

export default {
  register,
  login,
  getMe,
  updateProfile
};
