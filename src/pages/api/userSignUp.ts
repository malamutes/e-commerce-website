import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const sql = neon(process.env.DATABASE_URL!);

        const checkUser = await sql`SELECT user_email FROM users where user_email LIKE ${req.body.email};`;

        //no entry in db with the same email
        if (checkUser.length !== 0) {
            return res.status(409).json({ message: 'There is an account with an existing email already!' });
        }

        await sql`INSERT INTO users (user_first_name, user_last_name, user_email, user_password) 
        VALUES (${req.body.firstName}, ${req.body.lastName}, ${req.body.email}, ${req.body.password});`;


        res.status(200).json({ message: 'User created successfully!' });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'An unknown error occurred.' });
        }
    }
}
