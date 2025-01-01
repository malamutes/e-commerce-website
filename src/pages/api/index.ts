// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client
import { getServerSession } from "next-auth/next"
import { AuthOptions } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            try {

                const sql = neon(process.env.DATABASE_URL!);

                const dataNA = await sql`
                SELECT product_id, product_name, product_images, product_producer, product_price, product_sales_category
                FROM products ORDER BY product_created_at DESC LIMIT 10;
                `;


                //prolly get the most popular brands and need to do error parsing properly eventually
                const dataB = await sql`
                SELECT DISTINCT(product_producer) FROM products;
                `
                const dataC = await sql`
                SELECT DISTINCT(product_type) FROM products;
                `

                const dataE = await sql`
                     SELECT product_id, product_name, product_images, product_producer, product_price, product_sales_category
                FROM products WHERE product_sales_category @> '["Exclusive"]'LIMIT 10;
                `

                const dataS = await sql`
                SELECT product_id, product_name, product_images, product_producer, product_price, product_sales_category
           FROM products WHERE product_sales_category @> '["Sale"]'LIMIT 10;
           `


                const dataBS = await sql`
                SELECT product_id, product_name, product_images, product_producer, product_price, product_sales_category
           FROM products WHERE product_sales_category @> '["Best Sellers"]'LIMIT 10;
           `

                if (dataNA.length === 0) {
                    return res.status(400).json({ error: 'No Items Found' });
                }

                if (dataB.length === 0) {
                    return res.status(400).json({ error: 'No Items Found' });
                }

                if (dataC.length === 0) {
                    return res.status(400).json({ error: 'No Items Found' });
                }

                if (dataE.length === 0) {
                    return res.status(400).json({ error: 'No Items Found' });
                }

                if (dataBS.length === 0) {
                    return res.status(400).json({ error: 'No Items Found' });
                }


                if (dataS.length === 0) {
                    return res.status(400).json({ error: 'No Items Found' });
                }

                res.status(200).json([dataNA, dataB, dataE, dataBS, dataS, dataC]);
            } catch (error) {
                console.error("Error details:", error);

                // If the error is an instance of Error, you can access the message and stack
                if (error instanceof Error) {
                    res.status(1000).json({
                        error: 'Failed to fetch data',
                        message: error.message,
                        stack: error.stack,  // Stack trace will give you more details on where the error happened
                    });
                } else {
                    // If the error is not an instance of Error, just log it as a generic object
                    res.status(1000).json({
                        error: 'Failed to fetch data',
                        details: JSON.stringify(error),
                    });
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
