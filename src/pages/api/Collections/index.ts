// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client
import { getServerSession } from "next-auth/next"
import { AuthOptions } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            if (req.query) {
                try {
                    console.log(req.query);
                    //sex filter array will either be empty array or filled array
                    let sexArray: string[] = [];
                    let colourArray: string[] = [];
                    let sizeArray: string[] = [];

                    let sexQuery = "";
                    let colourQuery = "";
                    let sizeQuery = "";
                    let saleQuery: string = "";
                    let sortQuery: string = "";
                    let categoryQuery: string = "";

                    if (req.query.sex) {
                        sexArray = Array.isArray(req.query.sex) ? req.query.sex : [req.query.sex];
                    }

                    if (req.query.colour) {
                        colourArray = Array.isArray(req.query.colour) ? req.query.colour : [req.query.colour];
                    }

                    if (req.query.size) {
                        sizeArray = Array.isArray(req.query.size) ? req.query.size : [req.query.size];
                    }

                    const sql = neon(process.env.DATABASE_URL!);

                    if (req.query.clothingCategory !== 'All') {
                        categoryQuery = `product_type = '${req.query.clothingCategory}'`
                    }
                    else {
                        categoryQuery = "1 = 1";
                    }

                    const baseQuery = `SELECT product_id, product_name, product_price, product_audience, product_producer, product_colour, product_size, product_sales_category, product_images FROM products 
                        WHERE ${categoryQuery}`

                    if (sexArray.length > 0) {
                        sexQuery = ` AND (product_audience = '${sexArray.join("' OR product_audience = '")}')`;
                    }

                    if (colourArray.length > 0) {
                        colourQuery = ` AND (product_colour @> '["${colourArray.join(`"]' OR product_colour @> '["`)}"]')`;
                    }

                    if (sizeArray.length > 0) {
                        sizeQuery = ` AND (product_size @> '["${sizeArray.join(`"]' OR product_size @> '["`)}"]')`;
                    }

                    if (req.query.saleCheck === 'On Sale') {
                        saleQuery = ` AND (product_sales_category @> '["Sale"]')`
                    }

                    if (req.query.sortBy === 'price_desc') {
                        sortQuery = ` ORDER BY product_price DESC`
                    }
                    else if (req.query.sortBy === 'price_asc') {
                        sortQuery = ` ORDER BY product_price ASC`
                    }
                    else if (req.body.sortBy === 'date_desc') {
                        sortQuery = ` ORDER BY product_created_at DESC`
                    }


                    console.log(baseQuery + sexQuery + colourQuery + sizeQuery + saleQuery + sortQuery);
                    const data = await sql(baseQuery + sexQuery + colourQuery + sizeQuery + saleQuery + sortQuery);

                    if (data.length === 0) {
                        return res.status(400).json({ error: 'No Items Found' });
                    }

                    return res.status(200).json(data);
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
