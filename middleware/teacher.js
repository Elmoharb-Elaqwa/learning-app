export const teacher = (req, res, next) => {
  if (!req.user.isTeacher) {
    res.status(403).send('you are not teacher');
  }
  next();
};
