import { PostDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"

    public async getPosts() {

        const postsDB: PostDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS);

        return postsDB;
    }

    public async getPostById(id: string) {

        const [postDB]: PostDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS).where({ id });

        return postDB;
    }



    
}

