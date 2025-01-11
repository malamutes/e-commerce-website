import { NextApiRequest, NextApiResponse } from "next";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            if (req.query.producerQuery === "producerOrders") {
                try {
                    console.log("PRODUCER ORDERS API ENDPOINT REACHED!");

                    const session = await getServerSession(req, res, authOptions)
                    console.log(session);
                    if (!session) {
                        res.status(401).json({ message: "You must be logged in." })
                        return
                    }

                    const sql = neon(process.env.DATABASE_URL!);

                    const producerOrderHistory = await sql`
                        SELECT products.product_id,
                            products.product_name,
                            products.product_type,
                            products.product_audience,
                            products.product_images,
                            orders_items.orders_id,
                            orders_items.orders_items_variant_sku,
                            orders_items.orders_items_price,
                            orders_items.orders_items_status,
                            orders_items.orders_items_count,
                            orders_items.orders_items_variant_combination
                        FROM products
                        INNER JOIN orders_items
                        ON products.product_id = orders_items.orders_items_product_id
                        INNER JOIN producers 
                        ON producers.business_name = products.product_producer
                        WHERE producers.business_name = ${session.user.business?.businessName};
                    `
                    if (producerOrderHistory.length === 0) {
                        return res.status(404).json({ message: "You have no order history!" })
                    }
                    else {
                        return res.status(200).json({
                            message: "Producer order history retrieved!",
                            producerOrderHistory: producerOrderHistory
                        })
                    }
                    //console.log("API ENDPOINT userOrderHistoryDetails", userOrderHistoryDetails);


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
