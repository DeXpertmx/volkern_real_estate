import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NextAuthProvider } from '@/components/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Volkern Properties | Luxury Real Estate & Premium Living',
  description: 'Propiedades exclusivas con el respaldo y la confianza de Volkern Properties.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 flex h-20 items-center justify-between">
              <a href="/" className="flex items-center">
                <img src="/logo.png" alt="Volkern Properties" className="h-12 w-auto" />
              </a>
              <nav className="hidden md:flex gap-8">
                <a href="#inicio" className="text-sm font-medium hover:text-blue-600 transition-colors">Inicio</a>
                <a href="#propiedades" className="text-sm font-medium hover:text-blue-600 transition-colors">Propiedades</a>
                <a href="#destacados" className="text-sm font-medium hover:text-blue-600 transition-colors">Destacados</a>
              </nav>
              <div className="flex items-center gap-4">
                <a href="#contacto" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors hidden md:block">Contacto</a>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <NextAuthProvider>{children}</NextAuthProvider>
          </main>

          <footer id="contacto" className="bg-slate-900 text-slate-300 py-16">
            <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center mb-6">
                  <img src="/logo.png" alt="Volkern" className="h-10 brightness-0 invert" />
                </div>
                <p className="max-w-md">Expertos en el mercado inmobiliario premium, ofreciendo soluciones personalizadas y confianza en cada transacción.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Servicios</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors">Venta</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Renta</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Consultoría</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Contacto</h4>
                <ul className="space-y-2">
                  <li>info@volkern.com</li>
                  <li>+1 234 567 890</li>
                  <li>Madrid, España</li>
                </ul>
              </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-sm">
              <p>&copy; 2026 Volkern Properties. Todos los derechos reservados.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
