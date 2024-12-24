// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Connect to your database
        const sql = neon(process.env.DATABASE_URL!);

        // Query to fetch products
        const data = await sql`
        SELECT * FROM products;
        `;

        // Respond with the data in JSON format
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
