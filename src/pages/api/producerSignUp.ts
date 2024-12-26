import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';
import { authOptions } from './auth/[...nextauth]';
import { getServerSession } from "next-auth/next"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions)

        if (!session) {
            res.status(401).json({ message: "You must be logged in." })
            return
        }

        console.log(req.body);

        const sql = neon(process.env.DATABASE_URL!);
        //it should always work after registration because the id is fresh and always exists for 
        //future functionality where users can choose to be producers halfway maybe we redirect here? but
        //i might not even add that functionality, if u want to be a producer do it upfront not swapping


        const insertProducer = await sql`
        INSERT INTO producers (user_id, business_name, business_type, business_registration_number, business_location)
        OVERRIDING SYSTEM VALUE
        VALUES (${session.user.user_id}, ${req.body.businessName}, ${req.body.businessType}, ${req.body.businessRegistrationNumber}, ${req.body.businessLocation});
        `;


        const getUserLogin = await sql`SELECT user_email, user_password FROM users 
        WHERE user_id = ${session.user.user_id};`;

        if (getUserLogin.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: 'Producer registered successfully!', data: getUserLogin });

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
