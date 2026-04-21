import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/context/Providers'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'D&D — Premium Food Delivery',
  description: 'Order from the finest restaurants. Fast delivery to your door.',
}

// Injected before React hydrates to avoid theme flash
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('dd-theme') || 'system';
    var dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch(e){}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AnimatedBackground />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
