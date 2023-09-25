import { GetPostDB, LikeDislikeCountDB, PostDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"

    public async getAllPosts(): Promise<GetPostDB[]> {
        const postsDB: GetPostDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                'posts.id',
                'posts.creator_id',
                'posts.content',
                'posts.likes',
                'posts.dislikes',
                'posts.created_at',
                'posts.updated_at',
                'users.name as creator_name' 
            )
            .leftJoin('users', 'posts.creator_id', 'users.id'); // Realiza um LEFT JOIN com a tabela de usuários
    
        return postsDB;
    }
    

    public async getPostById(id: string) {

        const [postDB]: PostDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS).where({ id });

        return postDB;
    }

    public async createPost(id: string, creatorId: string, content: string) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert({
                id,
                creator_id: creatorId,
                content,
                likes: 0,
                dislikes: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
    }
    
    public async updatePostContent(id: string, content: string) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .where({ id })
            .update({ content, updated_at: new Date().toISOString() });
    }
    
    public async deletePost(id: string): Promise<void> {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .where({ id })
            .del();
    }
    
    public async editLikes(postId:string, newLikeDislikeCount:LikeDislikeCountDB):Promise<void>{
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .update(
                {
                    likes: newLikeDislikeCount.newLikeCount,
                    dislikes: newLikeDislikeCount.newDislikeCount
                }
            )
            .where({id: postId})
    }

    
}

