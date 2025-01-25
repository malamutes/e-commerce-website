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

                //REFRESH MATERIALIZED VIEW most_popular_products; 
                //need to call this somewhere prolly as a cron job to refresh
                const data = await sql`
                SELECT * FROM most_popular_products;
                `;

                if (data.length === 0) {
                    return res.status(400).json({ error: 'No Items Found' });
                }

                const dataE = data.filter(item => item.category_query === 'Exclusive_Category');
                const dataBS = data.filter(item => item.category_query === 'Best_Sellers_Category');
                const dataS = data.filter(item => item.category_query === 'Sale_Category');
                const dataNA = data.filter(item => item.category_query === 'New_Arrivals_Category');
                const dataC = data.filter(item => item.category_query === 'Clothing_Category');
                const dataP = data.filter(item => item.category_query === 'Producer_Category');

                res.status(200).json({
                    'Exclusive': dataE,
                    'Best_Sellers': dataBS,
                    'Sale': dataS,
                    'New_Arrivals': dataNA,
                    'Clothing': dataC,
                    'Producer': dataP,
                });
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
