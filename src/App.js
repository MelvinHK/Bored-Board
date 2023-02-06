import { useEffect } from 'react'
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

    useEffect(() => {
        document.title = "Bored Bored"
    }, [])

    return (
        <div className='container'>
            <Navbar />
            <div style={{ marginTop: '70px' }}></div>
            <Routes location={postModalBackground || location}>
                <Route path='/' element={<Home />} />
                <Route path=':forumURL' element={<Forum />}>
                    <Route index element={<ThreadList />} />
                    <Route exact path='thread/:threadID' element={<Thread />} />
                    <Route exact path='thread/:threadID/comment/:commentID' element={<Thread />} />
                    <Route path='post' element={<Post deepLink={true} />} />
                </Route>
                <Route path='about' element={<About />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
            {postModalBackground && (
                <Routes>
                    <Route path=":forumURL/post" element={<Post />} />
                </Routes>
            )}
        </div>
    )
}

export default App;
