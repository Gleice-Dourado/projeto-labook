export class Post {
    constructor(
        private id: string,
        private creator_id: string,
        private content:  string,
        private likes: string,
        private dislikes: string,
        private created_at: string,
        private update_at: string,
    ){}

    public getId(): string {
        return this.id
    }
    

    public getCreator_id(): string {
        return this.creator_id
    }

    public setCreator_id(value: string): void {
        this.creator_id = value
    }

    public getContent(): string {
        return this.content
    }

    public setContent(value: string): void {
        this.content = value
    }

    public getLikes(): string {
        return this.likes
    }

    public setLikes(value: string): void {
        this.likes = value
    }

    public getDislikes(): string {
        return this.dislikes
    }
    
    public setDislikes(value: string): void {
        this.dislikes = value
    }
    public getCreatedAt(): string {
        return this.created_at
    }

    public setCreatedAt(value: string): void {
        this.created_at = value
    }

    public getUpdateAt(): string {
        return this.update_at
    }

    public setUpdateAt(value: string): void {
        this.update_at = value
    }
}