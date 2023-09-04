import { z } from "zod"

export interface DeletePostInputDTO{
    id: string,
    token: string
};

export const DeletePostSchema = z.object({
    id: z.string(
        {
            required_error: '"id" is required',
            invalid_type_error: '"id" must be a string'
        }
    ).min(1),
    token: z.string(
        {
            required_error: '"token" is required.',
            invalid_type_error: '"token" must be a string'
        }
    ).min(1)
}).transform(data => data as DeletePostInputDTO)