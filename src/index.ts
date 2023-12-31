import express, { Request, Response } from 'express'
import cors from 'cors'
import { PostController } from './controller/PostController'
import { postRouter } from './router/postRouter'
import { userRouter } from './router/userRouter'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT) || 3003, () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT) || 3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//chama a instância COM O METODO
app.use("/posts", postRouter)
app.use("/users", userRouter )

