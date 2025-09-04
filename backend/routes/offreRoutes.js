// routes/offres.js
import express from 'express';
import Offre from '../models/offre.js';
import { verifyToken } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// ✅ CREATE - POST /api/offres (admin seulement)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { titre, description, dateLimite, statut } = req.body;

    // Vérification des champs obligatoires (titre + description)
    if (!titre || !description) {
      return res.status(400).json({ message: 'Les champs titre et description sont obligatoires.' });
    }

    const nouvelleOffre = new Offre({
      titre,
      description,
      dateLimite: dateLimite || null, // si non fourni → null
      statut: statut || 'Ouverte',
    });

    await nouvelleOffre.save();
    res.status(201).json(nouvelleOffre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l’offre' });
  }
});

// ✅ READ - GET /api/offres (publique)
router.get('/', async (req, res) => {
  try {
    const offres = await Offre.find().sort({ dateCreation: -1 });
    res.json(offres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des offres' });
  }
});

// ✅ READ - GET /api/offres/:id (publique)
router.get('/:id', async (req, res) => {
  try {
    const offre = await Offre.findById(req.params.id);
    if (!offre) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }
    res.json(offre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de l’offre' });
  }
});

// ✅ UPDATE - PUT /api/offres/:id (admin seulement)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { dateLimite, ...autresChamps } = req.body;

    // Si la date est vide (ou effacée), on la met explicitement à null
    const updateData = {
      ...autresChamps,
      dateLimite: dateLimite || null,
    };

    const updatedOffre = await Offre.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedOffre) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    res.json(updatedOffre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l’offre' });
  }
});

// ✅ DELETE - DELETE /api/offres/:id (admin seulement)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const offre = await Offre.findByIdAndDelete(req.params.id);
    if (!offre) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }
    res.json({ message: 'Offre supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de l’offre' });
  }
});

export default router;
