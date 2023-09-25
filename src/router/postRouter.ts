import express from 'express'
import { PostController } from '../controller/PostController'
import { PostBusiness } from '../business/PostBusiness';
import { PostDatabase } from '../database/PostDatabase';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/tokenManager';
import { LikesDislikesDatabase } from '../database/likeDislikesDatabase';

export const postRouter = express.Router()

//cria instancia
const postController = new PostController
    (
        new PostBusiness(
            new PostDatabase(),
            new LikesDislikesDatabase(),
            new IdGenerator(),
            new TokenManager(),
            )
    );




postRouter.post("/", postController.createPost)
postRouter.get("/", postController.getPost)
postRouter.get("/:id", postController.GetPostById);
postRouter.put('/:id', postController.editPost);
postRouter.delete('/:id', postController.deletePost);
postRouter.put('/:id/like', postController.likeDislikePost)
