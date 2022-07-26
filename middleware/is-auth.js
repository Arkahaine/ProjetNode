import jwt from 'jsonwebtoken';


export const isAuth = (req, res, next) => {
  const authHeader = req.get('Autorisation');
  if (!authHeader) {
    const error = new Error('Non authentifier.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Non authentifier.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
