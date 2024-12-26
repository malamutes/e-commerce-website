import { JWT } from "next-auth/jwt"
import NextAuth from "next-auth"

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        /** OpenID ID Token */
        user_id?: number
        isUserProducer?: boolean
        business?: {
            businessName: string,
            businessLocation: string,
            businessType: string
        }
    }
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's postal address. */
            user_id?: number
            email?: string,
            isUserProducer?: boolean
            business?: {
                businessName: string,
                businessLocation: string,
                businessType: string
            }
        }
    }

    interface DefaultUser {
        isUserProducer?: boolean
        business?: {
            businessName: string,
            businessLocation: string,
            businessType: string
        }
    }

}

//https://next-auth.js.org/getting-started/typescript