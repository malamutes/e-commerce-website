// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            try {
                const sql = neon(process.env.DATABASE_URL!);
                if (req.query.requestType === 'Modal') {

                    const data = await sql`
                    SELECT array_agg(wishlist_name) FROM wishlists GROUP BY user_id;
                    `

                    res.status(200).json(data);

                }
                else if (req.query.requestType === 'getWishlistedItems') {
                    const session = await getServerSession(req, res, authOptions)

                    if (!session) {
                        res.status(401).json({ message: "You must be logged in." })
                        return
                    }

                    const data = await sql`
                        SELECT product_id,
                        array_agg(wishlist_name) AS associated_wishlists
                        FROM wishlists_table 
                        WHERE user_id = ${session.user.user_id} 
                        GROUP BY product_id;
                        `;

                    if (data.length === 0) {
                        return res.status(404).json({ message: "NO WISHLISTED ITEMS FOUND!" })
                    }

                    return res.status(200).json(data)

                }
                else if (req.query.requestType === 'getWishlistDetails') {
                    if (req.query.wishlistDetails) {
                        const session = await getServerSession(req, res, authOptions)

                        if (!session) {
                            res.status(401).json({ message: "You must be logged in." })
                            return
                        }
                        const data = await sql`
                            SELECT array_agg(product_id) AS product_Wishlisted, wishlist_name
                            FROM wishlists_table 
                            WHERE user_id = ${session.user.user_id}
                            AND wishlist_name = ${req.query.wishlistDetails}
                            GROUP BY user_id, wishlist_name;
                        `;

                        if (data.length === 0) {
                            return res.status(404).json({ message: "NO WISHLISTED ITEMS FOUND!" })
                        }

                        return res.status(200).json(data)
                    }
                    else {
                        return res.status(500).json({ message: "NO VALID WISHLIST PROVIDED TO QUERY!" })
                    }
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

        }

        case 'POST': {
            if (req.body) {
                try {
                    const session = await getServerSession(req, res, authOptions)

                    if (!session) {
                        res.status(401).json({ message: "You must be logged in." })
                        return
                    }

                    const sql = neon(process.env.DATABASE_URL!);

                    if (req.body.newWishlist !== '') {
                        await sql`
                        INSERT INTO wishlists (wishlist_name, user_id)
                        VALUES (${req.body.newWishlist}, ${session.user.user_id});
                        `;
                    }

                    console.log(req.body);

                    const queryStart = "INSERT INTO wishlists_table (user_id, product_id, wishlist_name) VALUES";
                    const queryEnd = (req.body.wishlistSelected as string[])
                        .filter(wishList => wishList !== "")
                        .map((wishList) =>
                            `(${session.user.user_id}, ${req.body.itemID}, '${wishList}')`
                        ).join(', \n')

                    console.log(queryStart + queryEnd);

                    if (req.body.wishlistSelected.length !== 0) {
                        await sql(queryStart + queryEnd);
                        return res.status(200).json({ message: "WISHLIST API BACKEND, INSERT SUCCESSFUL " })
                    }


                    res.status(200).json({ message: "NEW LIST ADDED, NO INSERTS " });
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

        }

        case 'PATCH': {
            if (req.body) {
                try {
                    const session = await getServerSession(req, res, authOptions)

                    if (!session) {
                        res.status(401).json({ message: "You must be logged in." })
                        return
                    }
                    console.log("UPDATING WISHLIST ITEMS", req.body);
                    const sql = neon(process.env.DATABASE_URL!);
                    const wishlistSelected: string[] = req.body.wishlistSelected;

                    //[ 'LOLOKRIOT', 'Wishlist 5', 'Wishlist 4' ];

                    if (req.body.newWishlist !== '') {
                        await sql`
                        INSERT INTO wishlists (wishlist_name, user_id)
                        VALUES (${req.body.newWishlist}, ${session.user.user_id});
                        `;
                    }

                    if (wishlistSelected.length !== 0) {
                        /*console.log(`     DELETE FROM wishlists_table 
                            WHERE user_id = ${session.user.user_id} AND 
                            product_Id = ${req.body.itemID} AND
                            wishlist_name NOT IN (${wishlistSelected.map(wishlist => `'${wishlist}'`).join(", ")});`); */

                        const deletedRows = await sql`
                            DELETE FROM wishlists_table 
                            WHERE user_id = ${session.user.user_id} AND 
                            product_Id = ${req.body.itemID} AND
                            wishlist_name NOT IN (${wishlistSelected.map(wishlist => `'${wishlist}'`).join(", ")});
                            `;

                        const queryStart = "INSERT INTO wishlists_table (user_id, product_id, wishlist_name) VALUES ";

                        const queryMiddle = (wishlistSelected as string[])
                            .filter(wishList => wishList !== "")
                            .map((wishList) =>
                                `(${session.user.user_id}, ${req.body.itemID}, '${wishList}')`
                            ).join(', \n')

                        const queryEnd = " ON CONFLICT (user_id, product_id, wishlist_name) DO NOTHING;"

                        //console.log(queryStart + queryMiddle + queryEnd);

                        const insertedRows = await sql(queryStart + queryMiddle + queryEnd);

                        //console.log(deletedRows, insertedRows);

                        return res.status(200).json({ message: "WISHLIST API BACKEND, INSERT SUCCESSFUL ", data: [deletedRows, insertedRows] })
                    }
                    else {
                        await sql` DELETE FROM wishlists_table
                            WHERE user_id = ${session.user.user_id} AND
                            product_Id = ${req.body.itemID}`;

                        return res.status(200).json({ message: "REMOVED ALL WISHLISTS FROM OBJECT" });
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
            }
        }

        case 'DELETE': {
            if (req.query.wishlistToDelete) {
                try {
                    const session = await getServerSession(req, res, authOptions)

                    console.log()
                    if (!session) {
                        res.status(401).json({ message: "You must be logged in." })
                        return
                    }

                    const sql = neon(process.env.DATABASE_URL!);

                    await sql`
                    DELETE FROM wishlists
                    WHERE user_id = ${session.user.user_id} 
                    AND wishlist_name = ${req.query.wishlistToDelete};
                    `;

                    res.status(200).json({ message: "DELETED WISHLIST FROM DB" });
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
        }
        default: {
            //TODO
        }
    }

}
