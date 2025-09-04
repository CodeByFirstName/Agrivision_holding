// models/Test.js
import mongoose from 'mongoose';

// Schéma pour une question du test
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    }
  ],
  bonneReponse: {
    type: String,
    required: true,
  }
});

const testSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [questionSchema], // tableau de questions
  duree: {
    type: Number,
    required: true, // en minutes
  },
  scoreMinimum: {
    type: Number,
    default: 0, // score à atteindre pour réussir
  },
  offreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offre',
    required: false, // on pourra aussi créer un test indépendant
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
  dateMiseAJour: {
    type: Date,
    default: Date.now,
  }
});

const Test = mongoose.model('Test', testSchema);

export default Test;
