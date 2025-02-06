// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            try {
                const sql = neon(process.env.DATABASE_URL!);

                // Query to fetch products
                const data = await sql`SELECT DISTINCT(product_producer) FROM products;`;

                if (data.length !== 0) {
                    return res.status(200).json(data);
                }

                return res.status(404).json({ message: 'Could not retrieve all brands!' })


            } catch (error) {
                // Enhance error response
                const errorDetails = error instanceof Error
                    ? {
                        name: error.name,
                        message: error.message,
                        stack: error.stack,
                    }
                    : { message: 'Unknown error occurred' };

                res.status(500).json({
                    error: 'Failed to fetch data',
                    details: errorDetails,
                });
            }
            break
        }
        case 'POST': {
            //todo
        }
        default: {
            //TODO
        }
    }
}
