import Link from 'next/link';
import './globals.css';
import RegistrarServiceWorker from '@/components/RegistrarServiceWorker';
import AvisoConexion from '@/components/AvisoConexion';

export const metadata = {
  title: 'Yerbapedia',
  description: 'Catálogo de yerbas mate: marcas, tipos, precios y puntajes.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Yerbapedia',
    statusBarStyle: 'default',
  },
};

export const viewport = {
  themeColor: '#2f5d34',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <header className="encabezado">
          <div className="contenedor encabezado-interno">
            <Link href="/" className="logo">
              <span aria-hidden="true">🧉</span> Yerbapedia
            </Link>
            <nav className="menu">
              <Link href="/">Yerbas</Link>
              <Link href="/yerbas/nueva" className="boton boton-chico">+ Nueva yerba</Link>
            </nav>
          </div>
        </header>

        <AvisoConexion />

        <main className="contenedor">{children}</main>

        <footer className="pie">
          <div className="contenedor">
            TP Integrador · Programación Web Dinámica · EPET Nº 30 · 2026
          </div>
        </footer>

        <RegistrarServiceWorker />
      </body>
    </html>
  );
}
