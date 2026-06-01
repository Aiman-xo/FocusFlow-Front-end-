import { useState } from 'react'
import './App.css'
import {Routes,Route,BrowserRouter} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashBoard from './pages/DashBoard'
import NewTask from './pages/NewTask'
import TodaysTask from './pages/TodaysTask'
import ProtectedRoute from './pages/ProtectedRoute'

function App() {

  return (
    <>
   
    <Routes>

      <Route path='/login' element={<LoginPage/>}></Route>

      <Route element={<ProtectedRoute/>}>
        <Route path='/dashboard' element={<DashBoard/>}></Route>
        <Route path='/add-new-task' element={<NewTask/>}></Route>
        <Route path='/todays-task' element={<TodaysTask/>}></Route>
      </Route>
      
     {/* <div>YOOO</div>  */}
    </Routes>
    
    
    
    </>
  )
}

export default App
