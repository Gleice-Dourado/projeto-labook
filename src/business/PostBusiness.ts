import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { LikesDislikesDatabase } from "../database/likeDislikesDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/post/createPost.dto";
import { DeletePostInputDTO } from "../dtos/post/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/post/editPost.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../dtos/post/getPost.dto";
import { LikeDislikePostInputDTO, LikeDislikePostSchema } from "../dtos/post/likeDislikePost.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { LikesDislikes } from "../models/LikesDislikes";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/tokenManager";
import { LikeDislikeCountDB, LikesDislikesDB, USER_ROLES } from "../types";

export class PostBusiness {

    constructor(
        private postDatabase: PostDatabase,
        private likesDislikesDatabase: LikesDislikesDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        

    ) { }

    // Get Posts
    public getPosts = async (input: GetPostInputDTO): Promise<GetPostOutputDTO[]> => {
        const { token } = input;

        // Validação de dados de entrada
        if (!token) {
            throw new Error("Token deve ser fornecido.");
        }

        // Verifique o token e obtenha o usuário associado
        const userPayload = this.tokenManager.getPayload(token);
        if (!userPayload) {
            throw new Error("Token inválido ou expirado.");
        }


        const posts = await this.postDatabase.getAllPosts();

        const processedPosts: GetPostOutputDTO[] = posts.map(post => ({
            id: post.id,
            content: post.content,
            likes: post.likes,
            dislikes: post.dislikes,
            createdAt: post.created_at,
            updatedAt: post.updated_at,
            creator: {
                id: post.creator_id,
                name: post.creator_name
            },


        }));


        return processedPosts;
    };



    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {
        const { content, token } = input;

        // Validação de dados de entrada
        if (!content || !token) {
            throw new Error("Todos os dados devem ser preenchidos.");
        }

        // Verifica a autenticação e obtém informações do usuário a partir do token
        const userPayload = this.tokenManager.getPayload(token);
        if (!userPayload) {
            throw new Error("Token inválido ou expirado.");
        }

        // Implemente a lógica para criar um novo post
        const postId = this.idGenerator.generate();
        await this.postDatabase.createPost(postId, userPayload.id, content);

        const output: CreatePostOutputDTO = {
            content,
        };

        return output;
    };


    public editPost = async (input: EditPostInputDTO): Promise<EditPostOutputDTO> => {
        const { id, content, token } = input;

        // Validação de dados de entrada
        if (!id || !content || !token) {
            throw new Error("Todos os dados devem ser preenchidos.");
        }

        // Verifica a autenticação e obtém informações do usuário a partir do token
        const userPayload = this.tokenManager.getPayload(token);
        if (!userPayload) {
            throw new Error("Token inválido ou expirado.");
        }

        // Implemente a lógica para editar o post
        const post = await this.postDatabase.getPostById(id);

        // Verifique se o usuário tem permissão para editar o post
        if (post.creator_id !== userPayload.id) {
            throw new Error("Você não tem permissão para editar este post.");
        }

        // Atualiza o conteúdo do post
        await this.postDatabase.updatePostContent(id, content);

        const output: EditPostOutputDTO = {
            content,
        };

        return output;
    };

    // Delete Post
    public deletePost = async (input: DeletePostInputDTO): Promise<void> => {
        const { id, token } = input;

        // Validação de dados de entrada
        if (!id || !token) {
            throw new Error("Todos os dados devem ser preenchidos.");
        }

        // Verifica a autenticação e obtém informações do usuário a partir do token
        const userPayload = this.tokenManager.getPayload(token);
        if (!userPayload) {
            throw new Error("Token inválido ou expirado.");
        }

        // Implemente a lógica para excluir o post
        const post = await this.postDatabase.getPostById(id);

        // Verifique se o usuário tem permissão para excluir o post
        if (post.creator_id !== userPayload.id && userPayload.role !== USER_ROLES.ADMIN) {
            throw new Error("Você não tem permissão para excluir este post.");
        }

        await this.postDatabase.deletePost(id);
    };



    public likeDislikePost = async (input:LikeDislikePostInputDTO):Promise<void> => {
        const { id, token, like } = input;

        const payload = this.tokenManager.getPayload(token);

        if(!payload){
            throw new BadRequestError('"token" is required.')
        };

        const checkPostId = await this.postDatabase.getPostById(id);

        if(!checkPostId){
            throw new NotFoundError('Post not found.')
        };

        const [checkLikeDislike] = await this.likesDislikesDatabase.getLike(payload.id, id);

        if(!checkLikeDislike){

            console.log('criando a tabela')
            const newLikeDislike: LikesDislikesDB = {
                user_id: payload.id,
                post_id:id,
                like: like? 1 : 0
            };

            await this.likesDislikesDatabase.createPost(newLikeDislike);

            console.log('alterando a contagem')
            const newLikeDislikeCount: LikeDislikeCountDB = {
                newLikeCount: like? checkPostId.likes + 1 : checkPostId.likes,
                newDislikeCount: like? checkPostId.dislikes : checkPostId.dislikes + 1
            };

            await this.postDatabase.editLikes(checkPostId.id, newLikeDislikeCount)

            return
        };

        const likeDislikeDB = new LikesDislikes(
            checkLikeDislike.user_id,
            checkLikeDislike.post_id,
            checkLikeDislike.like
        );

        const postDB = await this.postDatabase.getPostById(likeDislikeDB.getPostId())
        
        if(checkLikeDislike.like === 1 && like){
            
            await this.likesDislikesDatabase.deletePost(likeDislikeDB.getUserId(), likeDislikeDB.getPostId());

            const newLikeDislikeCount: LikeDislikeCountDB = {
                newLikeCount: postDB.likes - 1,
                newDislikeCount: postDB.dislikes
            };

            await this.postDatabase.editLikes(likeDislikeDB.getPostId(), newLikeDislikeCount);

            return
        };

        if(checkLikeDislike.like === 1 && !like){

            await this.likesDislikesDatabase.editPost(likeDislikeDB.getPostId(), 0);

            const newLikeDislikeCount: LikeDislikeCountDB = {
                newLikeCount: postDB.likes - 1,
                newDislikeCount: postDB.dislikes + 1
            };

            await this.postDatabase.editLikes(likeDislikeDB.getPostId(), newLikeDislikeCount);

            return
        };

        if(checkLikeDislike.like === 0 && like){
            
            await this.likesDislikesDatabase.editPost(likeDislikeDB.getPostId(), 1);

            const newLikeDislikeCount: LikeDislikeCountDB = {
                newLikeCount: postDB.likes + 1,
                newDislikeCount: postDB.dislikes - 1
            };

            await this.postDatabase.editLikes(likeDislikeDB.getPostId(), newLikeDislikeCount);

            return

        };

        if(checkLikeDislike.like === 0 && !like){
          
            await this.likesDislikesDatabase.deletePost(likeDislikeDB.getUserId(), likeDislikeDB.getPostId());

            const newLikeDislikeCount: LikeDislikeCountDB = {
                newLikeCount: postDB.likes,
                newDislikeCount: postDB.dislikes - 1
            };

            await this.postDatabase.editLikes(likeDislikeDB.getPostId(), newLikeDislikeCount);

            return
        }
    }
}



