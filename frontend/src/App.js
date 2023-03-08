import { Route, Routes } from 'react-router-dom';
import Artikel from './Components/Artikel';
import Banner from './Components/Banner';
import Buku from './Components/Buku';
import CreateArtikel from './Components/CreateArtikel.js';
import CreateBanner from './Components/CreateBanner.js';
import CreateBuku from './Components/CreateBuku.js';
import CreateGenre from './Components/CreateGenre.js';
import CreateKategori from './Components/CreateKategori.js';
import CreateSocial from './Components/CreateSocial';
import EditArtikel from './Components/EditArtikel.js';
import EditBanner from './Components/EditBanner.js';
import EditBuku from './Components/EditBuku.js';
import EditGenre from './Components/EditGenre.js';
import EditKategori from './Components/EditKategori.js';
import EditSocial from './Components/EditSocial';
import LoginAdmin from './Components/LoginAdmin';
import Main from './Components/Main';
import Order from './Components/Order.js';
import OrderDetail from './Components/OrderDetail.js';
import Portal from './Components/Portal';
import SiteConfig from './Components/SiteConfig';

function App() {
    return (
        <div className='wrapper'>
            <Routes>
                <Route exact index element={<Portal/>} />
                <Route exact path='/admin' element={<Main/>}>
                    <Route exact index element={<SiteConfig/>}/>
                    <Route exact path='banner' element={<Banner/>} />
                    <Route exact path='banner/create' element={<CreateBanner/>} />
                    <Route exact path='banner/:id' element={<EditBanner/>} />
                    <Route exact path='artikel' element={<Artikel/>} />
                    <Route exact path='artikel/create' element={<CreateArtikel/>}/>
                    <Route exact path='artikel/:id' element={<EditArtikel/>} />
                    <Route exact path='kategori/create' element={<CreateKategori/>}/>
                    <Route exact path='kategori/:id' element={<EditKategori/>}/>
                    <Route exact path='buku' element={<Buku/>} />
                    <Route exact path='buku/create' element={<CreateBuku/>} />
                    <Route exact path='buku/:id' element={<EditBuku/>} />
                    <Route exact path='genre/create' element={<CreateGenre/>} />
                    <Route exact path='genre/:id' element={<EditGenre/>} />
                    <Route exact path='social/create' element={<CreateSocial/>} />
                    <Route exact path='social/:id' element={<EditSocial/>} />
                    <Route exact path='order' element={<Order/>}/>
                    <Route exact path='order/:id' element={<OrderDetail/>} />
                </Route>
                <Route exact path='login' element={<LoginAdmin/>} />
            </Routes>
        </div>
    );
}

export default App;
