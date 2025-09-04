import express from 'express';
import {
  createOrUpdateCandidate,
  getAllCandidates,
  getCandidateById,
  getCandidatesByOffer,
  deleteCandidate,
  deleteManyCandidates,
  getMyCandidateByOffer
} from '../controllers/candidateController.js';
import { upload } from '../config/cloudinary.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// ➕ Création ou mise à jour
router.post('/', verifyToken, upload.single('cv'), createOrUpdateCandidate);
router.put('/:id', verifyToken, upload.single('cv'), createOrUpdateCandidate);

// 📌 Lecture tous les candidats (admin)
router.get('/', verifyToken, getAllCandidates);

// 🔎 Récupérer la candidature du candidat connecté pour une offre donnée
// ⚠️ Cette route doit être avant '/:id'
router.get("/me/:offreId", verifyToken, getMyCandidateByOffer);

// 🎯 Lecture des candidats liés à une offre
router.get('/offre/:id', verifyToken, getCandidatesByOffer);

// 🔎 Lecture d’un candidat par ID
router.get('/:id', verifyToken, getCandidateById);

// ❌ Suppression individuelle
router.delete('/:id', verifyToken, deleteCandidate);

// ❌❌ Suppression multiple
router.delete('/', verifyToken, deleteManyCandidates);

export default router;
