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
                const userLoginQuery = await sql`SELECT user_id, user_email, user_password FROM 
                users WHERE user_email = ${userEmail} AND user_password = ${userPassword}`;

                if (userLoginQuery.length === 0) {
                    return null;
                }

                //console.log("CHECK THIS IS RIGHT:", userLoginQuery[0].user_id.toString(), userLoginQuery[0].user_email)
                return {
                    id: userLoginQuery[0].user_id.toString(),
                    email: userLoginQuery[0].user_email
                };
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }: { token: JWT, user?: DefaultUser }) {
            if (user) {
                token.user_id = Number(user.id);
                token.email = user.email;
                //console.log("tokenHERE:", token);
            } else {
                // console.log("No user data found in jwt callback.");
            }
            return token;
        },

        async session({ session, token }:
            { session: Session, token: JWT }) {
            session.user.user_id = token.user_id
            session.user.email = token.email ?? undefined
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

