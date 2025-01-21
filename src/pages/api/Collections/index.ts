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
                        categoryQuery = `products.product_type = '${req.query.clothingCategory}'`
                    }
                    else {
                        categoryQuery = "1 = 1";
                    }

                    const baseQuery = `SELECT products.*
                        FROM products
                        INNER JOIN 
                        variant
                        ON products.product_id = variant.product_id
                        WHERE ${categoryQuery}`

                    if (sexArray.length > 0) {
                        sexQuery = ` AND (product_audience = '${sexArray.join("' OR product_audience = '")}')`;
                    }

                    if (colourArray.length > 0) {
                        colourQuery = ` array_agg(DISTINCT variant.variant_colour) @> ARRAY['${colourArray[0].toUpperCase()}']::character varying[]`;

                        for (let i = 1; i < colourArray.length; i++) {
                            colourQuery += ` OR array_agg(DISTINCT variant.variant_colour) @> ARRAY['${colourArray[i].toUpperCase()}']::character varying[]`;
                        }
                    }

                    if (sizeArray.length > 0) {
                        sizeQuery = ` array_agg(DISTINCT variant.variant_size) @> ARRAY['${sizeArray[0]}']::character varying[]`;

                        for (let i = 1; i < sizeArray.length; i++) {
                            sizeQuery += ` OR array_agg(DISTINCT variant.variant_size) @> ARRAY['${sizeArray[i]}']::character varying[]`;
                        }
                    }

                    if (req.query.saleCheck === 'On Sale') {
                        saleQuery = ` AND (product_sales_category @> '["Sale"]')`
                    }

                    if (req.query.sortBy === 'price_desc') {
                        sortQuery = ` ORDER BY product_price DESC;`
                    }
                    else if (req.query.sortBy === 'price_asc') {
                        sortQuery = ` ORDER BY product_price ASC;`
                    }
                    else if (req.body.sortBy === 'date_desc') {
                        sortQuery = ` ORDER BY product_created_at DESC;`
                    }

                    const groupByQuery = ' GROUP BY products.product_id';
                    let sizeColQuery = ``;

                    if (sizeQuery.length === 0 && colourQuery.length > 0) {
                        sizeColQuery = ' HAVING' + colourQuery;
                    }
                    else if (sizeQuery.length > 0 && colourQuery.length > 0) {
                        sizeColQuery = ' HAVING' + sizeQuery + ' OR ' + colourQuery;
                    }
                    else if (sizeQuery.length > 0 && colourQuery.length === 0) {
                        sizeColQuery = ' HAVING' + sizeQuery;
                    }

                    console.log(baseQuery + sexQuery + saleQuery + groupByQuery + sizeColQuery + sortQuery);
                    const data = await sql(baseQuery + sexQuery + saleQuery + groupByQuery + sizeColQuery + sortQuery);

                    if (data.length === 0) {
                        return res.status(404).json({ message: 'NO ITEMS FOUND FOR COLLECTION QUERY(IES)' });
                    }

                    return res.status(200).json(data);
                } catch (error) {
                    // Enhance error response
                    const errorDetails = error instanceof Error
                        ? {
                            name: error.name,
                            message: error.message,
                            stack: error.stack,
                        }
                        : { message: 'Unknown error occurred' };

                    res.status(500).json({
                        error: 'Failed to fetch data',
                        details: errorDetails,
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
