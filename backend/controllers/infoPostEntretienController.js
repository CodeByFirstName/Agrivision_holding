// backend/controllers/infoPostEntretien.js
import InfoPostEntretien from "../models/infoPostEntretien.js";

// 🔹 Fonction utilitaire pour JSON.parse sûr
const safeParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    console.warn("JSON invalide, retour d'un tableau vide :", str);
    return [];
  }
};

// 🔹 Créer ou mettre à jour les infos post-entretien
export const saveInfoPostEntretien = async (req, res) => {
  try {
    console.log("=== [saveInfoPostEntretien] Début ===");
    console.log("req.body :", req.body);
    console.log("req.files :", req.files);

    const {
      userId,
      contactsUrgence,
      references,
      consentement,
      adresse,
      telephone,
    } = req.body;

    if (!userId) {
      console.warn("userId manquant !");
      return res.status(400).json({ message: "userId est requis" });
    }

    // Récupération fichiers uploadés
    const photo = req.files?.photo?.[0]?.path || null;
    const signature = req.files?.signature?.[0]?.path || null;
    console.log("photo :", photo);
    console.log("signature :", signature);

    // Vérifier si l'utilisateur a déjà des infos
    let info = await InfoPostEntretien.findOne({ userId });

    if (info) {
      console.log("➡ Mise à jour des infos existantes...");

      info.photo = photo || info.photo;
      info.signature = signature || info.signature;
      info.contactsUrgence = contactsUrgence ? safeParse(contactsUrgence) : info.contactsUrgence;
      info.references = references ? safeParse(references) : info.references;
      info.consentement = consentement !== undefined ? (consentement === 'true' || consentement === true) : info.consentement;
      info.adresse = adresse || info.adresse;
      info.telephone = telephone || info.telephone;

      await info.save();
      console.log("✅ Infos mises à jour avec succès");
      return res.status(200).json({ message: "Infos mises à jour avec succès ✅", data: info });
    }

    console.log("➡ Création d'un nouvel enregistrement...");

    const newInfo = new InfoPostEntretien({
      userId,
      photo,
      signature,
      contactsUrgence: contactsUrgence ? safeParse(contactsUrgence) : [],
      references: references ? safeParse(references) : [],
      consentement: consentement === 'true' || consentement === true,
      adresse: adresse || "",
      telephone: telephone || "",
    });

    await newInfo.save();
    console.log("✅ Infos créées avec succès");
    return res.status(201).json({ message: "Infos enregistrées avec succès ✅", data: newInfo });

  } catch (error) {
    console.error("❌ Erreur saveInfoPostEntretien :", error);
    res.status(500).json({
      message: "Erreur serveur ❌",
      error: error.message,
      stack: error.stack,
    });
  }
};

// 🔹 Récupérer les infos post-entretien d’un candidat
export const getInfoPostEntretien = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`=== [getInfoPostEntretien] userId=${userId} ===`);

    const info = await InfoPostEntretien.findOne({ userId })
      .populate("userId", "nom prenoms email telephone");

    if (!info) {
      console.warn("Aucune info trouvée pour ce candidat");
      return res.status(404).json({ message: "Aucune info trouvée pour ce candidat" });
    }

    return res.status(200).json(info);
  } catch (error) {
    console.error("❌ Erreur getInfoPostEntretien :", error);
    res.status(500).json({ message: "Erreur serveur ❌", error: error.message });
  }
};

// 🔹 Récupérer toutes les infos post-entretien (ADMIN)
export const getAllInfosPostEntretien = async (req, res) => {
  try {
    console.log("=== [getAllInfosPostEntretien] ===");
    const infos = await InfoPostEntretien.find()
      .populate("userId", "nom prenoms email telephone");

    return res.status(200).json(infos);
  } catch (error) {
    console.error("❌ Erreur getAllInfosPostEntretien :", error);
    res.status(500).json({ message: "Erreur serveur ❌", error: error.message });
  }
};

// 🔹 Supprimer (optionnel, côté admin)
export const deleteInfoPostEntretien = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`=== [deleteInfoPostEntretien] userId=${userId} ===`);

    const deleted = await InfoPostEntretien.findOneAndDelete({ userId });

    if (!deleted) {
      console.warn("Infos inexistantes pour ce candidat");
      return res.status(404).json({ message: "Infos inexistantes pour ce candidat" });
    }

    console.log("✅ Infos supprimées avec succès");
    return res.status(200).json({ message: "Infos supprimées avec succès ✅" });
  } catch (error) {
    console.error("❌ Erreur deleteInfoPostEntretien :", error);
    res.status(500).json({ message: "Erreur serveur ❌", error: error.message });
  }
};
