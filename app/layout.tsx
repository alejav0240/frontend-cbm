// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import {MainProvider} from "@/config/providers/main-provider";

export const metadata: Metadata = {
  title: {
    default: 'Centro Boliviano de Musicoterapia',
    template: '%s | Centro Boliviano de Musicoterapia'
  },
  description: 'Bienestar, rehabilitación y salud integral a través del sonido y la armonía en Bolivia.',
  keywords: ['musicoterapia', 'bolivia', 'salud mental', 'rehabilitación', 'bienestar', 'terapia sonora', 'TEA'],
  authors: [{ name: 'Centro Boliviano de Musicoterapia' }],
  creator: 'Centro Boliviano de Musicoterapia',
  openGraph: {
    type: 'website',
    locale: 'es_BO',
    url: 'https://musicoterapiabolivia.com',
    title: 'Centro Boliviano de Musicoterapia',
    description: 'Bienestar y salud integral a través del sonido y la armonía.',
    siteName: 'Centro Boliviano de Musicoterapia',
    images: [
      {
        url: '/logohorizontal.png',
        width: 1200,
        height: 630,
        alt: 'Centro Boliviano de Musicoterapia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Centro Boliviano de Musicoterapia',
    description: 'Bienestar y salud integral a través del sonido y la armonía.',
    images: ['/logohorizontal.png'],
  },
  icons: {
    icon: '/logocortoicono.png',
    apple: '/logocortoicono.png',
  },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      // suppressHydrationWarning es obligatorio al usar next-themes
      <html lang="es" suppressHydrationWarning>
      <body>
        <MainProvider>
          {children}
        </MainProvider>
      </body>
      </html>
  );
}