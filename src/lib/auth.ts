import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from 'next-auth/providers/google'

function getGoogleCredentials (){
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if(!clientId || clientId.length === 0) throw new Error('missing google_client_id')
    if(!clientSecret || clientSecret.length === 0) throw new Error('missing google_client_secret')

    return { clientId, clientSecret }
}


export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt'
    },

    pages: {
        signIn: '/login'
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        })
    ],
    callbacks: {
        async jwt({ token, user }){
            const dbUser = (await db.get(`user: ${token.id}`)) as User | null

            if(!dbUser){
                if(user){
                    token.id = user!.id
                }
                return token
            }

            return {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name,
                picture: dbUser.image
            }
        },

        async session({ session, token }) {
            if (token) {
                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: token.id,
                        name: token.name,
                        email: token.email,
                        image: token.picture,
                    },
                };
            }
        
            return session;
        },
        
        redirect(){
            return '/dashboard'
        }
    }
}