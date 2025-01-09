import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client
import { getServerSession } from "next-auth/next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            // Your GET logic here
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
                        req.body.order.ordersShippingMethod
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
                        orders_shipping_method
                    ) 
                    VALUES (
                        ${orderValues[0]},
                        ${orderValues[1]},
                        ${orderValues[2]},
                        ${orderValues[3]},
                        ${orderValues[4]},
                        ${orderValues[5]},
                        ${orderValues[6]}
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

                    console.log("YIPPIE API END POINT WORKS FOR CHECKOUT!", req.body);
                    res.status(200).json({ message: 'Order updated successfully' });

                } catch (error) {
                    console.log("Error:", error);
                    res.status(500).json({ error: 'Failed to upload order', details: error instanceof Error ? error.message : 'Unknown error' });
                }
            }
        }
        default: {
            res.status(405).json({ error: 'Method not allowed' });
        }
    }
}
