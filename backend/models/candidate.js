import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // lié à un utilisateur
  offre: { type: mongoose.Schema.Types.ObjectId, ref: 'Offre', required: true }, // offre obligatoire

  telephone: { type: String, required: true },
  adresse: { type: String },

  experiences: [
    {
      societe: { type: String },
      poste: { type: String },
      duree: { type: String },
      description: { type: String }
    }
  ],

  competences: [{ type: String }],

  cvUrl: { type: String }, // CV en ligne (Cloudinary, etc.)
  photoUrl: { type: String }, // Photo optionnelle
  consentementImage: { type: Boolean, default: false },

  // Données post-entretien
  references: [
    {
      nom: { type: String },
      relation: { type: String },
      contact: { type: String }
    }
  ],
  signature: { type: String },

  // Résultat du test
  testResult: {
    score: { type: Number },
    total: { type: Number },
    date: { type: Date }
  },

  // Suivi du processus
  statut: {
    type: String,
    enum: [
      'Candidature initiale',
      'Test effectué',
      'Entretien effectué',
      'Accepté',
      'Rejeté'
    ],
    default: 'Candidature initiale'
  },

  createdAt: { type: Date, default: Date.now }
});

const Candidate = mongoose.model('Candidate', candidateSchema);
export default Candidate;
