import express, { Request, Response } from 'express'
import { UserDatabase } from '../database/UserDatabase'
import { PostDatabase } from '../database/PostDatabase'
import { BaseError } from '../errors/BaseError'
import { EditPostInputDTO, EditPostSchema } from '../dtos/post/editPost.dto'
import { PostBusiness } from '../business/PostBusiness'
import { CreatePostSchema } from '../dtos/post/createPost.dto'
import { DeletePostInputDTO, DeletePostSchema } from '../dtos/post/deletePost.dto'
import { TokenManager } from '../services/tokenManager'
import { GetPostSchema } from '../dtos/post/getPost.dto'
import { LikeDislikePostSchema } from '../dtos/post/likeDislikePost.dto'
import { ZodError } from 'zod'

export class PostController {
    constructor(private postBusiness: PostBusiness,
    ) { }

    // Get Post
    public getPost = async (req: Request, res: Response): Promise<void> => {
        try {
            const input = GetPostSchema.parse({
                token: req.headers.authorization || "",
            });

            const output = await this.postBusiness.getPosts(input);

            res.status(200).json(output);
        } catch (error) {
            if (req.statusCode === 200) {
                res.status(500);
            }

            if (error instanceof Error) {
                res.send(error.message);
            } else {
                res.send("Erro inesperado");
            }
        }
    };


    async GetPostById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string

            const postDatabase = new PostDatabase()

            if (id === undefined || id.trim().length < 1) {
                res.status(404).send("O id não foi passado ou é inválido!");
                return;
            }

            const userDB = await postDatabase.getPostById(id);

            if (!userDB) {
                res.status(404).send("Post não encontrado");

            }

            res.status(200).send(userDB)
        } catch (error) {
            if (req.statusCode === 200) {
                res.status(500)
            }

            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }

    }

    public createPost = async (req: Request, res: Response): Promise<void> => {
        try {
            const input = CreatePostSchema.parse({
                content: req.body.content,
                token: req.headers.authorization || "",
            });

            const output = await this.postBusiness.createPost(input);

            res.status(201).json(output);
        } catch (error) {
            if (req.statusCode === 200) {
                res.status(500);
            }

            if (error instanceof Error) {
                res.send(error.message);
            } else {
                res.send("Erro inesperado");
            }
        }
    };

    public deletePost = async (req: Request, res: Response): Promise<void> => {
        try {
            const input = DeletePostSchema.parse({
                id: req.params.id,
                token: req.headers.authorization || "",
            });

            await this.postBusiness.deletePost(input);

            res.status(200).send("Post excluído com sucesso.");
        } catch (error) {
            if (req.statusCode === 200) {
                res.status(500);
            }

            if (error instanceof Error) {
                res.send(error.message);
            } else {
                res.send("Erro inesperado");
            }
        }
    };


    public editPost = async (req: Request, res: Response): Promise<void> => {
        try {
            const input = EditPostSchema.parse({
                id: req.params.id,
                content: req.body.content,
                token: req.headers.authorization || "",
            });
    
            const output = await this.postBusiness.editPost(input);
    
            res.status(200).json(output);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send(error.message);
            } else {
                res.status(500).send("Erro inesperado");
            }
        }
    };

    
    public likeDislikePost = async (req:Request, res:Response) => {
        try {
            const input = LikeDislikePostSchema.parse({
                id: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            });

            await this.postBusiness.likeDislikePost(input);

            res.status(200).send();
        } catch (error) {
            console.log(error)

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            }else if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    }
}