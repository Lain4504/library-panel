import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/Header";
import Content from "../Body/content";
import { useLocation } from 'react-router-dom';

function Home() {
    const location = useLocation();
    const hideHeader = location.pathname === '/login' || location.pathname === '/register';

    return (
        <>
            {!hideHeader && <Header />}
            <Content />
            <Footer />
        </>
    )
}
export default Home;