
import { DBAddressInterface } from "@/app/DataInterfaces"

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        /** OpenID ID Token */
        user_id?: number
        isUserProducer?: boolean
        firstName?: string,
        lastName?: string,
        phone?: string,
        address?: DBAddressInterface,
        newUser?: boolean,
        google_id?: string,
        github_id?: string,
        discord_id?: string,
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
    export interface Session {
        user: {
            /** The user's postal address. */
            user_id?: number
            email?: string,
            isUserProducer?: boolean
            firstName?: string,
            lastName?: string,
            phone?: string,
            address?: DBAddressInterface,
            newUser?: boolean,
            google_id?: string,
            github_id?: string,
            discord_id?: string,
            business?: {
                businessName: string,
                businessLocation: string,
                businessType: string
            }
        }
    }

    interface DefaultUser {
        isUserProducer?: boolean
        firstName?: string,
        lastName?: string,
        phone?: string,
        address?: DBAddressInterface,
        newUser?: boolean,
        google_id?: string,
        business?: {
            businessName: string,
            businessLocation: string,
            businessType: string
        }
    }
}

//https://next-auth.js.org/getting-started/typescript