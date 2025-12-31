import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Ne pas retourner le password par défaut
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  // Clés API chiffrées (optionnel - si l'utilisateur veut utiliser ses propres clés)
  apiKeys: {
    gemini: { type: String, default: null },
    mistral: { type: String, default: null },
    huggingface: { type: String, default: null },
    cohere: { type: String, default: null }
  },
  // Statistiques utilisateur
  stats: {
    totalPrompts: { type: Number, default: 0 },
    totalAnalyses: { type: Number, default: 0 }
  }
}, {
  timestamps: true // Ajoute createdAt et updatedAt
});

// Hash le password avant de sauvegarder
userSchema.pre('save', async function(next) {
  // Seulement si le password a été modifié
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour retourner l'objet user sans le password
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.apiKeys; // Ne pas exposer les clés API
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
