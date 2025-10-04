import Hero from './Hero'
import Menu from './Menu'
import About from './About'
import Contact from './Contact'
import Footer from '../components/Footer'
const Homepage = () => {
    return (
        <>
            <div>
                <div id="home">
                    <Hero />
                </div>
                <div id="menu">
                    <Menu />
                </div>
                <div id="about">
                    <About />
                </div>
                <div id="contact">
                    <Contact />
                </div>
                <Footer />
            </div>
        </>

    )
}

export default Homepage
