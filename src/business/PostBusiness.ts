import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreatePostInputDTO } from "../dtos/post/createPost.dto";
import { EditPostInputDTO } from "../dtos/post/editPost.dto";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/hashManager";
import { TokenManager } from "../services/tokenManager";

export class UserBusiness {

    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ){}

    public createPost = async (input: CreatePostInputDTO, token: string): Promise<void> => {
        const userId = this.tokenManager.verifyToken(token).id; // Obtém o ID do usuário do token

        const postId = this.idGenerator.generate();

        const newPost = new Post(postId, userId, input.content, 0, 0, new Date().toISOString(), new Date().toISOString());

        await this.postDatabase.insertPost(newPost);
    }

    public editPost = async (input: EditPostInputDTO, token: string): Promise<void> => {
        const userId = this.tokenManager.verifyToken(token).id;

        const post = await this.postDatabase.findPostById(input.postId);

        if (!post) {
            throw new Error('Post não encontrado');
        }

        if (post.creatorId !== userId) {
            throw new Error('Você não tem permissão para editar este post');
        }

        post.content = input.content;
        post.updatedAt = new Date().toISOString();

        await this.postDatabase.updatePost(post);
    }

    public deletePost = async (postId: string, token: string): Promise<void> => {
        const userId = this.tokenManager.verifyToken(token).id;

        const post = await this.postDatabase.findPostById(postId);

        if (!post) {
            throw new Error('Post não encontrado');
        }

        if (post.creatorId !== userId) {
            throw new Error('Você não tem permissão para deletar este post');
        }

        await this.postDatabase.deletePost(postId);
    }

    public getPosts = async (): Promise<Post[]> => {
        const posts = await this.postDatabase.getAllPosts();
        return posts;
    }
}
    
}