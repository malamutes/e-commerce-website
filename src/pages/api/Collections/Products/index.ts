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

                    //need to revisit this query, i was kinda close 
                    const data = await sql`
                        SELECT products.*,
                        jsonb_object_agg(variant_colours.variant_size, variant_colours.variant_combination) AS variant_combination
                        FROM products
                        INNER JOIN (
                        SELECT variant.product_id,
                        variant.variant_size,
                        array_agg(DISTINCT variant.variant_colour) AS variant_combination
                        FROM variant
                        GROUP BY variant.product_id, variant.variant_size
                        ) variant_colours
                        ON products.product_id = variant_colours.product_id
                        WHERE products.product_id = ${productID}
                        GROUP BY products.product_id;
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
                            SELECT *
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
                    productDetails,
                    productVariant,
                    productID
                } = req.body;

                console.log("CHECKING ADDING PRODUCT", req.body)

                const sql = neon(process.env.DATABASE_URL!);

                await sql`
                    INSERT INTO products (
                        product_id,
                        product_name, 
                        product_price, 
                        product_description, 
                        product_type, 
                        product_audience, 
                        product_details,
                        product_producer
                    ) 
                    VALUES (
                        ${productID},
                        ${productName}, 
                        ${Number(productPrice)}, 
                        ${productDescription}, 
                        ${productType}, 
                        ${productAudience}, 
                        ${productDetails},
                        ${session.user.business?.businessName}
                    );
                `;

                let variantDynamicQuery = "";

                Object.keys(productVariant).forEach((size, index, sizes) => {
                    Object.keys(productVariant[size]).forEach((colour, colourIndex, colours) => {
                        // Add the values to the query array
                        variantDynamicQuery += `(${productID}, '${colour}', '${size}', ${productVariant[size][colour]}, 'SKU-${productID}-${colour}-${size}')`;

                        // If it's not the last item, add a comma
                        if (!(index === sizes.length - 1 && colourIndex === colours.length - 1)) {
                            variantDynamicQuery += ', ';
                        }
                    });
                });


                const variantQuery = `INSERT INTO variant (
                    product_id, 
                    variant_colour,
                    variant_size,
                    variant_stock_count,
                    variant_sku
                    )
                    VALUES 
                        ${variantDynamicQuery}
                    ;`

                //console.log("variantQuery:", variantQuery);

                await sql(variantQuery);
                // Respond with the data in JSON format
                res.status(200).json({ message: 'Product updated successfully' });
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
