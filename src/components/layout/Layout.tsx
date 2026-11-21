import { Outlet } from 'react-router-dom'
import { ScrollToTop } from '../ui/ScrollToTop'
import { Toaster } from '../ui/Toaster'
import { Footer } from './Footer'
import { Header } from './Header'
import { WhatsAppFloat } from './WhatsAppFloat'

export function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <Toaster />
    </>
  )
}
