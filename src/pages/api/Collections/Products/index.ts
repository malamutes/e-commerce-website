// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            if (req.query.productID) {
                //get one product for product view page
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

            else {
                //getting all products of same producer for producer dashboard
                try {
                    const session = await getServerSession(req, res, authOptions)

                    if (!session) {
                        res.status(401).json({ message: "You must be logged in." })
                        return
                    }

                    // Connect to your database
                    const sql = neon(process.env.DATABASE_URL!);

                    // Query to fetch products
                    const data = await sql`
                            SELECT 
                                product_id,
                                product_name, 
                                product_price, 
                                product_type, 
                                product_audience, 
                                product_description, 
                                product_colour, 
                                product_details,
                                product_sales_category
                            FROM products
                            WHERE 
                            product_producer = ${session.user.business?.businessName}`;

                    //prolly need to do if no items then send back you have no products or something

                    // Respond with the data in JSON format
                    res.status(200).json(data);
                } catch (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Failed to fetch data' });
                }

            }

            break;
        }

        case 'POST': {
            try {

                const session = await getServerSession(req, res, authOptions);

                if (!session) {
                    res.status(401).json({ message: "You must be logged in." })
                    return
                }

                const {
                    productName,
                    productPrice,
                    productType,
                    productAudience,
                    productDescription,
                    productColor,
                    productDetails,
                    productSize
                } = req.body;

                const sql = neon(process.env.DATABASE_URL!);

                const insertProduct = await sql`
                    INSERT INTO products (
                        product_name, 
                        product_price, 
                        product_type, 
                        product_audience, 
                        product_description, 
                        product_colour, 
                        product_details,
                        product_producer,
                        product_size,
                    ) 
                    VALUES (
                    ${productName}, 
                    ${productPrice}, 
                    ${productType}, 
                    ${productAudience}, 
                    ${productDescription}, 
                    ${JSON.stringify(productColor)}, 
                    ${productDetails},
                    ${session.user.business?.businessName},
                    ${JSON.stringify(productSize)}
                );
                `;

                // Respond with the data in JSON format
                res.status(200).json({ message: 'Product updated successfully', insertProduct });
            } catch (error) {
                console.log(error)
                res.status(500).json({ error: 'Failed to upload product', details: (error as Error).message });
            }
        }
        default: {
            //TODO
        }
    }

}
