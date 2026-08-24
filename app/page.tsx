import { redirect } from 'next/navigation';

export default function HomePage() {
  // Aquí podemos comprobar la sesión con Auth.js servidor-side
  // Si está autenticado redirige al dashboard, sino, mostramos login
  redirect('/dashboard');
}
