// Separate function to extract JWT token from request headers
const extractToken = (req) => {
    const authorizationHeader = req.header('Authorization');
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      return authorizationHeader.replace('Bearer ', '');
    }
    return null;
  };
  
  module.exports = { extractToken };
  