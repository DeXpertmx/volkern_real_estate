import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "admin@volkern.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Mocked admin user for Phase 3
                if (credentials?.email === "admin@volkern.com" && credentials?.password === "admin") {
                    return { id: "1", name: "Admin Volkern", email: "admin@volkern.com", role: "ADMIN" };
                }
                return null;
            }
        })
    ],

    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                (session.user as { role?: string; id?: string }).role = token.role as string;
                (session.user as { role?: string; id?: string }).id = token.id as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as { role?: string }).role;
                token.id = user.id;
            }
            return token;
        }
    }
};
