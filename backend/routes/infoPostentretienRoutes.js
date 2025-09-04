import express from 'express';
import { saveInfoPostEntretien, getInfoPostEntretien, getAllInfosPostEntretien, deleteInfoPostEntretien } from '../controllers/infoPostEntretienController.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]), saveInfoPostEntretien);

router.get('/:userId', getInfoPostEntretien);
router.get('/', getAllInfosPostEntretien);
router.delete('/:userId', deleteInfoPostEntretien);

export default router;
