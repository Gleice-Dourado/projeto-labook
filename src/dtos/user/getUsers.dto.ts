import { z } from "zod";

export interface GetUsersInputDTO {
    q?: string,
    token: string
};

export interface GetUsersOutputDTO {
    id: string,
    name: string,
    email: string,
    role: string,
    createdAt: string
};

export const GetUsersSchema = z.object({
    q: z.string({
        invalid_type_error: '"q" should be a text.',
    }).min(1, '"q" should have at least one character.').optional(),
    token: z.string({
        invalid_type_error: "The token should be a text.",
        required_error: "A token is required."
    }).min(1, 'Invalid token')
}).transform(data => data as GetUsersInputDTO);
