const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");

class UsersController {
  /** PADRÃO DO CONTROLLER
   * index-   GET para listar vários registros
   * show -   GET para exibir um registro específico
   * create - POST para criar um registro
   * update - PUT para atualizar um registro
   * delete - DELETE para remover um registro
   */

  async create(req, res) {
    const { name, email, password } = req.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email= (?)",
      [email]
    );

    //checando  o erro(email já existente)
    if (checkUserExists) {
      throw new AppError("Esse email já está em uso");
    }

    //Criando criptografia
    const hashedPassword = await hash(password, 8); // hash recebe 2 parâmetros : senha e o salt(fator complexidade do hash)

    //Inserindo registro
    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const user_id = req.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id=(?)", [user_id]);

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }
    const userWithUpdateEmail = await database.get(
      "SELECT * FROM users WHERE email= (?)", [email]);

    if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
      throw new AppError("Este email já está em uso");
    }

      //fAZENDO A VERIFIÇÃO do nome e email se caso não forem informados (NULLISH OPERATOR) 
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir a nova"
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("Senha antiga não confere");
      }

      user.password = await hash(password, 8);

      await database.run(
        `
    UPDATE users SET
     name = ?,
     email = ?,
     password = ?,
     updated_at = DATETIME('now') 
     WHERE id = ?`,
        [user.name, user.email, user.password, user_id]
      );

      return res.json();
    }
  }
}

module.exports = UsersController;
