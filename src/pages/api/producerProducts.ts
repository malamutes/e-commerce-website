import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client
import { getServerSession } from "next-auth/next"
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions)

        if (!session) {
            res.status(401).json({ message: "You must be logged in." })
            return
        }

        // Connect to your database
        const sql = neon(process.env.DATABASE_URL!);

        // Query to fetch products
        const data = await sql`
            SELECT 
                product_id,
                product_name, 
                product_price, 
                product_type, 
                product_audience, 
                product_description, 
                product_colour, 
                product_details
            FROM products
            WHERE 
            product_producer = ${session.user.business?.businessName}`;

        //prolly need to do if no items then send back you have no products or something

        // Respond with the data in JSON format
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
