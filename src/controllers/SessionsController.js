 /** PADRÃO DO CONTROLLER
  * 
   * index-   GET para listar vários registros
   * show -   GET para exibir um registro específico
   * create - POST para criar um registro
   * update - PUT para atualizar um registro
   * delete - DELETE para remover um registro
   * 
   */

const  knex = require('../database/knex')
const  AppError = require('../utils/AppError')
const { compare } = require('bcryptjs')
const authConfig = require('../configs/auth')
const { sign } = require('jsonwebtoken')

class SessionsController{
    async create(req,res){
        const { email, password } = req.body;
        const user = await knex('users').where({ email }).first();//Busca usuário por e-mail
        
        if(!user){
          throw new AppError('E-mail e/ou senha incorretos!',401)
        }

        const passwordMatched = await compare(password, user.password)//Compara a senha digitada pelo usuário com a senha cadastrada no banco de dados

        if(!passwordMatched){
          throw new AppError('E-mail e/ou senha incorretos!', 401)
        }

       const { secret , expiresIn} = authConfig.jwt
       const token = sign({}, secret,{
        subject: String(user.id),
        expiresIn
      
      })

        return res.json({user, token})
    }
}

module.exports = SessionsController;
