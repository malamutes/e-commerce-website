import NextAuth, { Account, DefaultUser, Profile, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { neon } from '@neondatabase/serverless';
import { JWT } from "next-auth/jwt";
import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord"
import GitHubProvider, { GithubProfile } from "next-auth/providers/github";
import { DBAddressInterface } from "@/app/DataInterfaces";

type UserRow = {
    user_id: number;
    user_first_name: string | null;
    user_last_name: string | null;
    user_email: string | null;
    user_password: string | null;
    user_phone: string | null;
    user_address: DBAddressInterface | null;
    google_id: string | null;
    github_id: string | null;
    discord_id: string | null;
    new_user: boolean; // Renamed from 'newUser' to match your database field
};
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                userEmail: { label: "UserEmail", type: "email" },
                userPassword: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
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
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "FALLBACK CLIENET ID GOOGLE STRING",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "FALLBACK CLIENT GOOGLE SECRET STRING"
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_ID ?? "FALLBACK CLIENET ID DISCORD STRING",
            clientSecret: process.env.DISCORD_CLIENT ?? "FALLBACK CLIENT SECRET DISCORD STRING",
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        })
    ],

    callbacks: {
        async signIn({ account, profile }: {
            account: Account | null;
            profile?: Profile | undefined;
        }) {
            if (account?.provider === 'google') {
                const googleProfile = profile as GoogleProfile;

                //console.log(googleProfile);
                const sql = neon(process.env.DATABASE_URL!);

                const userLoginQuery = await sql`SELECT user_id, user_email, user_first_name, user_last_name, user_address FROM 
                users WHERE user_email = ${googleProfile?.email} AND google_id =${googleProfile?.sub}`;

                //inserting new user into db
                if (userLoginQuery.length === 0) {
                    console.log("GOOGLE INSERTING USER")
                    await sql`INSERT INTO users(user_first_name, user_last_name, user_email, google_id, new_user) 
                    VALUES (${googleProfile?.given_name}, ${googleProfile?.family_name}, ${googleProfile?.email}, ${googleProfile?.sub?.toString()}, ${true});`

                    return true
                }
                else {
                    await sql`UPDATE users SET new_user = ${false} WHERE user_id = ${userLoginQuery[0].user_id};`
                    return true
                }

            }
            else if (account?.provider === 'github') {

                const githubProfile = profile as GithubProfile;
                const sql = neon(process.env.DATABASE_URL!);
                //console.log(githubProfile);
                const userLoginQuery = await sql`SELECT user_id, user_email, user_first_name, user_last_name, user_address FROM 
                users WHERE user_email = ${githubProfile?.email} AND github_id = ${githubProfile.id}`;

                //inserting new user into db
                if (userLoginQuery.length === 0) {
                    //console.log("GITHUB INSERTING USER")
                    await sql`INSERT INTO users(user_first_name, user_email, github_id, new_user) 
                    VALUES (${githubProfile?.login}, ${githubProfile?.email}, ${githubProfile?.id?.toString()}, ${true});`

                    return true
                }
                else {
                    await sql`UPDATE users SET new_user = ${false} WHERE user_id = ${userLoginQuery[0].user_id};`
                    return true
                }
            }
            else if (account?.provider === 'discord') {

                const discordProfile = profile as DiscordProfile;
                const sql = neon(process.env.DATABASE_URL!);
                //console.log(githubProfile);
                const userLoginQuery = await sql`SELECT user_id, user_email, user_first_name, user_last_name, user_address FROM 
                users WHERE user_email = ${discordProfile?.email} AND discord_id = ${discordProfile.id}`;

                //inserting new user into db
                if (userLoginQuery.length === 0) {
                    //console.log("GITHUB INSERTING USER")
                    await sql`INSERT INTO users(user_first_name, user_email, discord_id, new_user) 
                    VALUES (${discordProfile?.username}, ${discordProfile?.email}, ${discordProfile?.id?.toString()}, ${true});`

                    return true
                }
                else {
                    await sql`UPDATE users SET new_user = ${false} WHERE user_id = ${userLoginQuery[0].user_id};`
                    return true
                }
            }
            return true
        },

        async jwt({ token, user, session, trigger, account }: {
            token: JWT;
            user?: User | DefaultUser;
            session?: Session;
            trigger?: string;
            account: Account | null
        }) {
            // Use 'trigger' to handle updates
            if (account?.provider === 'google') {
                if (token.email && token.sub) {
                    const sql = neon(process.env.DATABASE_URL!);
                    console.log("token:", token);
                    //console.log("TOKEN:", token, "USER: ", user, "ACCOUNT: ", account);

                    const userQuery = await sql`
                    SELECT * FROM users WHERE user_email = ${token.email} AND google_id = ${token.sub};
                    `;

                    console.log(userQuery);

                    const user = userQuery[0] as UserRow;
                    if (user) {
                        if (user.new_user) {
                            token.user_id = Number(user.user_id);
                            token.email = user.user_email;
                            token.google_id = user.google_id ?? "FALLBACK GOOGLE ID";
                            token.firstName = user.user_first_name ?? "UserFirstName";
                            token.lastName = user.user_last_name ?? "UserLastName";
                            token.phone = user.user_phone ?? "";
                            token.address = user.user_address ?? {};
                            token.newUser = user.new_user;
                        }
                        else {

                            const checkUserProducer = await sql`SELECT business_name, 
                            business_type, business_location
                            FROM producers WHERE user_id = ${userQuery[0].user_id}`;

                            let isUserProducer = false;

                            if (checkUserProducer.length === 1) {
                                isUserProducer = true;
                            }

                            token.user_id = Number(user.user_id);
                            token.email = user.user_email;
                            token.google_id = user.google_id ?? "FALLBACK GOOGLE ID";
                            token.firstName = user.user_first_name ?? "UserFirstName";
                            token.lastName = user.user_last_name ?? "UserLastName";
                            token.phone = user.user_phone ?? "";
                            token.address = user.user_address ?? {};
                            token.newUser = user.new_user;
                            token.isUserProducer = isUserProducer;
                            if (isUserProducer) {
                                token.business = {
                                    businessName: checkUserProducer[0].business_name,
                                    businessType: checkUserProducer[0].business_type,
                                    businessLocation: checkUserProducer[0].business_location
                                }
                            }
                        }

                        // Now you can return or use `token` as needed
                    }

                    return token;
                }


            }

            if (account?.provider === 'github') {
                if (token.email && token.sub) {
                    const sql = neon(process.env.DATABASE_URL!);
                    //console.log("token:", token);
                    //console.log("TOKEN:", token, "ACCOUNT: ", account);
                    const userQuery = await sql`
                    SELECT * FROM users WHERE user_email = ${token.email} AND github_id = ${account.providerAccountId};
                    `;

                    //console.log(userQuery);

                    const user = userQuery[0] as UserRow;
                    if (user) {
                        if (user.new_user) {
                            token.user_id = Number(user.user_id);
                            token.email = user.user_email;
                            token.github_id = user.github_id ?? undefined;
                            token.firstName = user.user_first_name ?? "UserFirstName";
                            token.lastName = user.user_last_name ?? "";
                            token.phone = user.user_phone ?? "";
                            token.address = user.user_address ?? {};
                            token.newUser = user.new_user;
                        }
                        else {
                            const checkUserProducer = await sql`SELECT business_name, 
                            business_type, business_location
                            FROM producers WHERE user_id = ${userQuery[0].user_id}`;

                            let isUserProducer = false;

                            //console.log(checkUserProducer);
                            if (checkUserProducer.length === 1) {
                                isUserProducer = true;
                            }

                            token.user_id = Number(user.user_id);
                            token.email = user.user_email;
                            token.github_id = user.github_id ?? undefined;
                            token.firstName = user.user_first_name ?? "UserFirstName";
                            token.lastName = user.user_last_name ?? "";
                            token.phone = user.user_phone ?? "";
                            token.address = user.user_address ?? {};
                            token.newUser = user.new_user;
                            token.isUserProducer = isUserProducer;

                            if (isUserProducer) {
                                token.business = {
                                    businessName: checkUserProducer[0].business_name,
                                    businessType: checkUserProducer[0].business_type,
                                    businessLocation: checkUserProducer[0].business_location
                                }
                            }
                        }
                    }
                    return token;
                }
            }

            if (account?.provider === 'discord') {
                if (token.email && token.sub) {
                    const sql = neon(process.env.DATABASE_URL!);
                    //console.log("token:", token);
                    console.log("TOKEN:", token, "ACCOUNT: ", account);
                    const userQuery = await sql`
                    SELECT * FROM users WHERE user_email = ${token.email} AND discord_id = ${account.providerAccountId};
                    `;

                    //console.log(userQuery);

                    const user = userQuery[0] as UserRow;
                    if (user) {
                        if (user.new_user) {
                            token.user_id = Number(user.user_id);
                            token.email = user.user_email;
                            token.discord_id = user.discord_id ?? undefined;
                            token.firstName = user.user_first_name ?? "UserFirstName";
                            token.lastName = user.user_last_name ?? "";
                            token.phone = user.user_phone ?? "";
                            token.address = user.user_address ?? {};
                            token.newUser = user.new_user;
                        }
                        else {
                            const checkUserProducer = await sql`SELECT business_name, 
                            business_type, business_location
                            FROM producers WHERE user_id = ${userQuery[0].user_id}`;

                            let isUserProducer = false;

                            //console.log(checkUserProducer);
                            if (checkUserProducer.length === 1) {
                                isUserProducer = true;
                            }

                            token.user_id = Number(user.user_id);
                            token.email = user.user_email;
                            token.discord_id = user.discord_id ?? undefined;
                            token.firstName = user.user_first_name ?? "UserFirstName";
                            token.lastName = user.user_last_name ?? "";
                            token.phone = user.user_phone ?? "";
                            token.address = user.user_address ?? {};
                            token.newUser = user.new_user;
                            token.isUserProducer = isUserProducer;

                            if (isUserProducer) {
                                token.business = {
                                    businessName: checkUserProducer[0].business_name,
                                    businessType: checkUserProducer[0].business_type,
                                    businessLocation: checkUserProducer[0].business_location
                                }
                            }
                        }
                    }
                    return token;
                }
            }

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

        async session({ session, token, user }: { session: Session, token: JWT, user: User | DefaultUser; }) {
            // Ensure that the session gets updated with the correct data from token

            if (token.google_id) {
                if (token.newUser) {
                    session.user.user_id = token.user_id;
                    session.user.email = token.email ?? undefined;
                    session.user.google_id = token.google_id;
                    session.user.firstName = token.firstName;
                    session.user.lastName = token.lastName;
                    session.user.phone = token.phone;
                    session.user.address = token.address;
                    session.user.newUser = token.newUser;
                    session.user.isUserProducer = token.isUserProducer;
                }
                else {
                    session.user.user_id = token.user_id;
                    session.user.email = token.email ?? undefined;
                    session.user.google_id = token.google_id;
                    session.user.firstName = token.firstName;
                    session.user.lastName = token.lastName;
                    session.user.phone = token.phone;
                    session.user.address = token.address;
                    session.user.newUser = token.newUser;
                    session.user.isUserProducer = token.isUserProducer;
                    session.user.business = token.business
                }

                return session;
            }
            else if (token.github_id) {
                if (token.newUser) {
                    session.user.user_id = token.user_id;
                    session.user.email = token.email ?? undefined;
                    session.user.github_id = token.github_id;
                    session.user.firstName = token.firstName;
                    session.user.lastName = token.lastName;
                    session.user.phone = token.phone;
                    session.user.address = token.address;
                    session.user.newUser = token.newUser;
                    session.user.isUserProducer = token.isUserProducer;
                }
                else {
                    session.user.user_id = token.user_id;
                    session.user.email = token.email ?? undefined;
                    session.user.github_id = token.github_id;
                    session.user.firstName = token.firstName;
                    session.user.lastName = token.lastName;
                    session.user.phone = token.phone;
                    session.user.address = token.address;
                    session.user.newUser = token.newUser;
                    session.user.isUserProducer = token.isUserProducer;
                    session.user.business = token.business
                }

                return session;
            }
            else if (token.discord_id) {
                if (token.newUser) {
                    session.user.user_id = token.user_id;
                    session.user.email = token.email ?? undefined;
                    session.user.discord_id = token.discord_id;
                    session.user.firstName = token.firstName;
                    session.user.lastName = token.lastName;
                    session.user.phone = token.phone;
                    session.user.address = token.address;
                    session.user.newUser = token.newUser;
                    session.user.isUserProducer = token.isUserProducer;
                }
                else {
                    session.user.user_id = token.user_id;
                    session.user.email = token.email ?? undefined;
                    session.user.discord_id = token.discord_id;
                    session.user.firstName = token.firstName;
                    session.user.lastName = token.lastName;
                    session.user.phone = token.phone;
                    session.user.address = token.address;
                    session.user.newUser = token.newUser;
                    session.user.isUserProducer = token.isUserProducer;
                    session.user.business = token.business
                }

                return session;
            }

            session.user.user_id = token.user_id;
            session.user.email = token.email ?? undefined;
            session.user.isUserProducer = token.isUserProducer;
            session.user.business = token.business;
            session.user.firstName = token.firstName;
            session.user.lastName = token.lastName;
            session.user.phone = token.phone;
            session.user.address = token.address
            console.log("TOKEN CHECK IF UPDATED", user);
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
