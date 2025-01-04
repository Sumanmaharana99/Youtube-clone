import React, { useEffect, useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Video from './pages/Video/Video';

const App = () => {
  
  const [sidebar,setSidebar]=useState(true);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [location]);

  return (
    <div>
      <Navbar setSidebar={setSidebar}/>
      <Routes>
        <Route path='/' element={<Home sidebar={sidebar}/>}/>
        <Route path='/video/:categoryId/:videoId'element={<Video/>} />
      </Routes>
    </div>
  )
}

export default App
