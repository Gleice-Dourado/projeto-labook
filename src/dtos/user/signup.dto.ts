import { z } from "zod"

export interface SignupInputDTO {

    name: string,
    email: string,
    password: string

}

export interface SignupOutputDTO {
    message: string,
    token: string

}

export const SignupSchema = z.object({
    name: z.string({
        required_error: 'Please provide a value for "name".',
        invalid_type_error: '"name" should be a string.'
    }).min(2, '"name" should have at least 2 characters.'),
    email: z.string({
        required_error: 'Please provide an "email" address.',
        invalid_type_error: '"email" should be a string.'
    }).refine(
        value => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value), 
        'Please enter a valid email address.'
    ),
    password: z.string({
        required_error: 'Please choose a "password".',
        invalid_type_error: '"password" should be a string.'
    }).refine(
        value => /^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{6,10}$/g.test(value),
        'Invalid password. It must have 6 to 10 characters, with uppercase and lowercase letters, at least one special character, and at least one digit.'
    )
}).transform(data => data as SignupInputDTO);
