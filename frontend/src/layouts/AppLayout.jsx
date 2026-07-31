import Footer from '../components/common/Footer.jsx'
import Navbar from '../components/common/Navbar.jsx'
import Sidebar from '../components/common/Sidebar.jsx'
export default function AppLayout({ children }) { return <div className="min-h-screen"><Navbar /><div className="flex"><Sidebar /><main className="min-w-0 flex-1 p-6">{children}</main></div><Footer /></div> }
