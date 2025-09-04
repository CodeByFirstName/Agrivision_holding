import mongoose from "mongoose";

const ContactUrgenceSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  relation: String,
  telephone: String,
});

const ReferenceSchema = new mongoose.Schema({
  nom: String,
  poste: String,
  contact: String,
});

const InfoPostEntretienSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  photo: { type: String }, // URL Cloudinary
  signature: { type: String }, // base64 ou URL image
  contactsUrgence: [ContactUrgenceSchema],
  references: [ReferenceSchema],
  consentement: { type: Boolean, default: false },
  adresse: { type: String },
  dateSoumission: { type: Date, default: Date.now },
});

export default mongoose.model("InfoPostEntretien", InfoPostEntretienSchema);
