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
    const background = location.state && location.state.background

    return (
        <>
            <Navbar />
            <Routes location={background || location}>
                <Route path='/' element={<Home />} />
                <Route path=':forumURL' element={<Forum />}>
                    <Route index element={<ThreadList />} />
                    <Route path='thread/:threadID' element={<Thread />} />
                    <Route path='post' element={<ThreadList><Post deepLink={true} /></ThreadList>} />
                </Route>
                <Route path='about' element={<About />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
            {background && (
                <Routes>
                    <Route path=":forumURL/post" element={<Post />} />
                </Routes>
            )}
        </>
    )
}

export default App;
