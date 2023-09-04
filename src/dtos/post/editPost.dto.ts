import { z } from "zod";

export interface EditPostInputDTO {
    id: string,
    content: string,
    token: string
};

export interface EditPostOutputDTO {
    content: string
};

export const EditPostSchema = z.object({
    id: z.string(
        {
            required_error: '"id" is required.',
            invalid_type_error: '"id" must be a string'
        }
    ).min(1),
    content: z.string(
        {
            required_error: '"content" is required.',
            invalid_type_error: '"content" must be a string'
        }
    ).min(1),
    token: z.string(
        {
            required_error: '"token" is required.',
            invalid_type_error: '"token" must be a string'
        }
    ).min(1)
}).transform(data => data as EditPostInputDTO);
