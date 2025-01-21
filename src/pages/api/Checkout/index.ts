import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client
import { getServerSession } from "next-auth/next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            if (req.query.orderID) {
                try {
                    console.log(req.query);
                    const sql = neon(process.env.DATABASE_URL!);

                    const orderReceiptData = await sql`
                    SELECT orders.*, 
                    array_agg(
                        json_build_object(
                            'product_id', orders_items.orders_items_product_id,
                            'quantity', orders_items.orders_items_count,
                            'price', orders_items.orders_items_price,
                            'combination', orders_items.orders_items_variant_combination,
                            'image', ( SELECT products.product_images[0]
                                FROM products
                                WHERE products.product_id = orders_items.orders_items_product_id),
                            'name', (
                            SELECT products.product_name
                            FROM products
                            WHERE products.product_id = orders_items.orders_items_product_id
                            )
                        )
                    ) as orders_items_list
                    FROM orders 
                    INNER JOIN orders_items 
                        ON orders.orders_id = orders_items.orders_id 
                    WHERE orders.orders_id = ${req.query.orderID}
                    GROUP BY orders.orders_id;
                    `;

                    console.log("ORDER DATA RETRIEVED FROM DB FOR CHECKOUT RECEIPT", orderReceiptData);

                    return res.status(200).json({ message: "ORDER DATA RECEIVED FOR CHECKOUT RECEIPT!", data: orderReceiptData })
                }
                catch (error) {
                    console.log("Error:", error);
                    res.status(500).json({ error: 'FAILED TO UPLOAD ORDER TO DB', details: error instanceof Error ? error.message : 'Unknown error' });
                }
            }
        }

        case 'POST': {
            if (req.body) {
                try {
                    const sql = neon(process.env.DATABASE_URL!);

                    // Prepare values for the orders table
                    const orderValues = [
                        req.body.order.userID,
                        req.body.order.orderID,
                        req.body.order.ordersTotalPrice.toFixed(2),
                        req.body.order.ordersShippingAddress,
                        req.body.order.ordersEmail,
                        'COMPLETED', // Order status
                        req.body.order.ordersShippingMethod,
                        req.body.order.ordersShippingPrice
                    ];

                    // Insert into orders table
                    await sql`
                    INSERT INTO orders (
                        user_id,
                        orders_id,
                        orders_total_price,
                        orders_shipping_address,
                        orders_email,
                        orders_order_status,
                        orders_shipping_method,
                        orders_shipping_price
                    ) 
                    VALUES (
                        ${orderValues[0]},
                        ${orderValues[1]},
                        ${orderValues[2]},
                        ${orderValues[3]},
                        ${orderValues[4]},
                        ${orderValues[5]},
                        ${orderValues[6]},
                         ${orderValues[7]}
                    );
                    `;

                    // Prepare values for the order_items table
                    const orderItemsValues = Object.keys(req.body.orderItems).map((skuKey) => {
                        const item = req.body.orderItems[skuKey];
                        return [
                            req.body.order.orderID,
                            item.itemID,
                            skuKey,
                            item.itemPrice,
                            'DELIVERED', // Item status
                            [item.itemSize, item.itemColour],  // This is an array, no JSON.stringify required
                            item.itemCount
                        ];
                    });

                    // Insert into orders_items table
                    for (const values of orderItemsValues) {
                        await sql`
                        INSERT INTO orders_items (
                            orders_id,
                            orders_items_product_id,
                            orders_items_variant_sku,
                            orders_items_price,
                            orders_items_status,
                            orders_items_variant_combination,
                            orders_items_count
                        )
                        VALUES (
                            ${values[0]},
                            ${values[1]},
                            ${values[2]},
                            ${values[3]},
                            ${values[4]},
                            ${values[5]},
                            ${values[6]}
                        );
                        `;
                    }

                    console.log("ORDER INFO TO CHECKOUT AND POST TO DB", req.body);
                    res.status(200).json({ message: 'ORDER POSTED TO DB SUCCESSFULLY!' });

                } catch (error) {
                    console.log("Error:", error);
                    res.status(500).json({ error: 'FAILED TO POST ORDER TO DB', details: error instanceof Error ? error.message : 'Unknown error' });
                }
            }
        }
        default: {
            res.status(405).json({ error: 'Method not allowed' });
        }
    }
}
