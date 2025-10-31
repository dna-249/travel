
import React, { useState,lazy } from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './components/home'
import ReportPage from './components/reportPage'
import ReportInputForm from './components/form'
import DataEntryForm from './components/form'
import StudentSignIn from './components/home'
import StudentSignupForm from './components/signUp'
function App() {
  

  return (
   
       <Routes>
           <Route path='/portal' element={<ReportPage/>}/>
           <Route path='/' element={<DataEntryForm/>}/>
           <Route path='/home' element={<StudentSignIn/>}/>
           <Route path='/signup' element={<StudentSignupForm/>}/>
           
       </Routes>
   
  )
}

export default App
