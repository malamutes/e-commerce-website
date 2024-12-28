// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client
import { getServerSession } from "next-auth/next"
import { AuthOptions } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            console.log(req.query);
            if (req.query) {
                try {

                    //sex filter array will either be empty array or filled array
                    let sexArray: string[] = [];

                    let sexQuery = "";

                    if (req.query.sex) {
                        sexArray = Array.isArray(req.query.sex) ? req.query.sex : [req.query.sex];
                    }
                    const sql = neon(process.env.DATABASE_URL!);

                    const baseQuery = `SELECT product_name, product_price, product_audience, product_producer FROM products 
                        WHERE product_type = '${req.query.CollectionCategory}'`

                    if (sexArray.length > 0) {
                        sexQuery = ` AND (product_audience = '${sexArray.join("' OR product_audience = '")}')`;
                    }

                    console.log(baseQuery + sexQuery);
                    const data = await sql(baseQuery + sexQuery);

                    res.status(200).json(data);

                    if (data.length === 0) {
                        return res.status(400).json({ error: 'No Items Found' });
                    }

                    res.status(200).json(data);
                } catch (error) {
                    res.status(500).json({ error: 'Failed to fetch data', message: (error as Error).message });
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
