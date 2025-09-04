import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Stockage Cloudinary avec debug
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log('--- MULTER STORAGE ---');
    console.log('Fichier reçu :', file.originalname);
    console.log('Type MIME :', file.mimetype);

    // Choix du dossier selon type
    const folder = file.mimetype.startsWith('image/') ? 'agrivision/images' : 'agrivision/cvs';
    
    return {
      folder,
      format: file.mimetype === 'application/pdf' ? 'pdf' : undefined,
      resource_type: 'auto',          // PDF ou images
      allowed_formats: ['jpg','jpeg','png','pdf'],
      access_mode: 'public',
    };
  },
});

// Middleware Multer
export const upload = multer({ storage });

export { cloudinary, storage };
