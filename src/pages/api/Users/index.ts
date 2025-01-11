import { NextApiRequest, NextApiResponse } from "next";
import { neon } from "@neondatabase/serverless";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            if (req.query.userID) {
                try {
                    const sql = neon(process.env.DATABASE_URL!);

                    //using orderhistorycard interface to rename so i can acceess keys here
                    const userOrderHistory = await sql`
                    SELECT users.user_id, 
                        orders.orders_id, 
                        orders.orders_order_time, 
                        orders.orders_total_price, 
                        orders.orders_order_status,
                        json_agg(products.product_images[0]) as orders_image
                    FROM users 
                    INNER JOIN orders 
                    ON
                        users.user_id = orders.user_id
                        INNER JOIN orders_items
                    ON 
                        orders.orders_id = orders_items.orders_id
                        INNER JOIN products
                    ON
                        orders_items.orders_items_product_id = products.product_id
                    WHERE users.user_id = 40
                    GROUP BY users.user_id, orders.orders_id;
                    `;

                    if (userOrderHistory.length >= 0) {
                        res.status(200).json({
                            message: "User Order History Retrieved!",
                            userOrderHistory: userOrderHistory
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
        case 'PATCH': {
            if (req.query.edit === 'Profile') {
                try {
                    const session = await getServerSession(req, res, authOptions)

                    if (!session) {
                        res.status(401).json({ message: "You must be logged in." })
                        return
                    }

                    const sql = neon(process.env.DATABASE_URL!);
                    console.log("API BACKEND USERPROFILE USER ID", session.user.user_id)
                    const updateUserProfile = await sql`
                    UPDATE users 
                    SET user_first_name = ${req.body.firstName ?? session.user.firstName},
                        user_last_name = ${req.body.lastName ?? session.user.lastName},
                        user_email = ${req.body.email ?? session.user.email},
                        user_phone = ${req.body.phone ?? session.user.phone}
                    WHERE user_id = ${session.user.user_id};`;


                    // some issues where even it fails it still outputs 200 odd, need to find some error checking
                    return res.status(200).json({ message: "Update Successful!" });
                } catch (error) {
                    console.error(error);
                    // Send error response back
                    return res.status(500).json({ message: "Error updating profile", error });
                }
            }
            else if (req.query.edit === 'Address') {
                const sql = neon(process.env.DATABASE_URL!)

                const session = await getServerSession(req, res, authOptions)

                if (!session) {
                    res.status(401).json({ message: "You must be logged in." })
                    return
                }

                //update object in database
                console.log(req.body);
                await sql`
                UPDATE users
                SET user_address = ${req.body}
                WHERE user_id = ${session.user.user_id};
                `;

                return res.status(200).json({ message: "Updated users address successfully." })
            }
            else {
                // Return an error if edit query is missing or incorrect
                return res.status(400).json({ message: "Invalid request" });
            }
        }
        default: {
            // Handle other methods if needed (e.g., POST, DELETE)
            return res.status(405).json({ message: "Method Not Allowed" });
        }
    }
}
