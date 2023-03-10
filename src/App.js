import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import NotFound from './components/NotFound'
import Home from './pages/Home'
import About from './pages/About'
import Forum from './pages/Forum'
import Thread from './pages/Thread'
import ThreadList from './components/ThreadList'
import Post from './pages/Post'

function App() {
    const location = useLocation()
    const postModalBackground = location.state && location.state.postModalBackground

    return (
        <>
            <Routes location={postModalBackground || location}>
                <Route path='/' element={<Home />} />
                <Route path='about' element={<About />} />
                <Route path=':forumURL' element={<Forum />}>
                    <Route index element={<ThreadList />} />
                    <Route exact path='thread/:threadID' element={<Thread />} >
                        <Route exact path='comment/:commentID' element={null} />
                    </Route>
                    <Route path='post' element={<Post deepLink={true} />} />
                </Route>
                <Route path='*' element={<NotFound />} />
            </Routes>
            {postModalBackground && (
                <Routes>
                    <Route path=":forumURL/post" element={<Post />} />
                </Routes>
            )}
            <div className='nav-box' />
            <Navbar />
        </>
    )
}

export default App;
