import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';


// Enregistrement d’un nouvel utilisateur
export const register  = async (req, res) => {
  try {
    const { nom, prenoms, email, motDePasse, role } = req.body;

    // Vérifie si l’email est déjà utilisé
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
      nom,
      prenoms,
      email,
      motDePasse: hashedPassword,
      role: role || 'candidat'
    });

    await newUser.save();

    res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de l’inscription.' });
  }
};

// Connexion d’un utilisateur
export const  login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Vérifie si l’utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur introuvable.' });
    }

    // Vérifie le mot de passe
    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    // Crée le token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    


    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user._id,
        nom: user.nom,
        prenoms: user.prenoms,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
};
