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

                    console.log(req.query, "adsaddasd");

                    const sql = neon(process.env.DATABASE_URL!);

                    let sexArray: string[] = [];

                    let saleCat: string = "";
                    let clothingCat: string = "";
                    let sexQuery: string = "";
                    let sortQuery: string = "";
                    let saleQuery: string = "";


                    if (req.query.SaleCategory) {
                        if (req.query.SaleCategory !== 'All') {
                            saleCat = (req.query.SaleCategory as string);
                        }
                        else {
                            const data = await sql`SELECT * FROM products`;

                            if (data.length === 0) {
                                return res.status(400).json({ error: 'No Items Found' });
                            }

                            res.status(200).json(data);
                        }

                    }

                    if (req.query.clothingCategory && req.query.clothingCategory !== 'All') {
                        clothingCat = ` AND product_type = '${req.query.clothingCategory}'`
                    }

                    if (req.query.sex) {
                        sexArray = Array.isArray(req.query.sex) ? req.query.sex : [req.query.sex];
                    }

                    if (sexArray.length > 0) {
                        sexQuery = ` AND (product_audience = '${sexArray.join("' OR product_audience = '")}')`;
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


                    const sqlQuery: string = `
                        SELECT * FROM products WHERE product_sales_category @> '["${saleCat}"]' ${clothingCat} ${sexQuery}${saleQuery}${sortQuery};
                        `;

                    console.log(sqlQuery);

                    const data = await sql(sqlQuery);

                    if (data.length === 0) {
                        return res.status(400).json({ error: 'No Items Found' });
                    }

                    res.status(200).json(data);
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
