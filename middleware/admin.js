import jwt from 'jsonwebtoken';

export const admin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).send('you are not admin');
  }
  next();
};
