export interface UserDB {
    id: string,
    name:string,
    email:string,
    password:string,
    role:string,
    created_at:string
     
}

export interface PostDB {
    id:string,
    creator_id:string,
    content:string,
    likes:number,
    dislikes:number,
    created_at:string,
    updated_at:string
}

export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}

export interface TokenPayload {
    id: string,
    name: string,
    role: USER_ROLES
}