// models/Offre.js
import mongoose from 'mongoose';

const offreSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  dateLimite: {
    type: Date,
    required: false,
    default: null,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test', // référence au modèle Test
    required: false,
  },
  testObligatoire: {
    type: Boolean,
    default: false, // si vrai, le candidat doit passer le test avant validation
  },
  nombreTentatives: {
    type: Number,
    default: 1, // tentatives autorisées
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
  statut: {
    type: String,
    enum: ['Ouverte', 'Fermée', 'Suspendue'],
    default: 'Ouverte',
    required: true,
  },
});

const Offre = mongoose.model('Offre', offreSchema);

export default Offre;
