import mongoose from "mongoose";
import Candidate from "../models/candidate.js";
import Offre from "../models/offre.js";

/**
 * ➕ Créer ou mettre à jour une candidature (user + offre)
 */
export const createOrUpdateCandidate = async (req, res) => {
  try {
    console.log('>>> Enter createOrUpdateCandidate');
    console.log('req.body (raw FormData):', req.body);
    console.log('req.file:', req.file);

    const body = { ...req.body };

    // Parser champs JSON encodés en string (FormData)
    if (body.competences && typeof body.competences === 'string') {
      try { body.competences = JSON.parse(body.competences); } catch (e) { console.warn('Competences parse failed:', e.message); }
    }
    if (body.experiences && typeof body.experiences === 'string') {
      try { body.experiences = JSON.parse(body.experiences); } catch (e) { console.warn('Experiences parse failed:', e.message); }
    }

    // CV uploadé
    if (req.file) {
      console.log('>>> File info:', req.file);
      const cvUrl =
        req.file.path ||
        req.file.secure_url ||
        req.file.url ||
        req.file.location ||
        (req.file?.metadata && req.file.metadata.secure_url) ||
        null;
      if (cvUrl) body.cvUrl = cvUrl;
      console.log('>>> CV URL:', cvUrl);
    }

    // Attacher l'utilisateur
    if (!body.user) {
      if (req.userId) body.user = req.userId;
      else if (req.user?.id) body.user = req.user.id;
      else return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // ⚡ Forcer ObjectId pour éviter doublons
    const userId = new mongoose.Types.ObjectId(body.user);
    const offreId = new mongoose.Types.ObjectId(body.offre);

    // Vérifier si candidature existante
    let candidate = await Candidate.findOne({ user: userId, offre: offreId });

    if (candidate) {
      // ➡ Mise à jour
      Object.assign(candidate, body);
      candidate.dateSoumission = Date.now();
      await candidate.save();
      console.log('Candidate updated id:', candidate._id);
      return res.status(200).json(candidate);
    } else {
      // ➡ Création
      candidate = new Candidate({ ...body, user: userId, offre: offreId });
      await candidate.save();
      console.log('Candidate created id:', candidate._id);
      return res.status(201).json(candidate);
    }

  } catch (error) {
    console.error('Erreur createOrUpdateCandidate ->', error);
    return res.status(500).json({ message: "Erreur lors de l'enregistrement", error: error.message || error });
  }
};

/**
 * 🔧 Fonction utilitaire pour normaliser les chaînes de recherche
 */
const normalizeSearchTerm = (term) => {
  if (!term) return '';
  return term
    .trim()
    // Enlever les accents
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Enlever les caractères spéciaux pour regex MAIS garder les espaces
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * 📌 Récupérer tous les candidats avec filtres dynamiques + populate (VERSION CORRIGÉE)
 */
export const getAllCandidates = async (req, res) => {
  try {
    console.log('>>> Recherche avec paramètres:', req.query);
    
    const { search, poste, statut, competences, dateFrom, dateTo, testValide, minExperienceMonths } = req.query;
    
    // 🚀 Utiliser l'agrégation pour une recherche plus puissante
    let pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $lookup: {
          from: "offres",
          localField: "offre",
          foreignField: "_id",
          as: "offre"
        }
      },
      { $unwind: "$user" },
      { $unwind: "$offre" }
    ];

    // 📝 Construire les conditions de filtrage
    let matchConditions = {};

    // 🔍 Recherche globale sur nom et prenoms (CORRIGÉE)
    if (search && search.trim()) {
      const normalizedSearch = normalizeSearchTerm(search);
      console.log('>>> Terme de recherche normalisé:', normalizedSearch);
      console.log('>>> Recherche originale:', search);
      
      matchConditions.$or = [
        { 
          "user.nom": { $regex: normalizedSearch, $options: "i" }
        },
        { 
          "user.prenoms": { $regex: normalizedSearch, $options: "i" }
        },
        {
          $expr: {
            $regexMatch: {
              input: { 
                $toLower: { 
                  $concat: [
                    { $ifNull: ["$user.nom", ""] }, 
                    " ", 
                    { $ifNull: ["$user.prenoms", ""] }
                  ] 
                } 
              },
              regex: normalizedSearch,
              options: "i"
            }
          }
        }
      ];
    }

    // 🎯 Recherche par poste (CORRIGÉE)
    if (poste && poste.trim()) {
      const normalizedPoste = normalizeSearchTerm(poste);
      console.log('>>> Poste normalisé:', normalizedPoste);
      console.log('>>> Recherche poste originale:', poste);
      
      matchConditions["offre.titre"] = { 
        $regex: normalizedPoste, 
        $options: "i" 
      };
    }

    // 📌 Statut
    if (statut) {
      matchConditions.statut = statut;
    }

    // 🛠 Compétences (recherche partielle insensible à la casse) - CORRIGÉE
    if (competences && competences.trim()) {
      const compArray = competences.split(",")
        .map(c => normalizeSearchTerm(c.trim()))
        .filter(Boolean);
      
      console.log('>>> Compétences normalisées:', compArray);
      
      if (compArray.length > 0) {
        matchConditions.competences = {
          $elemMatch: {
            $regex: compArray.join('|'),
            $options: "i"
          }
        };
      }
    }

    // 📆 Dates
    if (dateFrom || dateTo) {
      matchConditions.createdAt = {};
      if (dateFrom) matchConditions.createdAt.$gte = new Date(dateFrom);
      if (dateTo) matchConditions.createdAt.$lte = new Date(dateTo);
    }

    // ✅ Test validé
    if (testValide) {
      if (testValide === "oui") {
        matchConditions["testResult.score"] = { $exists: true, $ne: null };
      } else {
        matchConditions.$or = [
          { "testResult.score": { $exists: false } },
          { "testResult.score": null }
        ];
      }
    }

    // ⏳ Expérience minimale
    if (minExperienceMonths) {
      matchConditions.experiences = { 
        $elemMatch: { 
          duree: { $gte: Number(minExperienceMonths) } 
        } 
      };
    }

    // Ajouter les conditions de filtrage au pipeline
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    // Trier par date de soumission
    pipeline.push({ $sort: { dateSoumission: -1 } });

    console.log('>>> Pipeline de recherche:', JSON.stringify(pipeline, null, 2));

    const candidates = await Candidate.aggregate(pipeline);

    console.log(`>>> Trouvé ${candidates.length} candidat(s)`);
    
    res.status(200).json(candidates);
  } catch (error) {
    console.error('Erreur getAllCandidates:', error);
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
};

/**
 * 📌 Version alternative avec recherche simple (fallback)
 */
export const getAllCandidatesSimple = async (req, res) => {
  try {
    const { search, poste, statut, competences } = req.query;
    let filters = {};

    // Recherche simple avec populate
    const candidates = await Candidate.find(filters)
      .populate("user", "nom prenoms email")
      .populate("offre", "titre description")
      .sort({ dateSoumission: -1 });

    // Filtrage côté application si nécessaire
    let filteredCandidates = candidates;

    if (search && search.trim()) {
      const normalizedSearch = normalizeSearchTerm(search);
      filteredCandidates = candidates.filter(candidate => {
        const fullName = `${candidate.user?.nom || ''} ${candidate.user?.prenoms || ''}`.toLowerCase();
        const nom = (candidate.user?.nom || '').toLowerCase();
        const prenoms = (candidate.user?.prenoms || '').toLowerCase();
        
        return fullName.includes(normalizedSearch.toLowerCase()) || 
               nom.includes(normalizedSearch.toLowerCase()) || 
               prenoms.includes(normalizedSearch.toLowerCase());
      });
    }

    if (poste && poste.trim()) {
      const normalizedPoste = normalizeSearchTerm(poste);
      filteredCandidates = filteredCandidates.filter(candidate => {
        const titre = (candidate.offre?.titre || '').toLowerCase();
        return titre.includes(normalizedPoste.toLowerCase());
      });
    }

    if (statut) {
      filteredCandidates = filteredCandidates.filter(candidate => 
        candidate.statut === statut
      );
    }

    if (competences && competences.trim()) {
      const compArray = competences.split(",").map(c => c.trim().toLowerCase());
      filteredCandidates = filteredCandidates.filter(candidate => {
        return compArray.some(comp => 
          candidate.competences?.some(candidateComp => 
            candidateComp.toLowerCase().includes(comp)
          )
        );
      });
    }

    res.status(200).json(filteredCandidates);
  } catch (error) {
    console.error('Erreur getAllCandidatesSimple:', error);
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
};

/**
 * 🔎 Récupérer une candidature par ID
 */
export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate("user", "nom prenoms email")
      .populate("offre", "titre description");
    if (!candidate) return res.status(404).json({ message: "Candidat non trouvé" });
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error });
  }
};

/**
 * 🔎 Récupérer la candidature du candidat connecté pour une offre donnée
 */
export const getMyCandidateByOffer = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const offreId = new mongoose.Types.ObjectId(req.params.offreId);
    const candidate = await Candidate.findOne({ user: userId, offre: offreId })
      .populate("user", "nom prenoms email telephone adresse")
      .populate("offre", "titre description");
    if (!candidate) return res.status(404).json({ message: "Candidature non trouvée pour cette offre" });
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message || error });
  }
};

/**
 * 🎯 Récupérer toutes les candidatures liées à une offre
 */
export const getCandidatesByOffer = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const candidates = await Candidate.find({ offre: id })
      .populate("user", "nom prenoms email")
      .populate("offre", "titre description")
      .sort({ dateSoumission: -1 });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error });
  }
};

/**
 * ❌ Supprimer un candidat
 */
export const deleteCandidate = async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Candidat supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};

/**
 * ❌❌ Supprimer plusieurs candidats
 */
export const deleteManyCandidates = async (req, res) => {
  try {
    const { ids } = req.body;
    await Candidate.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Candidats supprimés" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression multiple", error });
  }
};