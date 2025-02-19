// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'PATCH': {
            try {
                console.log(req.body, req.query);
                const sql = neon(process.env.DATABASE_URL!);
                if (req.query.request === 'UpdateProductPrices') {
                    if (req.body.onSale === true) {
                        await sql`
                            UPDATE products 
                            SET 
                                product_sales_category = CASE 
                                    WHEN NOT (product_sales_category @> '["Sale"]'::jsonb) 
                                    THEN product_sales_category || '["Sale"]'::jsonb 
                                    ELSE product_sales_category 
                                END,
                                product_sale_price = ${req.body.salePrice},
                                product_price = ${req.body.updatePrice}
                            WHERE product_id = ${req.body.productID};
                        `
                        return res.status(200).json({ message: "On sale and regular price updated successfully" });
                    }
                    else {
                        if (req.body.removeSale === true) {
                            await sql`
                               UPDATE products 
                                SET 
                                    product_sales_category = product_sales_category - 'Sale',
                                    product_price = ${req.body.updatePrice}
                                WHERE product_id = ${req.body.productID};  
                            `
                        }

                        await sql`
                        UPDATE products 
                        SET product_price = ${req.body.updatePrice}
                        WHERE product_id = ${req.body.productID};   
                        `
                        return res.status(200).json({ message: "Regular price updated successfully" });
                    }

                }
                else if (req.query.request === 'UpdateProductDetails') {
                    await sql`
                    UPDATE products 
                    SET 
                        product_audience = ${req.body.productAudience},
                        product_type = ${req.body.productType},
                        product_description = ${req.body.productDescription},
                        product_details = ${req.body.productDetails},
                        product_name = ${req.body.productName}
                    WHERE product_id = ${req.body.productID};   
                    `;

                    return res.status(200).json({ message: "Product details updated successfully" });
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
        case 'GET': {
            try {
                console.log(req.body, req.query);
                if (req.query.productID) {
                    const sql = neon(process.env.DATABASE_URL!);

                    const data = await sql`
                            SELECT product_price, product_sale_price, product_description, product_details, product_type, product_audience, product_name FROM products
                            WHERE product_id = ${req.query.productID};
                        `
                    console.log("REQ.QUEY.UpdateProduct FROM BACKEND SALE TRUE");
                    if (data.length === 0) {
                        return res.status(404);
                    }
                    return res.status(200).json(data);
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
