import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // Podríamos inyectar info adicional desde el token al objeto session.
        // @ts-ignore - Agregamos el ID del proveedor si es necesario
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
