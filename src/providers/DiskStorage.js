const fs = require ("fs");
const path = require ("path");
const uploadConfig = require ("../configs/upload")

class DiskStorage {
  async saveFile(file){
    await fs.promises.rename(//rename para renomear um arquivo/mover.
      path.resolve(uploadConfig.TMP_FOLDER, file),//Quando a imagem chega no banco ela vai pra pasta temporária 
      path.resolve(uploadConfig.UPLOADS_FOLDER, file)
    );

    return file;
  }
    async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    try{
      await fs.promises.stat(filePath);//verifica o estado do arquivo(se está aberto ou corrompido)
    }catch{
      return;
    }
    
    await fs.promises.unlink(filePath);
    }
}

module.exports = DiskStorage;