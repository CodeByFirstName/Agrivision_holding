const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  // Optionnel : si l’admin doit être lié à un User, cela sera possible
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },

  // Informations spécifiques pour l’admin (exemple)
  department: { type: String, default: 'Administration' },
  // D'autres champs optionnels selon les besoins métier
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);
