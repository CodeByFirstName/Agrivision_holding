// backend/routes/testResultRoutes.js
import express from "express";
import { getTestByOffre, submitTest, getTestResultsByCandidat } from "../controllers/testResultController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// 🔹 Route publique pour récupérer le test par offre
// On peut éventuellement utiliser maybeVerify si on veut détecter l'utilisateur connecté
router.get("/by-offre/:offreId", verifyToken, getTestByOffre); // ici tu peux mettre maybeVerify si tu veux laisser public

// 🔹 Récupérer les résultats d'un candidat
router.get("/by-candidat/:id", verifyToken, getTestResultsByCandidat);


// 🔹 Soumettre le test (avec token obligatoire)
router.post("/tests/:testId/submit", verifyToken, submitTest);

// 🔹 Ancienne route pour compatibilité (avec candidatId dans l'URL)
router.post("/candidats/:candidatId/tests/:testId/submit", verifyToken, submitTest);

export default router;
