import { Request, Response } from "express"
import { BadRequestError } from "../errors/BadRequestError"
import { UserDatabase } from "../database/UserDatabase"
import { User } from "../models/User"
import { TokenPayload, USER_ROLES, UserDB } from "../types"
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from "../errors/NotFoundError"
import { SignupInputDTO, SignupOutputDTO } from "../dtos/user/signup.dto"
import { IdGenerator } from "../services/IdGenerator"
import { GetUsersInputDTO, GetUsersOutputDTO } from "../dtos/user/getUsers.dto"
import { TokenManager } from "../services/tokenManager"
import { HashManager } from "../services/hashManager"
import { LoginOutputDTO } from "../dtos/user/login.dto"

export class UserBusiness {

    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) { }


    public getUsers = async (input: GetUsersInputDTO): Promise<GetUsersOutputDTO[]> => {
        const { q, token } = input;

        const payload = this.tokenManager.getPayload(token);

        if (!payload) {
            throw new BadRequestError('"token" is required.');
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            throw new BadRequestError('Only ADMIN users can search for users.');
        }

        const usersDB = await this.userDatabase.findUsers(q);

        const users: GetUsersOutputDTO[] = usersDB.map((userDB) => ({
            id: userDB.id,
            name: userDB.name,
            email: userDB.email,
            role: userDB.role,
            createdAt: userDB.created_at
        }));

        return users;
    }

    public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {

        const { name, email, password } = input

        const id = this.idGenerator.generate()

        if (!name || !email || !password) {
            throw new Error("Todos os dados devem ser preenchidos.")
        }

        const userDBExists = await this.userDatabase.findUserById(id)

        if (userDBExists) {
            throw new Error("'id' já existe")
        }

        const hashedPassword = await this.hashManager.hash(password)

        const newUser = new User(
            id,
            name,
            email,
            hashedPassword,
            USER_ROLES.NORMAL,
            new Date().toISOString()
        ) // yyyy-mm-ddThh:mm:sssZ

        const newUserDB: UserDB = {
            id: newUser.getId(),
            name: newUser.getName(),
            email: newUser.getEmail(),
            password: newUser.getPassword(),
            role: USER_ROLES.NORMAL,
            created_at: newUser.getCreatedAt()
        }

        await this.userDatabase.insertUser(newUserDB)

        const tokenPayload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: USER_ROLES.NORMAL
        }

        const token = this.tokenManager.createToken(tokenPayload)

        const output: SignupOutputDTO = {
            message: "User registered",
            token: token
        }

        return output

    }

    public editUser = async (input: any): Promise<any> => {
        const { id, name, email, password, role } = input;


        if (id[0] !== 'u') {
            throw new BadRequestError('"id" must start with the letter "u".')
        };

        if (name) {
            if (typeof name !== 'string' || name.length < 0 || name === " ") {
                throw new BadRequestError('"name" must be a string.')
            };
        };

        if (email) {
            if (!email.match("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$")) {
                throw new BadRequestError('Email invalid. Try again.')
            }
        };

        if (password) {
            if (!password.match(/^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{6,10}$/g)) {
                throw new BadRequestError('Password invalid. It must have from six to ten characters, with uppercase and lowercase letters and one special character. Try again.')
            }
        };



        const checkUserId = await this.userDatabase.findUserById(id);
        const checkUserEmail = await this.userDatabase.findEmail(email);

        if (!checkUserId) {
            throw new NotFoundError('The "id" is not registered.')
        };
        console.log(checkUserId)
        if (email) {
            if (checkUserId.email !== checkUserEmail.email) {
                throw new BadRequestError('The email is already registered.')
            }
        };

        const editedUser: User = new User(
            id,
            name || checkUserId.name,
            email || checkUserId.email,
            password || checkUserId.password,
            role || checkUserId.role as USER_ROLES,
            checkUserId.created_at
        );

        const userToDB = {
            id: editedUser.getId(),
            name: editedUser.getName(),
            email: editedUser.getEmail(),
            password: editedUser.getPassword(),
            user_role: editedUser.getRole(),
            created_at: editedUser.getCreatedAt()
        };

        // await userDatase.editUser(userToDB);

        const output = {
            message: 'User info updated',
            user: {
                id: userToDB.id,
                name: userToDB.name,
                email: userToDB.email,
                role: userToDB.user_role,
                createdAt: userToDB.created_at
            }
        };

        return output
    };

 
    public login = async (email: string, password: string): Promise<LoginOutputDTO> => {
        const userDB = await this.userDatabase.findEmail(email);

        if (!userDB) {
            throw new Error('Usuário não encontrado');
        }

        const passwordMatches = await this.hashManager.compare(password, userDB.password);

        if (!passwordMatches) {
            throw new Error('Senha incorreta');
        }

        let userRole = USER_ROLES.NORMAL;

        if (userDB.role === USER_ROLES.ADMIN) {
            userRole = USER_ROLES.ADMIN;
        }

        const tokenPayload: TokenPayload = {
            id: userDB.id,
            name: userDB.name,
            role: userRole
        };

        const token = this.tokenManager.createToken(tokenPayload);

        const output: LoginOutputDTO = {
            message: 'Login successful',
            token: token
        };

        return output;
    }

}
