import { z } from "zod";

export interface LoginInputDTO {
    email: string,
    password: string
};

export interface LoginOutputDTO {
    message: string,
    token: string
};

export const LoginSchema = z.object({
    email: z.string(
        {
            required_error: 'Please provide your "email" address.',
            invalid_type_error: '"email" should be a text.'
        }
    ).refine(
        value => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value),
        'The provided "email" is not valid.'
    ),
    password: z.string(
        {
            required_error: 'Please enter your "password".',
            invalid_type_error: '"password" should be a text.'
        }
    )
}).transform(data => data as LoginInputDTO);
