import NextAuth, { DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { neon } from '@neondatabase/serverless';
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { error } from "console";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                userEmail: { label: "UserEmail", type: "email" },
                userPassword: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const userEmail = credentials?.userEmail;
                const userPassword = credentials?.userPassword;

                const sql = neon(process.env.DATABASE_URL!);
                const userLoginQuery = await sql`SELECT user_id, user_email, user_password, user_first_name FROM 
                users WHERE user_email = ${userEmail} AND user_password = ${userPassword}`;

                if (userLoginQuery.length === 0) {
                    return null;
                }

                const checkUserProducer = await sql`SELECT business_name, 
                business_type, business_location
                FROM producers WHERE user_id = ${userLoginQuery[0].user_id}`

                let isUserProducer = false;

                console.log(checkUserProducer);

                //should only be one unique entry
                if (checkUserProducer.length === 1) {
                    isUserProducer = true

                    return {
                        id: userLoginQuery[0].user_id.toString(),
                        email: userLoginQuery[0].user_email,
                        isUserProducer: isUserProducer,
                        name: userLoginQuery[0].user_first_name,
                        business: {
                            businessName: checkUserProducer[0].business_name,
                            businessType: checkUserProducer[0].business_type,
                            businessLocation: checkUserProducer[0].business_location
                        }
                    };
                }


                //console.log("CHECK THIS IS RIGHT:", userLoginQuery[0].user_id.toString(), userLoginQuery[0].user_email)
                return {
                    id: userLoginQuery[0].user_id.toString(),
                    email: userLoginQuery[0].user_email,
                    isUserProducer: isUserProducer,
                    name: userLoginQuery[0].user_first_name,
                };
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }: { token: JWT, user?: DefaultUser }) {
            if (user) {
                token.user_id = Number(user.id);
                token.email = user.email;
                token.isUserProducer = user.isUserProducer
                token.business = user.business
                token.name = user.name ?? "User"
                //console.log("tokenHERE:", token);
            } else {
                // console.log("No user data found in jwt callback.");
            }
            return token;
        },

        async session({ session, token }:
            { session: Session, token: JWT }) {
            session.user.user_id = token.user_id
            session.user.email = token.email ?? undefined,
                session.user.isUserProducer = token.isUserProducer
            session.user.business = token.business
            session.user.name = token.name
            console.log("session:", session)
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: '/LoginPage',
        //error: 'ErrorPage'
    }

}
export default NextAuth(authOptions)

