import express from 'express'
import { PostController } from '../controller/PostController'

export const postRouter = express.Router()

//cria instancia
const postController = new PostController()


//chama a instância COM O METODO
postRouter.get("/", postController.GetPosts)
postRouter.get("/:id", postController.GetPostById)
postRouter.delete('/:id', postController.deletePost);
postRouter.get('/', postController.getPosts);