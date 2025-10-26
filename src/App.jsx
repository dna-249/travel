
import React, { useState,lazy } from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './components/home'
import ReportPage from './components/reportPage'
import ReportInputForm from './components/form'
function App() {
  

  return (
   
       <Routes>
           <Route path='/a' element={<ReportPage/>}/>
           <Route path='/' element={<ReportInputForm/>}/>
       </Routes>
   
  )
}

export default App
