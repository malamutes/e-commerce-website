// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client
import { getServerSession } from "next-auth/next"
import { AuthOptions } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            console.log(req.query);
            //prolly need to handle cases where category dont exist but that can come later
            if (req.query.page && req.query.category) {
                if (req.query.page === 'CollectionCategory') {
                    try {

                        const sql = neon(process.env.DATABASE_URL!);

                        const data = await sql`
                            SELECT product_name, product_price FROM products 
                            WHERE product_type = ${req.query.category}
                            `;

                        if (data.length === 0) {
                            return res.status(400).json({ error: 'No Items Found' });
                        }

                        res.status(200).json(data);
                    } catch (error) {
                        res.status(500).json({ error: 'Failed to fetch data' });
                    }
                }

                else if (req.query.page === 'some other page') {

                }

                else if (req.query.page === 'some other page') {

                }

                else {

                }
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
