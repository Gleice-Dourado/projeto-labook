import { z } from "zod";

export interface CreatePostInputDTO {
    content: string,
    token: string
};

export interface CreatePostOutputDTO {
    content: string
};

export const CreatePostSchema = z.object({
    content: z.string(
        {
            required_error: 'Please provide content for your post.',
            invalid_type_error: '"Content" should be a text.'
        }
    ).min(
        1,
        '"Content" should have at least one character.'
    ),
    token: z.string().min(1)
}).transform(data => data as CreatePostInputDTO);
