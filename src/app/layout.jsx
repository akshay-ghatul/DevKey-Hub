import { Geist } from 'next/font/google'
import './globals.css'
import SessionProvider from '../components/auth/SessionProvider'
import WelcomeModal from '../components/auth/WelcomeModal'

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProvider>
          {children}
          <WelcomeModal />
        </SessionProvider>
      </body>
    </html>
  )
}