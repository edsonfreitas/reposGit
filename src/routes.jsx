import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Main'
import Repos from './pages/Repositorio'
import NotFound from './pages/NotFound'

export default function AppRoutes(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/repositorio/:repositorio' element={<Repos/>} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}
