const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp"); //ONDE A IMAGEM CHEGA
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads"); //ONDE A IMAGEM DE FATO VAI FICAR

const MULTER = {
  //multer biblioteca para fazer UPLOADS(duas propriedades : (storage/ filename)- onde vai mandar o arquivo quando carregar a aplicação)
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(req, file, cb) {
      const fileHash = crypto.randomBytes(10).toString("hex"); // gera um hash aleatório pra combinar com a imagem garantindo que o usuário não tenha imagens duplicadas,pra uma imagem não sobrepor a outra
      const fileName = `${fileHash}-${file.originalname}`;

      return cb(null, fileName);
    },
  }),
};

module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
};
