import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Vérifie que le token est présent
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    console.log('verifyToken called, Authorization:', req.headers.authorization);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded doit contenir l'id (selon ta génération de token : decoded.id ou decoded.iat etc.)
    req.userId = decoded.id || decoded._id || decoded.i; // essayer plusieurs clés au cas où
    req.userRole = decoded.role;
    // si tu veux attacher l'objet user minimal :
    req.user = { id: req.userId, role: decoded.role };

    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide.' });
  }
};
