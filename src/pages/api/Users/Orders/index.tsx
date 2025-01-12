import { NextApiRequest, NextApiResponse } from "next";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            if (req.query.orderID) {
                try {
                    const sql = neon(process.env.DATABASE_URL!);

                    console.log(req.query.orderID);
                    //using orderhistorycard interface to rename so i can acceess keys here
                    const userOrderHistoryDetails = await sql`
                            SELECT 
                            orders.orders_id, 
                            orders.orders_total_price, 
                            orders.orders_shipping_address,
                            orders.orders_shipping_method,
                            orders.orders_order_time,
                            orders.orders_shipping_price,
                            orders.orders_order_status,
                            array_agg(
                                json_build_object(
                                    'product_id', orders_items.orders_items_product_id,
                                    'sku', orders_items.orders_items_variant_sku,
                                    'price', orders_items.orders_items_price,
                                    'quantity', orders_items.orders_items_count,
                                    'combination', orders_items.orders_items_variant_combination,
                                    'image', (
                                        SELECT products.product_images[0]
                                        FROM products 
                                        WHERE products.product_id = orders_items.orders_items_product_id
                                        LIMIT 1
                                    ),
                                    'name', (
                                        SELECT products.product_name
                                        FROM products 
                                        WHERE products.product_id = orders_items.orders_items_product_id
                                        LIMIT 1
                                    ),
                                    'producer', (
                                        SELECT products.product_producer
                                        FROM products 
                                        WHERE products.product_id = orders_items.orders_items_product_id
                                        LIMIT 1
                                    )
                                )
                            ) AS orders_items_array
                        FROM 
                            orders 
                        INNER JOIN 
                            orders_items
                        ON 
                            orders.orders_id = orders_items.orders_id
                        WHERE 
                            orders.orders_id = ${req.query.orderID}
                        GROUP BY 
                            orders.orders_id;
                    `;

                    //console.log("API ENDPOINT userOrderHistoryDetails", userOrderHistoryDetails);
                    if (userOrderHistoryDetails.length >= 0) {
                        res.status(200).json({
                            message: "User Order History Retrieved!",
                            userOrderHistoryDetails: userOrderHistoryDetails
                        });
                    }

                    else {
                        res.status(404).json({ message: "No order history found" });
                    }

                }
                catch (error) {
                    console.error(error);
                    // Send error response back
                    return res.status(500).json({ message: "Error getting user order history", error });
                }
            }
            //TODO: getting order history of user 
            return res.status(200).json({ message: "API CONNECTED FOR USER GET!" })
        }
        default: {
            // Handle other methods if needed (e.g., POST, DELETE)
            return res.status(405).json({ message: "Method Not Allowed" });
        }
    }
}
