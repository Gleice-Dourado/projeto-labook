import express, { Request, Response } from 'express'
import { User } from '../models/User'
import { UserBusiness } from '../business/UserBusiness'
import { BaseError } from '../errors/BaseError';
import { SignupSchema } from '../dtos/user/signup.dto';
import { GetUsersInputDTO, GetUsersOutputDTO } from '../dtos/user/getUsers.dto';


export class UserController {

    constructor(
        private userBusiness: UserBusiness
    ) { }

    // async getUsers(req: Request, res: Response): Promise<void> {

    //     try {
    //         const q = req.query.q as string;


    //         const result = await this.userBusiness.getUsers(q);

    //         res.status(200).send(result);
    //     } catch (error) {
    //         console.log(error)

    //         if (res.statusCode === 200) {
    //             res.status(500)
    //         }

    //         if (error instanceof Error) {
    //             res.send(error.message)
    //         } else {
    //             res.send("Erro inesperado")
    //         }
    //     }
    // }
    public getUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const { q } = req.query;
            const token: string = req.headers.authorization as string;

            const input: GetUsersInputDTO = {
                q: q as string,
                token: token
            };

            const output = await this.userBusiness.getUsers(input);

            const response: GetUsersOutputDTO[] = output.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }));

            res.status(200).send(response);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    }


    public Signup = async (req: Request, res: Response): Promise<void> => {
        try {

            const input = SignupSchema.parse({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })


            const output = await this.userBusiness.signup(input);

            res.status(201).send(output)

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

    public Login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            const output = await this.userBusiness.login(email, password);

            res.status(200).send(output);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    }






}