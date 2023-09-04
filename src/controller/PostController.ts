import express, { Request, Response } from 'express'
import { UserDatabase } from '../database/UserDatabase'
import { PostDatabase } from '../database/PostDatabase'
import { BaseError } from '../errors/BaseError'
import { EditPostInputDTO } from '../dtos/post/editPost.dto'

export class PostController {
    constructor(private postBusiness: PostBusiness) { }

    async GetPosts(req: Request, res: Response): Promise<void> {
        try {

            const postDatabase = new PostDatabase()

            const userDB = await postDatabase.getPosts()

            res.status(200).send(userDB)
        } catch (error) {
            if (req.statusCode === 200) {
                res.status(500)
            }

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }

    }

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

    public editPost = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: EditPostInputDTO = {
                postId: req.params.id,
                content: req.body.content
            };
            const token: string = req.headers.authorization as string;

            await this.postBusiness.editPost(input, token);

            res.status(200).send('Post editado com sucesso');
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    }
}