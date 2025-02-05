import NextAuth, { DefaultUser, Session, User, Account, Profile } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { neon } from '@neondatabase/serverless';
import { JWT } from "next-auth/jwt";

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
                const userLoginQuery = await sql`SELECT user_id, user_email, user_first_name, user_last_name, user_address FROM 
                users WHERE user_email = ${userEmail} AND user_password = ${userPassword}`;

                if (userLoginQuery.length === 0) {
                    return null;
                }

                const checkUserProducer = await sql`SELECT business_name, 
                business_type, business_location
                FROM producers WHERE user_id = ${userLoginQuery[0].user_id}`;

                let isUserProducer = false;

                if (checkUserProducer.length === 1) {
                    isUserProducer = true;
                    return {
                        id: userLoginQuery[0].user_id.toString(),
                        email: userLoginQuery[0].user_email,
                        isUserProducer: isUserProducer,
                        firstName: userLoginQuery[0].user_first_name,
                        lastName: userLoginQuery[0].user_last_name,
                        phone: userLoginQuery[0].user_phone ?? "To be added.",
                        //default in user address in DB is empty array so equal to ?? {}
                        address: userLoginQuery[0].user_address,
                        business: {
                            businessName: checkUserProducer[0].business_name,
                            businessType: checkUserProducer[0].business_type,
                            businessLocation: checkUserProducer[0].business_location
                        }
                    };
                }

                return {
                    id: userLoginQuery[0].user_id.toString(),
                    email: userLoginQuery[0].user_email,
                    isUserProducer: isUserProducer,
                    firstName: userLoginQuery[0].user_first_name,
                    lastName: userLoginQuery[0].user_last_name,
                    phone: userLoginQuery[0].user_phone ?? "To be added.",
                    address: userLoginQuery[0].user_address,
                };
            }
        })
    ],

    callbacks: {
        async jwt({ token, user, session, trigger }: {
            token: JWT;
            user?: User | DefaultUser;
            session?: Session;
            trigger?: string
        }) {
            // Use 'trigger' to handle updates

            //ILL NEED TO FIGURE OUT HOW NEXT AUTH ACTUALLY WORKS HOLY I AM CLULESS ON THIS SHIT
            console.log("USER BLOCK RUN ")
            if (trigger === 'update' && session?.user) {
                console.log("USER IF BLOCK RUN")
                return {
                    ...token, ...session?.user
                }
            }
            if (user) {
                console.log("USER ELSE BLOCK RUN ")
                token.user_id = Number(user.id);
                token.email = user.email;
                token.isUserProducer = user.isUserProducer;
                token.business = user.business;
                token.firstName = user.firstName ?? "UserFirstName";
                token.lastName = user.lastName ?? "UserLastName";
                token.phone = user.phone;
                token.address = user.address
            }

            console.log("TOKEN CALLBACK BLOCK");
            return token;
        },

        async session({ session, token }: { session: Session, token: JWT }) {
            // Ensure that the session gets updated with the correct data from token
            session.user.user_id = token.user_id;
            session.user.email = token.email ?? undefined;
            session.user.isUserProducer = token.isUserProducer;
            session.user.business = token.business;
            session.user.firstName = token.firstName;
            session.user.lastName = token.lastName;
            session.user.phone = token.phone;
            session.user.address = token.address

            console.log("TOKEN CHECK IF UPDATED");
            console.log("Session updated:");
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: '/LoginPage',
    }
};

export default NextAuth(authOptions);
