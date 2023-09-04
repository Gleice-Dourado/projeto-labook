import { z } from "zod"

export interface LikeDislikePostInputDTO{
    id: string,
    token: string,
    like: boolean
};

export const LikeDislikePostSchema = z.object({
    id: z.string(
        {
            invalid_type_error: '"id" must be a string',
            required_error: '"id" is required'
        }
    ),
    token: z.string(
        {
            invalid_type_error: '"token" must be a string',
            required_error: '"token" is required'
        }
    ).min(1),
    like: z.boolean(
        {
            invalid_type_error: '"like" must be true or false',
            required_error: '"like" is required'
        }
    )
}).transform(data => data as LikeDislikePostInputDTO)