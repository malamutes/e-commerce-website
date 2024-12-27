// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { productID } = req.query;

    if (!productID) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {

        const sql = neon(process.env.DATABASE_URL!);

        const data = await sql`
        SELECT * FROM products WHERE product_id = ${productID}
        `;

        if (data.length === 0) {
            return res.status(400).json({ error: 'No Item Found' });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
