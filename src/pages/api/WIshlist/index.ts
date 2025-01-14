// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless'; // Import Neon or your preferred database client
import { getServerSession } from "next-auth/next"
import { AuthOptions } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET': {
            try {

                const sql = neon(process.env.DATABASE_URL!);

                res.status(200)
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
