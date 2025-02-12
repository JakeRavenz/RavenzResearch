import Navbar from '../components/Navbar';
import Home from './Home';
import Jobs from './Jobs';
import Companies from './pages/Companies';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Footer from './Footer';

const landingPage = () => {
    return (
        <>
            <Navbar />
            <Home />
            <Jobs />
            <Footer />
        </>
    );
}

export default landingPage;