import { Route, Routes } from 'react-router-dom';
import Artikel from './Components/Artikel';
import Banner from './Components/Banner';
import Buku from './Components/Buku';
import Customer from './Components/Customer';
import Header from './Components/Header';
import LoginAdmin from './Components/LoginAdmin';
import Main from './Components/Main';
import Portal from './Components/Portal';
import SideBar from './Components/SideBar';
import SiteConfig from './Components/SiteConfig';

function App() {
    return (
        <div>
            <Routes>
                <Route exact index element={<Portal/>} />
                <Route exact path='/admin' element={<Main/>}>
                    <Route exact index element={<SiteConfig/>}/>
                    <Route exact path='banner' element={<Banner/>} />
                    <Route exact path='artikel' element={<Artikel/>} />
                    <Route exact path='buku' element={<Buku/>} />
                    <Route exact path='customer' element={<Customer/>} />
                </Route>
                <Route exact path='login' element={<LoginAdmin/>} />
            </Routes>
        </div>
    );
}

export default App;
