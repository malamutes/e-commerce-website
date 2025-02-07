// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client
import { getServerSession } from "next-auth/next"
import { AuthOptions } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            try {
                if (!req.query.category) {
                    return res.status(400).json({ error: 'Category parameter is required' });
                }

                const sql = neon(process.env.DATABASE_URL!);
                //REFRESH MATERIALIZED VIEW most_popular_products; 
                //need to call this somewhere prolly as a cron job to refresh
                /*const data = await sql`
                SELECT * FROM most_popular_products;
                `; */

                if (req.query.category === 'Exclusive') {
                    const exclusiveProducts = await sql`
                        SELECT products.product_id, products.product_name, products.product_images, products.product_producer, products.product_price, products.product_sales_category, product_sale_price
                        FROM products
                        WHERE products.product_sales_category @> '["Exclusive"]'::jsonb
                        LIMIT 10;
                    `;

                    if (exclusiveProducts.length === 0) {
                        return res.status(400).json({ error: 'No Items Found in Exclusive Category' });
                    }

                    return res.status(200).json(exclusiveProducts);
                }

                else if (req.query.category === 'Sale') {
                    const saleProducts = await sql`
                        SELECT products.product_id, products.product_name, products.product_images, products.product_producer, products.product_price, products.product_sales_category, product_sale_price
                        FROM products
                        WHERE products.product_sales_category @> '["Sale"]'::jsonb
                        LIMIT 10;
                    `;

                    if (saleProducts.length === 0) {
                        return res.status(400).json({ error: 'No Items Found in Sale Category' });
                    }

                    return res.status(200).json(saleProducts);
                }

                else if (req.query.category === 'Best Sellers') {
                    const bestSellersProducts = await sql`
                        SELECT products.product_id, products.product_name, products.product_images, products.product_producer, products.product_price, products.product_sales_category, product_sale_price
                        FROM products
                        WHERE products.product_sales_category @> '["Best Sellers"]'::jsonb
                        LIMIT 10;
                    `;

                    if (bestSellersProducts.length === 0) {
                        return res.status(400).json({ error: 'No Items Found in Best Sellers Category' });
                    }

                    return res.status(200).json(bestSellersProducts);
                }

                else if (req.query.category === 'New Arrivals') {
                    const newArrivalsProducts = await sql`
                        SELECT products.product_id, products.product_name, products.product_images, products.product_producer, products.product_price, products.product_sales_category, product_sale_price
                        FROM products
                        ORDER BY products.product_created_at DESC
                        LIMIT 10;
                    `;

                    if (newArrivalsProducts.length === 0) {
                        return res.status(400).json({ error: 'No Items Found in New Arrivals Category' });
                    }

                    return res.status(200).json(newArrivalsProducts);
                }

                else if (req.query.category === 'Producer') {
                    const producerProducts = await sql`
                        SELECT 0 AS product_id, NULL::text AS product_name, '[]'::jsonb AS product_images, products.product_producer, 0 AS product_price, '[]'::jsonb AS product_sales_category, 0 AS product_sale_price
                        FROM products
                        GROUP BY products.product_producer;
                    `;

                    if (producerProducts.length === 0) {
                        return res.status(400).json({ error: 'No Items Found in Producer Category' });
                    }

                    return res.status(200).json(producerProducts);
                }

                else if (req.query.category === 'Clothing') {
                    const clothingProducts = await sql`
                        SELECT 0 AS product_id, NULL::text AS product_name, '[]'::jsonb AS product_images, products.product_type AS product_producer, 0 AS product_price, '[]'::jsonb AS product_sales_category, 0 AS product_sale_price
                        FROM products
                        GROUP BY products.product_type;
                    `;

                    if (clothingProducts.length === 0) {
                        return res.status(400).json({ error: 'No Items Found in Clothing Category' });
                    }

                    return res.status(200).json(clothingProducts);
                }

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
