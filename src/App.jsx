
import React, { useState,lazy } from 'react'
import { Route,Routes } from 'react-router-dom'
import ReportPage from './components/reportPage'
import DataEntryForm from './components/form'
import StudentSignIn from './components/home'
import StudentSignupForm from './components/signUp'
import AdminPinPage from './components/pinPage'
import AdminDashboard from './components/admin'
import Scroll from './components/test'
import Pay from './components/pay'
import WeeklyReport from './components/prograss'
function App() {
  

  return (
   
       <Routes>s
           <Route path='/portal/:id' element={<ReportPage/>}/>
           <Route path='/entry' element={<DataEntryForm/>}/>
           <Route path='/' element={<StudentSignIn/>}/>
           <Route path='/test' element={<Scroll />}/>
           <Route path='/admin' element={<AdminDashboard/>}/>
           <Route path='/pin' element={<AdminPinPage/>}/>
           <Route path='/pay' element={<Pay/>}/>
           <Route path='/view' element={<WeeklyReport/>}/>
           <Route path='/prograss' element={<WeeklyReport/>}/>
           <Route path='/signup' element={<StudentSignupForm/>}/>
           
       </Routes>
   
  )
}

export default App
