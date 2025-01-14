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

                const data = await sql`
                WITH Exclusive_Category AS (
                    SELECT product_id, 
                        product_name, 
                        product_images, 
                        product_producer, 
                        product_price, 
                        product_sales_category,
                        'Exclusive_Category' AS category_query
                    FROM products
                    WHERE product_sales_category @> '["Exclusive"]'
                    LIMIT 10
                ),
                Sale_Category AS (
                    SELECT product_id, 
                        product_name, 
                        product_images, 
                        product_producer, 
                        product_price, 
                        product_sales_category,
                        'Sale_Category' AS category_query
                    FROM products
                    WHERE product_sales_category @> '["Sale"]'
                    LIMIT 10
                ),
                Best_Sellers_Category AS (
                    SELECT product_id, 
                        product_name, 
                        product_images, 
                        product_producer, 
                        product_price, 
                        product_sales_category,
                        'Best_Sellers_Category' AS category_query
                    FROM products
                    WHERE product_sales_category @> '["Best Sellers"]'
                    LIMIT 10
                ),
                New_Arrivals_Category AS (
                    SELECT product_id, 
                        product_name, 
                        product_images, 
                        product_producer, 
                        product_price, 
                        product_sales_category,
                        'New_Arrivals_Category' AS category_query
                    FROM products
                    ORDER BY product_created_at DESC 
                LIMIT 10
                ),
                Producer_Category AS (
                    SELECT 
                        0 AS product_id,
                        NULL AS product_name,
                        '[]'::JSONB AS product_images,
                        product_producer AS product_producer,
                        0 AS product_price,
                        '[]'::JSONB AS product_sales_category,
                        'Producer_Category' AS category_query
                    FROM products  
                    GROUP BY product_producer
                ),
                Clothing_Category AS (
                    SELECT 
                        0 AS product_id,
                        NULL AS product_name,
                        '[]'::JSONB AS product_images,
                        product_type AS product_producer,
                        0 AS product_price,
                        '[]'::JSONB AS product_sales_category,
                        'Clothing_Category' AS category_query
                    FROM products  
                    GROUP BY product_type
                )
                SELECT * FROM Exclusive_Category
                UNION ALL
                SELECT * FROM Sale_Category
                UNION ALL 
                SELECT * FROM Best_Sellers_Category
                UNION ALL 
                SELECT * FROM New_Arrivals_Category
                UNION ALL 
                SELECT * FROM Producer_Category
                UNION ALL
                SELECT * FROM Clothing_Category;
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
