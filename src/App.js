import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import NotFound from './components/NotFound';
import Home from './pages/Home';
import About from './pages/About';
import Forum from './pages/Forum';
import Thread from './pages/Thread';
import ThreadList from './components/ThreadList';
import Post from './pages/Post';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

function App() {
    const location = useLocation();
    const modalBackground = location.state && location.state.modalBackground;

    return (
        <>
            <div className='nav-box' />
            <Navbar />
            <Routes location={modalBackground || location}>
                <Route path='/' element={<Home />} />
                <Route path='about' element={<About />} />
                <Route path='login' element={<Login />} />
                <Route path='signup' element={<Signup />} />
                <Route path=':forumURL' element={<Forum />}>
                    <Route index element={<ThreadList />} />
                    <Route exact path='thread/:threadID' element={<Thread />} >
                        <Route exact path='comment/:commentID' element={null} />
                    </Route>
                    <Route path='post' element={<Post deepLink={true} />} />
                </Route>
                <Route path='user/:userID' element={<Profile />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
            {modalBackground && ( // Modal routes with previous route in the background
                <Routes>
                    <Route path=':forumURL/post' element={<Post />} />
                    <Route path='signup' element={<Signup />} />
                    <Route path='login' element={<Login />} />
                </Routes>
            )}
        </>
    );
}

export default App;
