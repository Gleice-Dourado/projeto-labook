import express from 'express'
import { UserController } from '../controller/UserController'
import { UserBusiness } from '../business/UserBusiness';
import { UserDatabase } from '../database/UserDatabase';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/tokenManager';
import { HashManager } from '../services/hashManager';


export const userRouter = express.Router()

//cria instancia
const userController = new UserController(
    new UserBusiness(
        new UserDatabase(),
        new IdGenerator(),
        new TokenManager(),
        new HashManager()
    )
);


//chama a instância COM O METODO
userRouter.get("/", userController.getUsers)
userRouter.post("/signup", userController.Signup)
userRouter.post("/login", userController.Login);


