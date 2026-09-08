import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Correo', type: 'email' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        return {
          id: 'usr-demo-1',
          name: credentials.email.split('@')[0],
          email: credentials.email,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.sub = user.id;
      }
      if (account && account.provider === 'google') {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: account.id_token }),
          });

          if (response.ok) {
            const data = await response.json();
            // Se asume que el backend devuelve { accessToken: "..." }
            token.backendJwt = data.accessToken;
          } else {
            console.error("Error en respuesta del backend al hacer login:", response.status);
          }
        } catch (error) {
          console.error("Error al conectar con el backend para intercambio de token:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.backendJwt = token.backendJwt;
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/', // o la página donde reside tu componente de login
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
