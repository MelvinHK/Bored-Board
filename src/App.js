import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import NotFound from './components/NotFound'
import Home from './pages/Home'
import About from './pages/About'
import Forum from './pages/Forum'
import Thread from './pages/Thread'
import ThreadList from './components/ThreadList'

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path=':forumURL' element={<Forum />}>
                    <Route path='thread/:threadID' element={<Thread />} />
                    <Route index element={<ThreadList />} />
                </Route>
                <Route path='about' element={<About />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </>
    )
}

export default App;
