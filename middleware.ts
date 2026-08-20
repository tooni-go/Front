import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/',
  },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/cursos/:path*',
    '/alumnos/:path*',
    '/examenes/:path*',
    '/entregas/:path*',
    '/perfil/:path*',
  ],
};
