
import Footer from '../footer/Footer.jsx'
import Navbar from '../navbar/Navbar.jsx'

export default function Layout({children}) {
  return (
    <div>
        <Navbar/>
        <div className="main-content min-h-screen">
            {children}
        </div>
        <Footer/>
    </div>
  )
}
