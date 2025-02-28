// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            try {
                if (req.query.searchBarQuery) {
                    console.log("REQ.QUEY.SEARCHBARQUERY FROM BACKEND", req.query.searchBarQuery)
                }
                const sql = neon(process.env.DATABASE_URL!);

                const queryData = await sql`
                    SELECT product_name, product_id, product_images, product_sales_category, product_price, product_producer, product_type
                    FROM products 
                    WHERE product_name ILIKE ${`%${req.query.searchBarQuery}%`} 
                    OR product_producer ILIKE ${`%${req.query.searchBarQuery}%`} LIMIT 5;
                `
                const totalCountQuery = await sql`
                    SELECT COUNT(*)
                    FROM products 
                    WHERE product_name ILIKE ${`%${req.query.searchBarQuery}%`} 
                    OR product_producer ILIKE ${`%${req.query.searchBarQuery}%`};
                `

                const totalCount = totalCountQuery[0]?.count || 0;
                console.log("SEARCH BAR QUERY OUTPUT", queryData, totalCount)
                res.status(200).json({ queryData, totalCount, });

            } catch (error) {
                console.error("Error details:", error);

                // If the error is an instance of Error, you can access the message and stack
                if (error instanceof Error) {
                    res.status(500).json({
                        error: 'Failed to fetch data',
                        message: error.message,
                        stack: error.stack,  // Stack trace will give you more details on where the error happened
                    });
                } else {
                    // If the error is not an instance of Error, just log it as a generic object
                    res.status(500).json({
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
