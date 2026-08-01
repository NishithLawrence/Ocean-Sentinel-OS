import { motion } from 'framer-motion'
import Footer from '../components/common/Footer.jsx'
import Navbar from '../components/common/Navbar.jsx'
import Sidebar from '../components/common/Sidebar.jsx'
export default function AppLayout({ children }) { return <div className="min-h-screen lg:flex"><Sidebar /><div className="min-w-0 flex-1"><Navbar /><motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }} className="mx-auto min-h-[calc(100vh-5rem)] max-w-7xl p-4 sm:p-7">{children}</motion.main><Footer /></div></div> }
