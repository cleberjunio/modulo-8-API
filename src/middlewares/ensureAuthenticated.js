const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization; //token do usuário encontra-se dentro cabeçalho e dentro de authorization

  if (!authHeader) {
    throw new AppError("JWT token não informado", 401);
  }

  const [, token] = authHeader.split(" "); //split quebra um texto em string e coloca o espaço no lugar do bearer, no caso só importa o token,(bearer,xxxxxx)
  
  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret); //verifica se é um token jwt válido
    
    req.user = {
      id: Number(user_id)
    };
   
    return next();
  } catch {
    throw new AppError("JWT token inválido", 401);
  }
}

module.exports = ensureAuthenticated;
