import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client
import { authOptions } from './auth/[...nextauth]';
import { getServerSession } from "next-auth/next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

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
            productDetails
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
                product_producer
            ) 
            VALUES (
            ${productName}, 
            ${productPrice}, 
            ${productType}, 
            ${productAudience}, 
            ${productDescription}, 
            ${JSON.stringify(productColor)}, 
            ${productDetails},
            ${session.user.business?.businessName}
        );
        `;

        // Respond with the data in JSON format
        res.status(200).json({ message: 'Product updated successfully', insertProduct });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to upload product', details: (error as Error).message });
    }
}
