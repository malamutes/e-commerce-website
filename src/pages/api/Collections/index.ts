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

                    // #region
                    /***************************************************************************************
                    *                            COMMON DYNAMIC QUERIES STUFF
                    ***************************************************************************************/
                    // This is the start of a collapsible block
                    const sql = neon(process.env.DATABASE_URL!);

                    let sexArray: string[] = [];
                    let colourArray: string[] = [];
                    let sizeArray: string[] = [];

                    let sexQuery = "";
                    let colourQuery = "";
                    let sizeQuery = "";
                    let saleQuery: string = "";
                    let sortQuery: string = "";
                    let categoryQuery: string = "";
                    let featuredQuery: string = "";
                    let searchBarQuery: string = "";
                    let brandQuery: string = "";

                    if (req.query.sex) {
                        sexArray = Array.isArray(req.query.sex) ? req.query.sex : [req.query.sex];
                    }

                    if (req.query.colour) {
                        colourArray = Array.isArray(req.query.colour) ? req.query.colour : [req.query.colour];
                    }

                    if (req.query.size) {
                        sizeArray = Array.isArray(req.query.size) ? req.query.size : [req.query.size];
                    }

                    if (req.query.clothingCategory !== 'All') {
                        categoryQuery = `products.product_type = '${req.query.clothingCategory}'`
                    }
                    else {
                        categoryQuery = "1 = 1";
                    }

                    if (req.query.searchBarQuery) {
                        searchBarQuery = ` AND (products.product_name ILIKE '${`%${req.query.searchBarQuery}%`}'
                    OR products.product_producer ILIKE '${`%${req.query.searchBarQuery}%`}')`
                    }

                    const baseQuery = `SELECT products.*,
                    COUNT(*) OVER() as total_count
                    FROM products
                    INNER JOIN 
                    variant
                    ON products.product_id = variant.product_id
                    WHERE ${categoryQuery}`

                    if (req.query.brand) {
                        brandQuery = ` AND products.product_producer = '${req.query.brand}'`
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

                    const queryLimit = ` LIMIT 12 OFFSET ${(Number(req.query.pageFetch) - 1) * 12};`
                    // #endregion

                    /***************************************************************************************
                    *                            REGULAR COLLECTION QUERY
                    *
                    * This handles the collection query when navigating from the PRODUCTS tab in the top 
                    * navigation bar. It involves multiple `if` conditions to filter products based on 
                    * the selected collection type and other dynamic parameters.
                    *
                    * Ensure the logic below handles all possible cases correctly for the query to return 
                    * the right set of products.
                    ***************************************************************************************/
                    if (req.query.featuredCategory === "All") {
                        console.log(req.query);

                        if (req.query.saleCheck === 'On Sale') {
                            saleQuery = ` AND (products.product_sales_category @> '["Sale"]')`
                        }
                        console.log(baseQuery + searchBarQuery + brandQuery + sexQuery + saleQuery + groupByQuery + sizeColQuery + sortQuery + queryLimit);
                        const data = await sql(baseQuery + searchBarQuery + brandQuery + sexQuery + saleQuery + groupByQuery + sizeColQuery + sortQuery + queryLimit);

                        if (data.length === 0) {
                            return res.status(404).json({ message: 'NO ITEMS FOUND FOR COLLECTION QUERY(IES)' });
                        }

                        return res.status(200).json(data);
                    }

                    /***************************************************************************************
                    *                            FEATURED COLLECTION QUERY
                    *
                    * This handles the collection query when navigating from the FEATUED tab in the top 
                    * navigation bar. It involves multiple `if` conditions to filter products based on 
                    * the selected collection type and other dynamic parameters.
                    *
                    * Ensure the logic below handles all possible cases correctly for the query to return 
                    * the right set of products.
                    ***************************************************************************************/
                    else {
                        console.log(req.query, "adsaddasd");

                        if (req.query.featuredCategory) {
                            if (req.query.saleCheck === 'On Sale') {
                                saleQuery = ', "Sale"';
                            }
                            featuredQuery = ` AND product_sales_category @> '["${req.query.featuredCategory}"${saleQuery}]'`
                        }
                        else {
                            featuredQuery = ""
                        }

                        console.log(baseQuery + featuredQuery + searchBarQuery + brandQuery + sexQuery + groupByQuery + sizeColQuery + sortQuery + queryLimit);
                        const data = await sql(baseQuery + featuredQuery + searchBarQuery + brandQuery + sexQuery + groupByQuery + sizeColQuery + sortQuery + queryLimit);

                        if (data.length === 0) {
                            return res.status(404).json({ message: 'NO ITEMS FOUND FOR COLLECTION QUERY(IES)' });
                        }

                        return res.status(200).json(data);
                    }

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
