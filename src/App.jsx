
import React, { useState,lazy } from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './components/home'
import ReportPage from './components/reportPage'
function App() {
  

  return (
   
       <Routes>
           <Route path='/' element={<ReportPage/>}/>
       </Routes>
   
  )
}

export default App
