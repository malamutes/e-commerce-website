import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        const { productName, productPrice } = req.body;
        const sql = neon(process.env.DATABASE_URL!);
        const result = await sql`
        INSERT INTO products (product_name, product_price) VALUES (${productName}, ${productPrice});
        `;

        // Respond with the data in JSON format
        res.status(200).json({ message: 'Product updated successfully', result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload product' });
    }
}
